const mongoose = require("mongoose");

// Define the schema for the EmergencyAssistance model
const emergencyAssistanceSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  nurseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Nurse",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  status: {
    type: String,
    enum: ["pending", "critical", "resolved"],
    default: "pending",
  },
  escalationNotified: {
    type: Boolean,
    default: false,
  },
});

// Create the EmergencyAssistance model
const EmergencyAssistance = mongoose.model(
  "EmergencyAssistance",
  emergencyAssistanceSchema
);

module.exports = EmergencyAssistance;
