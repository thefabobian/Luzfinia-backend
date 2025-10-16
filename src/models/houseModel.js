import mongoose from "mongoose";

const houseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de la casa es obligatorio"],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      required: false,
    },
    appliances: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HouseAppliance", // referencia al electrodoméstico en esa casa
      },
    ],
  },
  { timestamps: true }
);

const House = mongoose.model("House", houseSchema);
export default House;
