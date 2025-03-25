const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Patient = require("../models/patientModel");
const Doctor = require("../models/doctorModel");
const Nurse = require("../models/nurseModel");
require("dotenv").config()
const userController = {
    register: asyncHandler(async (req, res) => {
        const { username, email, password, role,license } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashed_password = await bcrypt.hash(password, 10);

        const userCreated = await User.create({
            username,
            email,
            password: hashed_password,
            role,
            license,
            verified: role === "patient" ? true : false // Automatically verify patients
        });
     
        if (!userCreated) {
            throw new Error("User creation failed");
        }

        res.status(201).json({ message: "User registered successfully, waiting for admin verification" });
    }),

    login: asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!userExist.verified) {
            return res.status(403).json({ message: "Account not verified. Please wait for admin approval." });
        }

        const passwordMatch = await bcrypt.compare(password, userExist.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const payload = {
            email: userExist.email,
            id: userExist.id
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "2d" });
        const role=userExist.role
        res.json({ message: "Login successful", token,role });
    }),

    logout: asyncHandler(async (req, res) => {
        res.clearCookie("token");
        res.json({ message: "User logged out" });
    }),

    profile: asyncHandler(async (req, res) => {
        const { username, email, password, role, phone, address } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.role = role || user.role;
        user.phone = phone || user.phone;
        user.address = address || user.address;

        const updatedUser = await user.save();
        if (!updatedUser) {
            return res.status(500).json({ message: "Error updating profile" });
        }

        res.json({ message: "User profile updated successfully" });
    }),

    getUserProfile: asyncHandler(async (req, res) => {
        const userId = req.user.id;

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User details retrieved successfully", user });
    }),

    registerUser : asyncHandler(async (req, res) => {
        const { username, email, password, role, stateMedicalCouncil, registrationNumber } = req.body;
    
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: "User already exists" });
        }
    
        // Hash password
        const hashed_password = await bcrypt.hash(password, 10);
    
        // Create user
        const userCreated = await User.create({
            username,
            email,
            password: hashed_password,
            role,
            verified: false 
        });
    
        if (!userCreated) {
            throw new Error("User creation failed");
        }
    
        if (role === "nurse") {
            if (!req.file) {
                return res.status(400).json({ message: "Image of card is required" });
            }
    
            await Nurse.create({
                user: userCreated._id,
                image: req.file.path
            });
        } else if (role === "doctor") {
            if (!stateMedicalCouncil || !registrationNumber) {
                return res.status(400).json({ message: "State Medical Council and Registration Number are required" });
            }
    
            await Doctor.create({
                user: userCreated._id,
                stateMedicalCouncil,
                registrationNumber
            });
        } else {
            return res.status(400).json({ message: "Invalid role" });
        }
    
        const payload = {
            name: userCreated.username,
            email: userCreated.email,
            role: userCreated.role,
            id: userCreated.id
        };
    
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
        res.json(token);
    })
};

module.exports = userController;
