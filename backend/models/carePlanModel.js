const mongoose = require('mongoose');

const CarePlanSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    healthGoals: [{ type: String }],  // Changed to array
    medications: [{ type: String }],  // Changed to array
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }],
    notes: {
        type: String,
        default: ''
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Auto-update `updatedAt` before saving
CarePlanSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const CarePlan = mongoose.model('CarePlan', CarePlanSchema);
module.exports = CarePlan;
