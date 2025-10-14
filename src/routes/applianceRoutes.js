import express from "express";
import {
  addAppliance,
  getAppliancesByHouse,
  toggleAppliance,
} from "../controllers/applianceController.js";

const router = express.Router();

// Crear electrodoméstico
router.post("/", addAppliance);

// Obtener electrodomésticos por casa
router.get("/:houseId", getAppliancesByHouse);

// Encender/apagar electrodoméstico
router.put("/toggle/:id", toggleAppliance);

export default router;
