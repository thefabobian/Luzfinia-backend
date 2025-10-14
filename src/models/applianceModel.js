import mongoose from "mongoose";

const applianceSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    powerConsumption:{
        type: Number,
        required: true,
    },
    isOn:{
        type: Boolean,
        default: false,
    },
    house:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "House",
    },
});

const Appliance = mongoose.model("Appliance", applianceSchema);
export default Appliance;
