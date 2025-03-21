const Appointment = require("../models/appointmentModel");
const Nurse = require("../models/nurseModel");
const asyncHandler = require("express-async-handler");

const appointmentController = {
    requestAppointment: asyncHandler(async (req, res) => {
        if (req.user.role !== "patient") {
            return res.status(403).json({ message: "Only patients can book appointments" });
        }

        const { doctorId, date, notes } = req.body;

        const existingAppointment = await Appointment.findOne({
            doctor: doctorId,
            date,
            status: { $in: ["Pending", "Confirmed"] }
        });

        if (existingAppointment) {
            return res.status(400).json({ message: "Doctor is not available at this time" });
        }

        const appointment = await Appointment.create({
            patient: req.user.id,
            doctor: doctorId,
            date,
            notes,
            status: "Confirmed"
        });

        res.status(201).json({ message: "Appointment requested successfully", appointment });
    }),

    // ✅ 2. Doctor Confirms or Rejects Appointment
    manageAppointment: asyncHandler(async (req, res) => {
        if (req.user.role !== "doctor") {
            return res.status(403).json({ message: "Only doctors can manage appointments" });
        }

        const { appointmentId} = req.body;
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (appointment.doctor.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only manage your own appointments" });
        }
        
        appointment.status = "Completed";
        await appointment.save();

        res.status(200).json({ message: `Appointment completed successfully`, appointment });
    }),

    requestNurseVisit: asyncHandler(async (req, res) => {
        if (req.user.role !== "patient") {
            return res.status(403).json({ message: "Only patients can request nurse visits" });
        }
    
        const { date, notes, services } = req.body;
    
        // Find an available nurse (who does NOT have an appointment on the given date)
        const availableNurse = await Nurse.findOne({
            _id: { 
                $nin: await Appointment.distinct("nurse", { 
                    date, 
                    status: { $in: ["Pending", "Confirmed"] } 
                })
            }
        }).populate("user");
    
        if (!availableNurse) {
            return res.status(400).json({ message: "No nurses available on this date" });
        }
    
        const appointment = await Appointment.create({
            patient: req.user.id,
            nurse: availableNurse.user._id,
            date,
            notes,
            services,
            status: "Pending"
        });
    
        res.status(201).json({ message: "Nurse visit requested successfully", appointment });
    }),
    

    completeNurseAppointment: asyncHandler(async (req, res) => {
        if (req.user.role !== "nurse") {
            return res.status(403).json({ message: "Only nurses can complete appointments" });
        }

        const { appointmentId, servicesCompleted } = req.body;
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (appointment.nurse.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only complete your own appointments" });
        }

        if (servicesCompleted.length !== appointment.services.length) {
            return res.status(400).json({ message: "All required services must be completed before marking as done" });
        }

        appointment.status = "Completed";
        await appointment.save();

        res.status(200).json({ message: "Appointment marked as completed", appointment });
    }),

    // 📌 5. Get Appointments (For Patients, Doctors, Nurses)
    getAppointments: asyncHandler(async (req, res) => {
        let filter = {};

        if (req.user.role === "patient") {
            filter.patient = req.user.id;
        } else if (req.user.role === "doctor") {
            filter.doctor = req.user.id;
        } else if (req.user.role === "nurse") {
            filter.nurse = req.user.id;
        }

        const appointments = await Appointment.find(filter)
            .populate("patient", "username email")
            .populate("doctor", "username email")
            .populate("nurse", "username email");

        res.status(200).json(appointments);
    }),

    // 🔍 6. Search Appointments
    searchAppointments : asyncHandler(async (req, res) => {
        const { patientName, doctorName, status, date } = req.body;
    
        let query = {};
    
        if (patientName) {
            query["patient.name"] = { $regex: patientName, $options: "i" };
        }
        if (doctorName) {
            query["doctor.name"] = { $regex: doctorName, $options: "i" };
        }
        if (status) {
            query.status = status;
        }
        if (date) {
            query.date = date;
        }
    
        const appointments = await Appointment.find(query).populate("patient doctor nurse");
        
        if (!appointments.length) {
            return res.status(404).json({ message: "No appointments found" });
        }
    
        res.status(200).json(appointments);
    }),

    // ❌ 7. Delete Appointment
    deleteAppointment: asyncHandler(async (req, res) => {
        const { appointmentId } = req.body;
    
        const appointment = await Appointment.findById(appointmentId);
    
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
    
        await appointment.deleteOne();
    
        res.status(200).json({ message: "Appointment deleted successfully" });
    })
};

module.exports = appointmentController;
