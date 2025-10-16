import express from "express";
import {
  createHouse,
  getAvailableHouses,
  purchaseHouse,
  getUserHouses,
  getAllHouses,
} from "../controllers/houseController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ADMIN crea casa
router.post("/", protect, adminOnly, createHouse);

// Público: ver casas disponibles
router.get("/available", getAvailableHouses);

// CLIENT compra casa
router.post("/purchase", protect, purchaseHouse);

// CLIENT ve sus casas
router.get("/user", protect, getUserHouses);

// ADMIN ve todas las casas
router.get("/all", protect, adminOnly, getAllHouses);

export default router;
