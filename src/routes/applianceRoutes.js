import express from "express";
import {
  createApplianceModel,
  getApplianceModels,
  assignApplianceToHouse,
  toggleAppliance,
} from "../controllers/applianceController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ADMIN crea modelos globales
router.post("/models", protect, adminOnly, createApplianceModel);

// Ver catálogo global
router.get("/models", getApplianceModels);

// CLIENT agrega electrodoméstico a su casa
router.post("/assign", protect, assignApplianceToHouse);

// CLIENT enciende/apaga electrodoméstico
router.put("/toggle/:id", protect, toggleAppliance);

export default router;
