const EmergencyAssistance = require("../models/emergencyModel");
const asyncHandler = require("express-async-handler");
const Patient = require("../models/patientModel");
const Nurse = require("../models/nurseModel");
const Appointment = require("../models/appointmentModel");

// Simulate an emergency notification function
const notifyEmergencyServices = (location) => {
  console.log(`🚑 ALERT! Emergency services notified at location: ${location.lat}, ${location.lng}`);
};

const emergencyAssistanceController = {
  // Create Emergency Assistance Request and Assign a Nurse
  createEmergencyAssistance: asyncHandler(async (req, res) => {
    try {
      const { location, status } = req.body;
      const patient = await Patient.findOne({ user: req.user.id });

      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      if (!location || !location.lat || !location.lng) {
        return res.status(400).json({ message: "Location coordinates are required" });
      }

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0];

      // Find an available nurse
      const availableNurse = await Nurse.findOne({
        _id: {
          $nin: await Appointment.distinct("nurse", {
            date: today, // Ensure correct date filtering
            status: { $in: ["Pending", "Confirmed"] },
          }),
        },
      });

      if (!availableNurse) {
        return res.status(400).json({ message: "No available nurses at this time" });
      }

      const newEmergencyAssistance = new EmergencyAssistance({
        patientId: patient.id,
        location,
        status: status || "pending",
        nurseId: availableNurse._id,
        timestamp: new Date(), // Store the current date and time
      });

      // If critical, escalate the emergency
      if (status === "critical") {
        newEmergencyAssistance.escalationNotified = true;
      }

      const savedEmergencyAssistance = await newEmergencyAssistance.save();

      res.status(201).json({ 
        message: "Emergency request created successfully", 
        emergency: savedEmergencyAssistance, 
        assignedNurse: availableNurse 
      });

    } catch (error) {
      res.status(500).json({ message: `Error creating emergency assistance: ${error.message}` });
    }
  }),

  // Get all Emergency Assistance requests
  getAllEmergencyAssistance: asyncHandler(async (req, res) => {
    try {
      const emergencyRequests = await EmergencyAssistance.find()
        .populate("patientId")
        .populate("nurseId") // Include nurse details
        .sort({ status: 1 });

      res.status(200).json(emergencyRequests);
    } catch (error) {
      res.status(500).json({ message: `Error fetching emergencies: ${error.message}` });
    }
  }),

  // Get Emergency Assistance request by Patient
  getPatientEmergencyAssistance: asyncHandler(async (req, res) => {
    try {
      const patient = await Patient.findOne({ user: req.user.id });
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      const emergencyRequest = await EmergencyAssistance.findOne({ patientId: patient.id })
        .populate("patientId")
        .populate("nurseId");

      if (!emergencyRequest) {
        return res.status(404).json({ message: "Emergency Assistance request not found" });
      }

      res.status(200).json(emergencyRequest);
    } catch (error) {
      res.status(500).json({ message: `Error retrieving emergency request: ${error.message}` });
    }
  }),

  // Update Emergency Assistance Request Status
  updateEmergencyAssistance: asyncHandler(async (req, res) => {
    try {
      const { id, status } = req.body;

      const emergencyAssistance = await EmergencyAssistance.findById(id);
      if (!emergencyAssistance) {
        return res.status(404).json({ message: "Emergency Assistance request not found" });
      }

      // If marked as 'critical' and not yet escalated, notify emergency services
      if (status === "critical" && !emergencyAssistance.escalationNotified) {
        emergencyAssistance.escalationNotified = true;
      }

      emergencyAssistance.status = status || "resolved";
      const updatedEmergencyAssistance = await emergencyAssistance.save();

      res.status(200).json(updatedEmergencyAssistance);
    } catch (error) {
      res.status(500).json({ message: `Error updating emergency request: ${error.message}` });
    }
  }),

  // Delete Emergency Assistance Request
  deleteEmergencyAssistance: asyncHandler(async (req, res) => {
    try {
      const { id } = req.body;
      const deletedEmergencyAssistance = await EmergencyAssistance.findByIdAndDelete(id);

      if (!deletedEmergencyAssistance) {
        return res.status(404).json({ message: "Emergency Assistance request not found" });
      }

      res.status(200).json({ message: "Emergency Assistance request deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: `Error deleting emergency request: ${error.message}` });
    }
  }),
};

module.exports = emergencyAssistanceController;
