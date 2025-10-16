import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// 🧩 Registrar nuevo usuario
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Todos los campos son obligatorios" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "El usuario ya está registrado" });

    const newUser = await User.create({ name, email, password, role: "client" });

    const token = generateToken(newUser);

    res.status(201).json({
      message: "Usuario registrado correctamente",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario", error: error.message });
  }
};

// 🔐 Login de usuario
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user);
      res.json({
        message: "Inicio de sesión exitoso",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ message: "Credenciales inválidas" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
  }
};

// 👁️ Obtener todos los usuarios (solo admin)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};

// 👤 Obtener perfil del usuario autenticado
export const getProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfil", error: error.message });
  }
};
