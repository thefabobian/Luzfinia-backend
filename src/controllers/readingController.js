import Reading from "../models/readingModel.js";
import House from "../models/houseModel.js";

// Obtener lecturas de una casa (con filtros opcionales)
export const getReadingsByHouse = async (req, res) => {
  try {
    const { houseId } = req.params;
    const { limit = 100, from, to } = req.query;

    const filter = { house: houseId };
    if (from) filter.ts = { ...(filter.ts || {}), $gte: new Date(from) };
    if (to) filter.ts = { ...(filter.ts || {}), $lte: new Date(to) };

    const readings = await Reading.find(filter).sort({ ts: -1 }).limit(Number(limit));
    res.json(readings);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener lecturas", error: error.message });
  }
};

// Obtener consumo acumulado actual de la casa
export const getHouseConsumption = async (req, res) => {
  try {
    const { houseId } = req.params;
    const house = await House.findById(houseId).select("totalConsumption");
    if (!house) return res.status(404).json({ message: "Casa no encontrada" });
    res.json({ houseId, totalConsumption: house.totalConsumption });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener consumo", error: error.message });
  }
};

// Calcular perfil básico (matutino/nocturno/equilibrado) desde últimas 24h
export const getHouseProfile = async (req, res) => {
  try {
    const { houseId } = req.params;
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const readings = await Reading.find({ house: houseId, ts: { $gte: since } }).lean();

    if (!readings.length) return res.json({ profile: "sin_datos", reason: "No hay lecturas en las últimas 24h" });

    // Agrupar por franjas horarias: mañana(6-12), tarde(12-18), noche(18-6)
    const sums = { morning: 0, afternoon: 0, night: 0 };
    readings.forEach(r => {
      const h = new Date(r.ts).getHours();
      if (h >= 6 && h < 12) sums.morning += r.kwh;
      else if (h >= 12 && h < 18) sums.afternoon += r.kwh;
      else sums.night += r.kwh;
    });

    // Determinar perfil
    const max = Math.max(sums.morning, sums.afternoon, sums.night);
    let profile = "equilibrado";
    if (max === sums.morning) profile = "matutino";
    else if (max === sums.night) profile = "nocturno";
    else profile = "equilibrado";

    res.json({ profile, sums });
  } catch (error) {
    res.status(500).json({ message: "Error al calcular perfil", error: error.message });
  }
};
