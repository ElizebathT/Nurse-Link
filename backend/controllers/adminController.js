const asyncHandler = require("express-async-handler");
const HealthcareProvider = require("../models/healthProviderModel");
const User = require("../models/userModel");

const adminController = {
    // Approve a provider
    approveProvider: asyncHandler(async (req, res) => {
        const { providerId } = req.body;
        const provider = await HealthcareProvider.findById(providerId);

        if (!provider) {
            res.status(404);
            throw new Error("HealthcareProvider not found");
        }

        provider.verified = true;
        await provider.save();

        res.json({ message: "HealthcareProvider approved successfully" });
    }),

    // Reject a provider
    rejectHealthcareProvider: asyncHandler(async (req, res) => {
        const { providerId } = req.body;
        const provider = await HealthcareProvider.findById(providerId);

        if (!provider) {
            res.status(404);
            throw new Error("HealthcareProvider not found");
        }

        await HealthcareProvider.findByIdAndDelete(providerId);

        res.json({ message: "HealthcareProvider rejected and removed" });
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