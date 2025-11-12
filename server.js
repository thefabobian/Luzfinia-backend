import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import { startSimulation } from "./src/services/simulator.js";

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
connectDB();

// Crear aplicación Express
const app = express();
app.use(cors());
app.use(express.json());

// Importar rutas API
import userRoutes from "./src/routes/userRoutes.js";
import houseRoutes from "./src/routes/houseRoutes.js";
import applianceRoutes from "./src/routes/applianceRoutes.js";
import readingRoutes from "./src/routes/readingRoutes.js";

// Rutas del backend
app.use("/api/users", userRoutes);
app.use("/api/houses", houseRoutes);
app.use("/api/appliances", applianceRoutes);
app.use("/api/readings", readingRoutes);

// Ruta raíz simple (solo para verificación)
app.get("/", (req, res) => {
  res.json({ message: "✅ Servidor LuzFinia en funcionamiento. API lista." });
});

// Crear servidor HTTP y configurar Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // permite conexión desde cualquier frontend
});

// Socket.io - conexiones en tiempo real
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));

// Iniciar simulación de lecturas
const stopSimulation = startSimulation(io, { intervalMs: 5000, peakFactor: 1.6 });
