const Doctor = require("../models/doctorModel");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const doctorController = {
    // 📌 Create a Doctor Profile
    
    // 📌 Get All Doctors
    getAllDoctors: asyncHandler(async (req, res) => {
        const doctors = await Doctor.find().populate("user", "username email phone");
        res.status(200).json(doctors);
    }),

    // 📌 Get Single Doctor by ID
    getDoctorById: asyncHandler(async (req, res) => {
        const doctor = await Doctor.findById(req.params.id).populate("user", "username email phone");
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        res.status(200).json(doctor);
    }),

    // 📌 Update Doctor Profile
    updateDoctor: asyncHandler(async (req, res) => {
        const { specialization, experience, qualifications } = req.body;
        const doctor = await Doctor.findOne({ user: req.user.id });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor profile not found" });
        }

        doctor.specialization = specialization || doctor.specialization;
        doctor.experience = experience || doctor.experience;
        doctor.qualifications = qualifications || doctor.qualifications;

        const updatedDoctor = await doctor.save();
        res.status(200).json(updatedDoctor);
    }),

    // 📌 Delete Doctor Profile
    deleteDoctor: asyncHandler(async (req, res) => {
        const doctor = await Doctor.findOne({ user: req.user.id });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor profile not found" });
        }

        await doctor.deleteOne();
        res.status(200).json({ message: "Doctor profile deleted successfully" });
    }),
};

module.exports = doctorController;
