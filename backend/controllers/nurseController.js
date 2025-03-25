const Nurse = require("../models/nurseModel");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config()

const nurseController = {
    
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

    
    // 📌 Delete Nurse Profile
    deleteNurse: asyncHandler(async (req, res) => {
        const nurse = await Nurse.findOne({ user: req.user.id });

        if (!nurse) {
            return res.status(404).json({ message: "Nurse profile not found" });
        }

        await nurse.deleteOne();
        res.status(200).json({ message: "Nurse profile deleted successfully" });
    }),

    updateNurse: asyncHandler(async (req, res) => {
        const { username, email, password, experience, qualifications } = req.body;
        const userId = req.user.id; // Assuming authenticated user ID
    
        let user = await User.findById(userId);
    
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    
        // Update user details if provided
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }
        await user.save();
    
        let nurse = await Nurse.findOne({ user: userId });
    
        if (nurse) {
            // Update existing nurse profile
            nurse.experience = experience || nurse.experience;
            nurse.qualifications = qualifications || nurse.qualifications;
            nurse.image = req.file ? req.file.path : nurse.image; // Handle file upload
    
            await nurse.save();
            return res.status(200).json({ message: "Nurse profile updated successfully", nurse });
        } 
        else{
            throw new Error("Nurse not found")
        }
    }),
    
};

module.exports = nurseController;
