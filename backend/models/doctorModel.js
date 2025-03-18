const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    qualifications: { type: String, required: true },
}, { timestamps: true });

const Doctor = mongoose.model("Doctor", DoctorSchema);
module.exports = Doctor;
