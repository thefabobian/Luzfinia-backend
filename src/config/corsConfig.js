import cors from "cors";

const allowedOrigins = [
  "http://localhost:5173", // React local (desarrollo)
  "https://luzfinia.onrender.com", // Frontend en producción
];

export const corsOptions = {
  origin: function (origin, callback) {
    // Permitir peticiones sin origin (como Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Origen no permitido por CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};
