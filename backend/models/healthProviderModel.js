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
    unique: true, 
  },
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
}],
verified:{
  type:Boolean,
  default:false
}
},{timestamps:true});

// Create the HealthcareProvider model
const HealthcareProvider = mongoose.model('HealthcareProvider', healthcareProviderSchema);

module.exports = HealthcareProvider;