import House from "../models/houseModel.js";
import User from "../models/userModel.js";

//  ADMIN crea una casa disponible
export const createHouse = async (req, res) => {
  try {
    const { name, description } = req.body;

    const house = await House.create({ name, description });
    res.status(201).json({ message: "Casa creada correctamente", house });
  } catch (error) {
    res.status(500).json({ message: "Error al crear casa", error: error.message });
  }
};

//  Ver todas las casas disponibles (sin dueño)
export const getAvailableHouses = async (req, res) => {
  try {
    const houses = await House.find({ user: null }).select("name description");
    res.json(houses);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener casas disponibles", error: error.message });
  }
};

//  CLIENT compra una casa (se vuelve su dueño)
export const purchaseHouse = async (req, res) => {
  try {
    const { houseId } = req.body;
    const userId = req.user._id;

    const house = await House.findById(houseId);
    if (!house) return res.status(404).json({ message: "Casa no encontrada" });
    if (house.user) return res.status(400).json({ message: "Esta casa ya fue comprada por otro usuario" });

    house.user = userId;
    await house.save();

    res.status(200).json({
      message: "Casa comprada correctamente. Ahora eres el propietario.",
      house,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al comprar casa", error: error.message });
  }
};

//  CLIENT ve sus casas
export const getUserHouses = async (req, res) => {
  try {
    const houses = await House.find({ user: req.user._id })
      .populate({
        path: "appliances",
        populate: { path: "baseModel", select: "name powerConsumption" },
      })
      .select("name description appliances");

    res.json(houses);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener casas del usuario", error: error.message });
  }
};

//  ADMIN ve todas las casas del sistema
export const getAllHouses = async (req, res) => {
  try {
    const houses = await House.find()
      .populate("user", "name email")
      .populate({
        path: "appliances",
        populate: { path: "baseModel", select: "name powerConsumption" },
      });

    res.json(houses);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener todas las casas", error: error.message });
  }
};
