const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Patient schema
const patientSchema = new Schema({
    name: {
        type: String,
        required: true // Name is essential for identification
    },
    details: {
        type: String,
        default: ''
    },
    medicalRecord: {
        type: Schema.Types.ObjectId,
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
    emergencyContact: {
        name: {
            type: String,
            default: ''
        },
        phone: {
            type: String,
            default: ''
        },
        relationship: {
            type: String,
            default: ''
        }
    },
    carePlanId: {
        type: Schema.Types.ObjectId,
        ref: 'CarePlan', // Reference to the CarePlan model
        default: null
    },
    appointments: [{
        type: Schema.Types.ObjectId,
        ref: 'Appointment'
    }],
}, {
    timestamps: true 
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
