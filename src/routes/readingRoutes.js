import express from "express";
import { getReadingsByHouse, getHouseConsumption, getHouseProfile } from "../controllers/readingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Lecturas (cliente autenticado puede pedir las suyas)
router.get("/house/:houseId", protect, getReadingsByHouse);

// Consumo acumulado
router.get("/house/:houseId/consumption", protect, getHouseConsumption);

// Perfil 24h
router.get("/house/:houseId/profile", protect, getHouseProfile);

export default router;
