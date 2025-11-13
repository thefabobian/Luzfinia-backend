# ⏰ Documentación de Cron Jobs - Luzfinia Backend

## 📋 Descripción

El sistema incluye tareas programadas (Cron Jobs) que se ejecutan automáticamente en intervalos específicos para mantener el servidor activo y realizar tareas de mantenimiento.

---

## 🔧 Configuración

**Librería utilizada:** `node-cron`
**Archivo principal:** [src/services/cronJobs.js](src/services/cronJobs.js)
**Inicialización:** [server.js:64](server.js:64)

---

## 📅 Cron Jobs Disponibles

### 1️⃣ Keep-Alive Job (Activo)

**Descripción:** Mantiene el servidor activo en Render evitando que se suspenda por inactividad.

**Frecuencia:** Cada 5 minutos

**Cron Expression:** `*/5 * * * *`

**Funcionamiento:**
- Hace una petición HTTPS a la URL del servidor
- Verifica que responda con código 200
- Registra el resultado en la consola

**Código:**
```javascript
cron.schedule("*/5 * * * *", () => {
  const serverUrl = process.env.RENDER_EXTERNAL_URL || "https://luzfinia-backend.onrender.com";

  https.get(serverUrl, (res) => {
    if (res.statusCode === 200) {
      console.log("[Cron] ✅ Servidor activo");
    }
  });
});
```

**Logs esperados:**
```
[Cron] Keep-Alive ping a https://luzfinia-backend.onrender.com - 13/11/2025 15:30:00
[Cron] ✅ Servidor activo
```

---

### 2️⃣ Cleanup Job (Opcional - Desactivado)

**Descripción:** Limpia lecturas antiguas de la base de datos para optimizar espacio.

**Frecuencia:** Diaria a las 3:00 AM

**Cron Expression:** `0 3 * * *`

**Funcionamiento:**
- Elimina lecturas de más de 30 días
- Registra cantidad de documentos eliminados
- Se ejecuta en horario de baja actividad

**Para activar:**
```javascript
// En server.js o cronJobs.js, descomentar:
startCleanupJob();
```

**Código:**
```javascript
cron.schedule("0 3 * * *", async () => {
  const Reading = (await import("../models/readingModel.js")).default;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const result = await Reading.deleteMany({ ts: { $lt: thirtyDaysAgo } });
  console.log(`[Cron] ✅ Eliminadas ${result.deletedCount} lecturas antiguas`);
});
```

---

### 3️⃣ Health Check Job (Opcional - Desactivado)

**Descripción:** Verifica el estado del sistema y genera estadísticas.

**Frecuencia:** Cada 15 minutos

**Cron Expression:** `*/15 * * * *`

**Funcionamiento:**
- Verifica conexión a MongoDB
- Cuenta documentos en colecciones principales
- Registra estadísticas del sistema

**Para activar:**
```javascript
// En server.js o cronJobs.js, descomentar:
startHealthCheckJob();
```

**Logs esperados:**
```
[Cron] Health Check - 13/11/2025 15:45:00
[Cron] ✅ MongoDB conectado
[Cron] 📊 Stats: 15 usuarios, 10 casas, 5420 lecturas
```

---

## 🎯 Sintaxis de Cron Expressions

```
┌────────────── minuto (0-59)
│ ┌──────────── hora (0-23)
│ │ ┌────────── día del mes (1-31)
│ │ │ ┌──────── mes (1-12)
│ │ │ │ ┌────── día de la semana (0-6) (0 = Domingo)
│ │ │ │ │
* * * * *
```

### Ejemplos Comunes:

| Expresión | Descripción |
|-----------|-------------|
| `*/5 * * * *` | Cada 5 minutos |
| `*/15 * * * *` | Cada 15 minutos |
| `0 * * * *` | Cada hora |
| `0 0 * * *` | Cada día a medianoche |
| `0 3 * * *` | Cada día a las 3:00 AM |
| `0 12 * * 0` | Cada domingo a las 12:00 PM |
| `0 0 1 * *` | Primer día de cada mes a medianoche |

---

## 🚀 Uso y Personalización

### Agregar un nuevo Cron Job

**1. Crear la función en `src/services/cronJobs.js`:**

```javascript
export const startMyCustomJob = () => {
  cron.schedule("*/10 * * * *", async () => {
    console.log("[Cron] Mi tarea personalizada ejecutándose");

    try {
      // Tu lógica aquí
      console.log("[Cron] ✅ Tarea completada");
    } catch (error) {
      console.error("[Cron] ❌ Error:", error.message);
    }
  });

  console.log("✅ Mi Cron Job personalizado iniciado");
};
```

**2. Agregar a `startAllCronJobs()`:**

```javascript
export const startAllCronJobs = () => {
  startKeepAliveJob();
  startMyCustomJob(); // ← Agregar aquí
};
```

### Cambiar frecuencia del Keep-Alive

