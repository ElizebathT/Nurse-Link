const Nurse = require("../models/nurseModel");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const nurseController = {
    // 📌 Create a Nurse Profile
    createNurse: asyncHandler(async (req, res) => {
        const { experience, qualifications } = req.body;

        const nurseExists = await Nurse.findOne({ user: req.user.id });
        if (nurseExists) {
            return res.status(400).json({ message: "Nurse profile already exists" });
        }

        const nurse = await Nurse.create({
            user: req.user.id,
            experience,
            qualifications
        });

        res.status(201).json(nurse);
    }),

    // 📌 Get All Nurses
    getAllNurses: asyncHandler(async (req, res) => {
        const nurses = await Nurse.find().populate("user", "username email phone");
        res.status(200).json(nurses);
    }),

    // 📌 Get Single Nurse by ID
    getNurseById: asyncHandler(async (req, res) => {
        const nurse = await Nurse.findById(req.params.id).populate("user", "username email phone");
        if (!nurse) {
            return res.status(404).json({ message: "Nurse not found" });
        }
        res.status(200).json(nurse);
    }),

    // 📌 Update Nurse Profile
    updateNurse: asyncHandler(async (req, res) => {
        const { experience, qualifications } = req.body;
        const nurse = await Nurse.findOne({ user: req.user.id });

        if (!nurse) {
            return res.status(404).json({ message: "Nurse profile not found" });
        }

        nurse.experience = experience || nurse.experience;
        nurse.qualifications = qualifications || nurse.qualifications;

        const updatedNurse = await nurse.save();
        res.status(200).json(updatedNurse);
    }),

    // 📌 Delete Nurse Profile
    deleteNurse: asyncHandler(async (req, res) => {
        const nurse = await Nurse.findOne({ user: req.user.id });

        if (!nurse) {
            return res.status(404).json({ message: "Nurse profile not found" });
        }

        await nurse.deleteOne();
        res.status(200).json({ message: "Nurse profile deleted successfully" });
    }),
};

module.exports = nurseController;
