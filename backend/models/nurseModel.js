const mongoose = require("mongoose");

const NurseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    experience: { type: Number, required: true },
    qualifications: { type: String, required: true },
}, { timestamps: true });

const Nurse = mongoose.model("Nurse", NurseSchema);
module.exports = Nurse;
