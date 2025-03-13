const mongoose = require('mongoose');

// Define the MedicalRecord schema
const medicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient', // Reference to the Patient model
    required: true,
  },
  tests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestResult', // Reference to the Patient model
    required: true,
  }],
  prescriptions: {
    type: [String], // Array of prescriptions (can be strings or more complex objects)
    default: [],
  },
  diagnosis: {
    type: String,
    required: true,
  },
  treatmentHistory: {
    type: [String], // Array of treatment history entries
    default: [],
  },
},{ timestamps: true });

// Create the MedicalRecord model
const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

module.exports = MedicalRecord;