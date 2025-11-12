import express from "express";
import { getReadingsByHouse, getHouseConsumption, getHouseProfile, getConsuptionStats } from "../controllers/readingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Lecturas (cliente autenticado puede pedir las suyas)
router.get("/house/:houseId", protect, getReadingsByHouse);

// Consumo acumulado
router.get("/house/:houseId/consumption", protect, getHouseConsumption);

// Perfil 24h
router.get("/house/:houseId/profile", protect, getHouseProfile);

// estaditicas por periodo (day, week, month and year)
router.get("/house/:houseId/stats", protect, getConsuptionStats);

export default router;
