import House from "../models/houseModel.js";
import HouseAppliance from "../models/houseApplianceModel.js";
import Reading from "../models/readingModel.js";

/**
 * startSimulation(io, options)
 * - io: instancia de socket.io
 * - options.intervalMs: ms entre ticks (default 5000)
 * - options.peakFactor: multiplicador para detectar picos respecto al avg (default 1.6)
 */
export const startSimulation = (io, options = {}) => {
  const intervalMs = options.intervalMs || 5000;
  const peakFactor = options.peakFactor || 1.6;
  console.log(`Iniciando simulador de lecturas (interval ${intervalMs}ms)`);

  const tick = async () => {
    try {
      // obtener casas (todas; si quieres solo ocupadas: { user: { $ne: null } })
      const houses = await House.find().lean();

      for (const house of houses) {
        // obtener electrodomésticos asignados a la casa y que estén encendidos
        const appliances = await HouseAppliance.find({ house: house._id }).populate("baseModel", "powerConsumption name");

        // calcular kWh para este intervalo: sumar powerConsumption de cada appliance encendido
        // asumimos powerConsumption en kWh por intervalo (o por minuto) dependiendo tu definición.
        // Aquí asumimos que powerConsumption es kWh por intervaloUnit (ej. por tick), si quieres por minuto ajusta escala.
        let kwhIncrement = 0;
        const activeAppliances = [];

        for (const a of appliances) {
          if (a.isOn && a.baseModel) {
            // Si powerConsumption está en kWh por minuto y intervalMs != 60000 hay que escalar.
            // Asumiremos que powerConsumption está por intervalo (p. ej. por tick) para simplicidad.
            kwhIncrement += Number(a.baseModel.powerConsumption) || 0;
            activeAppliances.push(a._id);
          }
        }

        if (kwhIncrement <= 0) {
          // No hay consumo en esta casa, pero podemos emitir lecturas de 0 si quieres.
          // Para no guardar demasiadas lecturas en 0, puedes omitir guardar si 0. Aquí guardamos igualmente.
        }

        // actualizar total acumulado
        const newTotal = (house.totalConsumption || 0) + kwhIncrement;

        // persistir Reading y actualizar House.totalConsumption
        const reading = await Reading.create({
          house: house._id,
          ts: new Date(),
          kwh: parseFloat(kwhIncrement.toFixed(6)),
          totalKwh: parseFloat(newTotal.toFixed(6)),
          activeAppliances
        });

        await House.updateOne({ _id: house._id }, { $set: { totalConsumption: newTotal } });

        // emitir lectura por socket
        io.emit("new_reading", {
          houseId: house._id.toString(),
          ts: reading.ts,
          kwh: reading.kwh,
          totalKwh: reading.totalKwh,
          activeAppliances: activeAppliances.map(id => id.toString()),
        });

        // detectar pico: calculamos promedio de últimas N lecturas (ej. 10), si kwhIncrement > avg * peakFactor -> peak
        const lastReadings = await Reading.find({ house: house._id }).sort({ ts: -1 }).limit(10).lean();
        const avg = lastReadings.length ? (lastReadings.reduce((s, r) => s + r.kwh, 0) / lastReadings.length) : 0;
        const isPeak = avg > 0 ? (kwhIncrement > avg * peakFactor) : (kwhIncrement > 0 && kwhIncrement > 0.5); // fallback threshold

        if (isPeak) {
          io.emit("peak_alert", {
            houseId: house._id.toString(),
            ts: new Date(),
            kwh: reading.kwh,
            totalKwh: reading.totalKwh,
            avg,
            message: "Pico de consumo detectado"
          });
        }
      }
    } catch (error) {
      console.error("Error en simulador:", error);
    }
  };

  // Iniciar inmediatamente y luego en interval
  tick();
  const timer = setInterval(tick, intervalMs);

  // retornar función para detener simulador si se necesita
  return () => clearInterval(timer);
};
