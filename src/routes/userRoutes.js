import express from "express";
import { registerUser, getUsers } from "../controllers/userController.js";

const router = express.Router();

// POST /api/users/register
router.post("/register", registerUser);

// GET /api/users
router.get("/", getUsers);

export default router;
