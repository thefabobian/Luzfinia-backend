import mongoose from "mongoose";

const houseApplianceSchema = new mongoose.Schema(
  {
    house: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "House",
      required: true,
    },
    baseModel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ApplianceModel",
      required: true,
    },
    customName: {
      type: String,
      trim: true,
      default: "",
    },
    isOn: {
      type: Boolean,
      default: false,
    },
    lastToggledAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const HouseAppliance = mongoose.model("HouseAppliance", houseApplianceSchema);
export default HouseAppliance;
