import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./src/config/db.js";
import { startSimulation } from "./src/services/simulator.js";

// Variables entorno
dotenv.config();

// Conectar a MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Obtener __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir HTML y archivos estáticos
app.use(express.static(__dirname));

// Importar rutas API
import userRoutes from "./src/routes/userRoutes.js";
import houseRoutes from "./src/routes/houseRoutes.js";
import applianceRoutes from "./src/routes/applianceRoutes.js";
import readingRoutes from "./src/routes/readingRoutes.js";
app.use("/api/users", userRoutes);
app.use("/api/houses", houseRoutes);
app.use("/api/appliances", applianceRoutes);
app.use("/api/readings", readingRoutes);

// Ruta raíz => mostrar HTML de prueba
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "socket-test.html"));
});

// Servidor + Socket.io
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("🔌 Cliente conectado:", socket.id);
  socket.on("disconnect", () => console.log("Cliente desconectado:", socket.id));
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));

// Iniciar simulación
const stopSimulation = startSimulation(io, { intervalMs: 5000, peakFactor: 1.6 });
