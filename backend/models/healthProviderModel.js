const mongoose = require('mongoose');

// Define the HealthcareProvider schema
const healthcareProviderSchema = new mongoose.Schema({
  user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
      },
      name:{
        type: String,
    required: true,
      },
  specialty: {
    type: String,
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true, // Ensure each provider has a unique license number
  },
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
}],
},{timestamps:true});

// Create the HealthcareProvider model
const HealthcareProvider = mongoose.model('HealthcareProvider', healthcareProviderSchema);

module.exports = HealthcareProvider;