```javascript
// De cada 5 minutos a cada 10 minutos:
cron.schedule("*/10 * * * *", () => {
  // ...
});

// O cada 3 minutos:
cron.schedule("*/3 * * * *", () => {
  // ...
});
```

---

## 🔍 Monitoreo y Debugging

### Ver logs de Cron Jobs

En desarrollo local:
```bash
npm start
```

Los logs se mostrarán en la consola:
```
✅ Cron Job Keep-Alive iniciado (cada 5 minutos)
[Cron] Keep-Alive ping a https://luzfinia-backend.onrender.com - 13/11/2025 15:30:00
[Cron] ✅ Servidor activo
```

En Render (producción):
1. Ve a tu servicio en Render Dashboard
2. Click en "Logs"
3. Busca mensajes con prefijo `[Cron]`

### Verificar que funciona correctamente

**Keep-Alive:**
```javascript
// Debe aparecer cada 5 minutos:
[Cron] Keep-Alive ping a https://luzfinia-backend.onrender.com - [timestamp]
[Cron] ✅ Servidor activo
```

**Si hay errores:**
```javascript
[Cron] ❌ Error en keep-alive: [mensaje de error]
```

---

## ⚙️ Variables de Entorno

El Keep-Alive job usa la variable `RENDER_EXTERNAL_URL` si está disponible:

```env
# .env (opcional)
RENDER_EXTERNAL_URL=https://luzfinia-backend.onrender.com
```

Si no está definida, usa el valor por defecto hardcodeado.

---

## 🛠️ Detener Cron Jobs

Los cron jobs se detienen automáticamente cuando se detiene el servidor.

Para detener manualmente en código:

```javascript
const task = cron.schedule("*/5 * * * *", () => {
  console.log("Tarea ejecutándose");
});

// Detener la tarea
task.stop();

// Reiniciar la tarea
task.start();
```

---

## 📊 Beneficios del Keep-Alive

### ¿Por qué es necesario en Render?

**Plan gratuito de Render:**
- Suspende servicios después de 15 minutos de inactividad
- Primera petición después de suspensión puede tardar 30-60 segundos (cold start)
- El Keep-Alive previene la suspensión

**Con Keep-Alive activo:**
- ✅ Servidor siempre disponible
- ✅ Respuestas instantáneas
- ✅ Socket.io mantiene conexiones activas
- ✅ Mejor experiencia de usuario

---

## 🚨 Consideraciones Importantes

### Rendimiento

- **Keep-Alive (cada 5 min):** Mínimo impacto
- **Health Check (cada 15 min):** Bajo impacto (solo lecturas)
- **Cleanup (1 vez al día):** Impacto medio (escrituras)

### Costos

- En plan gratuito de Render: Sin costo adicional
- Keep-Alive consume horas de servicio pero mantiene disponibilidad

### Mejores Prácticas

1. **No usar intervalos muy cortos** (<3 minutos) - desperdicia recursos
2. **Ejecutar tareas pesadas en horarios de baja actividad** (madrugada)
3. **Siempre incluir try-catch** en tareas asíncronas
4. **Loggear resultados** para debugging

---

## 📝 Ejemplos de Uso Avanzado

### Enviar reporte diario por email

```javascript
export const startDailyReportJob = () => {
  cron.schedule("0 8 * * *", async () => {
    console.log("[Cron] Generando reporte diario");

    const Reading = (await import("../models/readingModel.js")).default;
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const stats = await Reading.aggregate([
      { $match: { ts: { $gte: yesterday } } },
      { $group: {
        _id: "$house",
        totalKwh: { $sum: "$kwh" }
      }}
    ]);

    console.log("[Cron] Reporte:", stats);
    // Aquí enviar email con los stats
  });
};
```

### Backup automático

```javascript
export const startBackupJob = () => {
  cron.schedule("0 4 * * 0", async () => {
    console.log("[Cron] Iniciando backup semanal");

    // Lógica de backup
    // Ejemplo: exportar a JSON, enviar a S3, etc.

    console.log("[Cron] ✅ Backup completado");
  });

  console.log("✅ Backup Job iniciado (domingos 4:00 AM)");
};
```

---

## 🔗 Referencias

- [node-cron Documentation](https://www.npmjs.com/package/node-cron)
- [Crontab Guru](https://crontab.guru/) - Generador de expresiones cron
- [Render Keep-Alive Guide](https://render.com/docs/free#spinning-down-on-idle)

---

## ✅ Resumen

| Cron Job | Estado | Frecuencia | Propósito |
|----------|--------|------------|-----------|
| Keep-Alive | ✅ Activo | Cada 5 min | Mantener servidor activo |
| Cleanup | ⏸️ Desactivado | Diario 3:00 AM | Limpiar datos antiguos |
| Health Check | ⏸️ Desactivado | Cada 15 min | Monitorear sistema |

**Para activar jobs opcionales:**
- Descomentar en [src/services/cronJobs.js](src/services/cronJobs.js:103-104)
- O llamar individualmente en [server.js](server.js)

---

⏰ **Los Cron Jobs mantienen tu servidor siempre activo y saludable**
