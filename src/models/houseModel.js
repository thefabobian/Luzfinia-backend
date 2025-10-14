import mongoose from "mongoose";

const applianceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    appliences: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appliance",
        }
    ],
});

const House = mongoose.model("House", applianceSchema);
export default House;