const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Patient = require("../models/patientModel");

const adminController = {
    // Approve a provider
    approveProvider: asyncHandler(async (req, res) => {
        const { id } = req.body;
        const provider = await User.findById(id);

        if (!provider) {
            res.status(404);
            throw new Error("User not found");
        }

        provider.verified = true;
        await provider.save();

        res.json({ message: "User approved successfully" });
    }),
    assignNurseToPatient: asyncHandler(async (req, res) => {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admins can assign nurses to patients" });
        }
    
        const { patientId, nurseId } = req.body;
    
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
    
        const nurse = await User.findById(nurseId);
        if (!nurse || nurse.role !== "nurse") {
            return res.status(404).json({ message: "Nurse not found or invalid role" });
        }
    
        patient.assignedNurse = nurseId; // Assuming Patient schema has `assignedNurse`
        await patient.save();
    
        res.status(200).json({ message: "Nurse assigned successfully", patient });
    }),
    
    // Reject a provider
    rejectUser: asyncHandler(async (req, res) => {
        const { id } = req.body;
        const provider = await User.findById(id);

        if (!provider) {
            res.status(404);
            throw new Error("User not found");
        }

        await User.findByIdAndDelete(id);

        res.json({ message: "User rejected and removed" });
    }),

    // Get all users
    getUsers: asyncHandler(async (req, res) => {
        const users = await User.find();
        res.json(users);
    }),

    // Delete a user
    deleteUser: asyncHandler(async (req, res) => {
        const { userId } = req.body;
        await User.findByIdAndDelete(userId);
        res.json({ message: "User deleted successfully" });
    }),
};

module.exports = adminController;