// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Crear aplicación Express
const app = express();
app.use(cors());
app.use(express.json());

// Importar rutas (ejemplo)
import userRoutes from "./src/routes/userRoutes.js";
app.use("/api/users", userRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Servidor LuzFinia en funcionamiento ⚡");
});

// Crear servidor HTTP y configurar Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Configurar eventos de Socket.io (si se necesitan más adelante)
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// Inicializar el servidor
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
