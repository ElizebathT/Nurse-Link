const mongoose = require('mongoose');

// Define the TestResult schema
const testResultSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient', // Reference to the Patient model
    required: true,
  },
  testName: {
    type: String,
    required: true,
  },
  result: {
    type: String,
    required: true,
  },
  referenceRange: {
    type: String, // Optional reference range for the test result
  },
  unit: {
    type: String, // Unit of measurement (if applicable)
  },
  date: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String, // Additional notes about the test result
  },
});

// Create the TestResult model
const TestResult = mongoose.model('TestResult', testResultSchema);

module.exports = TestResult;
