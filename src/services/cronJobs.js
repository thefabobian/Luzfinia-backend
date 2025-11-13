import cron from "node-cron";
import https from "https";

/**
 * Cron Jobs del sistema Luzfinia
 */

/**
 * Keep Alive Job - Mantiene el servidor activo en Render
 * Se ejecuta cada 5 minutos
 */
export const startKeepAliveJob = () => {
  // Cron expression: cada 5 minutos
  // */5 * * * * = cada 5 minutos
  cron.schedule("*/5 * * * *", () => {
    const serverUrl = process.env.RENDER_EXTERNAL_URL || "https://luzfinia-backend.onrender.com";

    console.log(`[Cron] Keep-Alive ping a ${serverUrl} - ${new Date().toLocaleString()}`);

    // Hacer ping al servidor para mantenerlo activo
    https.get(serverUrl, (res) => {
      if (res.statusCode === 200) {
        console.log("[Cron] ✅ Servidor activo");
      } else {
        console.log(`[Cron] ⚠️ Respuesta: ${res.statusCode}`);
      }
    }).on("error", (err) => {
      console.error("[Cron] ❌ Error en keep-alive:", err.message);
    });
  });

  console.log("✅ Cron Job Keep-Alive iniciado (cada 5 minutos)");
};

/**
 * Cleanup Job - Limpia lecturas antiguas (opcional)
 * Se ejecuta cada día a las 3:00 AM
 */
export const startCleanupJob = () => {
  // Cron expression: 0 3 * * * = todos los días a las 3:00 AM
  cron.schedule("0 3 * * *", async () => {
    console.log(`[Cron] Iniciando limpieza de datos - ${new Date().toLocaleString()}`);

    try {
      // Aquí puedes agregar lógica para limpiar datos antiguos
      // Ejemplo: eliminar lecturas de hace más de 30 días

      // const Reading = (await import("../models/readingModel.js")).default;
      // const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      // const result = await Reading.deleteMany({ ts: { $lt: thirtyDaysAgo } });
      // console.log(`[Cron] ✅ Eliminadas ${result.deletedCount} lecturas antiguas`);

      console.log("[Cron] ✅ Limpieza completada");
    } catch (error) {
      console.error("[Cron] ❌ Error en limpieza:", error.message);
    }
  });

  console.log("✅ Cron Job Cleanup iniciado (diario a las 3:00 AM)");
};

/**
 * Health Check Job - Verifica el estado del sistema
 * Se ejecuta cada 15 minutos
 */
export const startHealthCheckJob = () => {
  // Cron expression: */15 * * * * = cada 15 minutos
  cron.schedule("*/15 * * * *", async () => {
    console.log(`[Cron] Health Check - ${new Date().toLocaleString()}`);

    try {
      // Verificar conexión a MongoDB
      const mongoose = (await import("mongoose")).default;
      const isConnected = mongoose.connection.readyState === 1;

      if (isConnected) {
        console.log("[Cron] ✅ MongoDB conectado");

        // Obtener estadísticas básicas
        const House = (await import("../models/houseModel.js")).default;
        const User = (await import("../models/userModel.js")).default;
        const Reading = (await import("../models/readingModel.js")).default;

        const [houseCount, userCount, readingCount] = await Promise.all([
          House.countDocuments(),
          User.countDocuments(),
          Reading.countDocuments()
        ]);

        console.log(`[Cron] 📊 Stats: ${userCount} usuarios, ${houseCount} casas, ${readingCount} lecturas`);
      } else {
        console.log("[Cron] ⚠️ MongoDB desconectado");
      }
    } catch (error) {
      console.error("[Cron] ❌ Error en health check:", error.message);
    }
  });

  console.log("✅ Cron Job Health Check iniciado (cada 15 minutos)");
};

/**
 * Iniciar todos los Cron Jobs
 */
export const startAllCronJobs = () => {
  startKeepAliveJob();      // Mantener servidor activo (cada 5 min)
  // startCleanupJob();       // Limpieza diaria (descomentaroptional)
  // startHealthCheckJob();   // Health check (cada 15 min) (opcional)
};
