const mongoose = require('mongoose');

// Define the schema for the HealthEducation model
const healthEducationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
    enum: ['image', 'video'], 
  },
  image:{
    type: String,
  },
  video:{
    type: String,
  },
  tags: {
    type: [String], // Array of strings for tags
    default: [], // Default to an empty array
  },
});

// Create the HealthEducation model
const HealthEducation = mongoose.model('HealthEducation', healthEducationSchema);

module.exports = HealthEducation;