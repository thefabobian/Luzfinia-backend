import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Verificar si el usuario está autenticado
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No se proporcionó token" });
  }
};

// Verificar si el usuario es admin
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Acceso denegado. Solo administradores." });
  }
};
