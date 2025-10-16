import mongoose from "mongoose";

const applianceModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del electrodoméstico es obligatorio"],
      trim: true,
    },
    powerConsumption: {
      type: Number,
      required: [true, "El consumo de energía es obligatorio (kWh)"],
      min: [0.01, "El consumo debe ser mayor que 0"],
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const ApplianceModel = mongoose.model("ApplianceModel", applianceModelSchema);
export default ApplianceModel;
