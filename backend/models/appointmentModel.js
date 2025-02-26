const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Appointment schema
const appointmentSchema = new Schema({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'Patient', // Reference to the Patient model
    required: true,
  },
  providerId: {
    type: Schema.Types.ObjectId,
    ref: 'HealthcareProvider', // Reference to the Healthcare Provider model
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'canceled'], // Allowed status values
    default: 'scheduled', // Default status
  },
  notes: {
    type: String,
    default: '',
  },
  reminders: [{
    type: Date, // Array of reminder dates/times
  }],
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create the Appointment model
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;