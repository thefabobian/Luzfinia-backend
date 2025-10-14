import Appliance from "../models/applianceModel.js";
import House from "../models/houseModel.js";

// Crear un nuevo electrodoméstico y asociarlo a una casa
export const addAppliance = async (req, res) => {
  try {
    const { houseId, name, powerConsumption } = req.body;

    if (!houseId || !name || !powerConsumption) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ message: "Casa no encontrada" });
    }

    const newAppliance = await Appliance.create({
      name,
      powerConsumption,
      house: houseId,
    });

    // Asociar el electrodoméstico a la casa
    house.appliances.push(newAppliance._id);
    await house.save();

    res.status(201).json({
      message: "Electrodoméstico agregado correctamente",
      appliance: newAppliance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear electrodoméstico",
      error: error.message,
    });
  }
};

// Obtener todos los electrodomésticos de una casa
export const getAppliancesByHouse = async (req, res) => {
  try {
    const { houseId } = req.params;
    const appliances = await Appliance.find({ house: houseId });
    res.json(appliances);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener electrodomésticos",
      error: error.message,
    });
  }
};

// Encender o apagar un electrodoméstico
export const toggleAppliance = async (req, res) => {
  try {
    const { id } = req.params;
    const appliance = await Appliance.findById(id);

    if (!appliance) {
      return res.status(404).json({ message: "Electrodoméstico no encontrado" });
    }

    appliance.isOn = !appliance.isOn;
    await appliance.save();

    res.json({
      message: `El ${appliance.name} se ha ${appliance.isOn ? "encendido" : "apagado"}`,
      appliance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al cambiar el estado del electrodoméstico",
      error: error.message,
    });
  }
};
