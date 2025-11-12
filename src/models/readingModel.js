import mongoose from "mongoose";

const readingSchema = new mongoose.Schema({
    house: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "House",
        required: true,
    },
    ts: { 
        type: Date, 
        required: true 
    },
    kwh: { // lectura incremental en khw
        type: Number, 
        required: true 
    }, 
    totalKwh: { // lectura total en kwh
        type: Number,
        required: true
    },
    activeAppliances: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "HouseAppliance",
        },
    ],
});

readingSchema.index({ house: 1, ts: -1 });

const Reading = mongoose.model("Reading", readingSchema);
export default Reading;