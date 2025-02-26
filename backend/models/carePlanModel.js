// models/CarePlan.js
const mongoose = require('mongoose');

const CarePlanSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    healthGoals: {
        type: [String],
        default: []
    },
    medications: {
        type: [String],
        default: []
    },
    appointments: {
        type: [String],
        default: []
    },
    notes: {
        type: String,
        default: ''
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the `updatedAt` field before saving the document
CarePlanSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const CarePlan = mongoose.model('CarePlan', CarePlanSchema);

module.exports = CarePlan;