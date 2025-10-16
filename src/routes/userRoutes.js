import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  getProfile,
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Registro y login
router.post("/register", registerUser);
router.post("/login", loginUser);

// Perfil del usuario autenticado
router.get("/profile", protect, getProfile);

// Listar todos los usuarios (solo admin)
router.get("/", protect, adminOnly, getUsers);

export default router;
