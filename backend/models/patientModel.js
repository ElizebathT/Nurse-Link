const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Patient schema
const patientSchema = new Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true
    },
   
    name: {
        type: String,
        required: true // Name is essential for identification
    },
    details: {
        type: String,
        default: ''
    },
    medicalRecord: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MedicalRecord', // Reference to the CarePlan model
        default: null
    },
    ongoingTreatments: {
        type: String,
        default: ''
    },
    allergies: {
        type: String,
        default: ''
    },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    emergencyContact: {
        type: String,
        default: ''
    },
    age: { type: Number, required: true },
    carePlanId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CarePlan', 
        default: null
    }],
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }],
    assignedNurse: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, {
    timestamps: true 
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
