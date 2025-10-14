import express from "express";
import { createHouse, getAllHouses, getHousesByUser } from "../controllers/houseController.js";

const router = express.Router();

// Crear casa
router.post("/", createHouse);

// Obtener todas las casas
router.get("/", getAllHouses);

// Obtener casas por usuario
router.get("/user/:userId", getHousesByUser);

export default router;
