import House from "../models/houseModel.js";
import User from "../models/userModel.js";

// Crear una nueva casa
export const createHouse = async (req, res) => {
  try {
    const { userId, name } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const house = await House.create({ name, user: userId });
    res.status(201).json({ message: "Casa creada correctamente", house });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear casa",
      error: error.message,
    });
  }
};

// Obtener todas las casas del sistema
export const getAllHouses = async (req, res) => {
  try {
    const houses = await House.find()
      .populate("user", "name email") // muestra el nombre y correo del dueño
      .populate("appliances"); // muestra los electrodomésticos asociados
    res.json(houses);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener todas las casas",
      error: error.message,
    });
  }
};

// Obtener todas las casas de un usuario
export const getHousesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const houses = await House.find({ user: userId }).populate("appliances");
    res.json(houses);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener casas",
      error: error.message,
    });
  }
};
