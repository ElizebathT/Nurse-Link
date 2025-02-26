const mongoose = require('mongoose');

// Define the schema for the EmergencyAssistance model
const emergencyAssistanceSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient', // Reference to the Patient model
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now, // Automatically sets the current date and time
    },
    location: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['resolved', 'pending'], // Only allows 'resolved' or 'pending'
        default: 'pending', // Default status is 'pending'
    },
});

// Create the EmergencyAssistance model
const EmergencyAssistance = mongoose.model('EmergencyAssistance', emergencyAssistanceSchema);

module.exports = EmergencyAssistance;