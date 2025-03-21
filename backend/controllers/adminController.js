const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Patient = require("../models/patientModel");

const adminController = {

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

    getAppointmentReport:async (req, res) => {
        try {
            const { nurseId, patientId, startDate, endDate } = req.query;
    
            // Validate inputs
            if (!startDate || !endDate) {
                return res.status(400).json({ message: "Start date and end date are required." });
            }
    
            let filter = {
                date: { 
                    $gte: new Date(startDate), 
                    $lte: new Date(endDate) 
                }
            };
    
            if (nurseId) {
                filter.nurse = nurseId;
            }
            if (patientId) {
                filter.patient = patientId;
            }
    
            const appointments = await Appointment.find(filter)
                .populate("patient", "name contact")
                .populate("nurse", "name contact")
                .populate("doctor", "name")
                .populate("carePlanId", "title")
                .lean(); // Convert Mongoose docs to plain objects
    
            res.status(200).json(appointments);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server Error" });
        }
    }
    
};

module.exports = adminController;