import Appliance from "../models/applianceModel.js";
import House from "../models/houseModel.js";
import HouseAppliance from "../models/houseApplianceModel.js";

// 🧑‍💼 ADMIN crea modelo global
export const createApplianceModel = async (req, res) => {
  try {
    const { name, powerConsumption, description } = req.body;
    const appliance = await Appliance.create({ name, powerConsumption, description });
    res.status(201).json({ message: "Modelo creado correctamente", appliance });
  } catch (error) {
    res.status(500).json({ message: "Error al crear modelo", error: error.message });
  }
};

// Ver catálogo global
export const getApplianceModels = async (req, res) => {
  try {
    const appliances = await Appliance.find();
    res.json(appliances);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener modelos", error: error.message });
  }
};

// CLIENT agrega un electrodoméstico a su casa (solo si es suya)
export const assignApplianceToHouse = async (req, res) => {
  try {
    const { houseId, applianceModelId, customName } = req.body;
    const userId = req.user._id;

    const house = await House.findOne({ _id: houseId, user: userId });
    if (!house) return res.status(404).json({ message: "No se encontró la casa o no es de tu propiedad" });

    const applianceInstance = await HouseAppliance.create({
      house: house._id,
      baseModel: applianceModelId,
      customName,
    });

    house.appliances.push(applianceInstance._id);
    await house.save();

    res.status(201).json({
      message: "Electrodoméstico agregado a la casa",
      appliance: applianceInstance,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar electrodoméstico", error: error.message });
  }
};

// CLIENT enciende o apaga su electrodoméstico
export const toggleAppliance = async (req, res) => {
  try {
    const { id } = req.params;
    const appliance = await HouseAppliance.findById(id).populate("baseModel", "name powerConsumption");

    if (!appliance) return res.status(404).json({ message: "Electrodoméstico no encontrado" });

    appliance.isOn = !appliance.isOn;
    await appliance.save();

    res.json({
      message: `El ${appliance.customName || appliance.baseModel.name} se ha ${
        appliance.isOn ? "encendido" : "apagado"
      }`,
      appliance,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al cambiar estado", error: error.message });
  }
};
