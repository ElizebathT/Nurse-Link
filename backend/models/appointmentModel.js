const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    nurse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Rejected", "Completed"],
        default: "Pending"
    },
    notes: {
        type: String
    },
    services: {
        type: [String],  // List of services required for nurse visits
        default: []
    },
    carePlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CarePlan",
        default: null
    }
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;
