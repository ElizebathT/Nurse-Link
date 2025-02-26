const EmergencyAssistance = require("../models/emergencyModel");
const asyncHandler = require("express-async-handler");

const emergencyAssistanceController = {
  // Create a new Emergency Assistance request
  createEmergencyAssistance: asyncHandler(async (req, res) => {
    const { patientId, location } = req.body;

    const newEmergencyAssistance = new EmergencyAssistance({
      patientId,
      location,
    });

    const savedEmergencyAssistance = await newEmergencyAssistance.save();
    res.status(201).json(savedEmergencyAssistance);
  }),

  // Get all Emergency Assistance requests
  getAllEmergencyAssistance: asyncHandler(async (req, res) => {
    const emergencyAssistanceRequests = await EmergencyAssistance.find().populate('patientId').sort({ status: 1 });;
    res.status(200).json(emergencyAssistanceRequests);
  }),

  // Get a single Emergency Assistance request by ID
  getEmergencyAssistanceById: asyncHandler(async (req, res) => {
    const { id } = req.body;
    const emergencyAssistanceRequest = await EmergencyAssistance.findById(id).populate('patientId');

    if (!emergencyAssistanceRequest) {
      res.status(404);
      throw new Error("Emergency Assistance request not found");
    }

    res.status(200).json(emergencyAssistanceRequest);
  }),

  // Update an Emergency Assistance request by ID
  updateEmergencyAssistance: asyncHandler(async (req, res) => {
    const { id,status } = req.body;

    const updatedEmergencyAssistance = await EmergencyAssistance.findByIdAndUpdate(
      id,
      { status:status || 'resolved' },
      { new: true }
    );

    if (!updatedEmergencyAssistance) {
      res.status(404);
      throw new Error("Emergency Assistance request not found");
    }

    res.status(200).json(updatedEmergencyAssistance);
  }),

  // Delete an Emergency Assistance request by ID
  deleteEmergencyAssistance: asyncHandler(async (req, res) => {
    const { id } = req.body;
    const deletedEmergencyAssistance = await EmergencyAssistance.findByIdAndDelete(id);

    if (!deletedEmergencyAssistance) {
      res.status(404);
      throw new Error("Emergency Assistance request not found");
    }

    res.status(200).json({ message: "Emergency Assistance request deleted successfully" });
  }),
};

module.exports = emergencyAssistanceController;