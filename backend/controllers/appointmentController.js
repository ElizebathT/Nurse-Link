const Appointment = require("../models/appointmentModel");
const asyncHandler = require("express-async-handler");

// CONTROLLER FOR APPOINTMENTS
const appointmentController = {
    // 📝 1. Patient Requests an Appointment
    requestAppointment: asyncHandler(async (req, res) => {
        if (req.user.role !== "patient") {
            return res.status(403).json({ message: "Only patients can book appointments" });
        }

        const { doctorId, date, notes } = req.body;

        const appointment = await Appointment.create({
            patient: req.user.id,
            doctor: doctorId,
            date,
            notes
        });

        res.status(201).json({ message: "Appointment requested successfully", appointment });
    }),

    // ✅ 2. Doctor Confirms or Rejects Appointment
    manageAppointment: asyncHandler(async (req, res) => {
        if (req.user.role !== "doctor") {
            return res.status(403).json({ message: "Only doctors can manage appointments" });
        }

        const { appointmentId, status } = req.body;
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (appointment.doctor.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only manage your own appointments" });
        }

        if (!["Confirmed", "Rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status update" });
        }

        appointment.status = status;
        await appointment.save();

        res.status(200).json({ message: `Appointment ${status.toLowerCase()} successfully`, appointment });
    }),

    requestNurseVisit: asyncHandler(async (req, res) => {
        if (req.user.role !== "patient") {
            return res.status(403).json({ message: "Only patients can request nurse visits" });
        }
    
        const { nurseId, date, notes, address } = req.body;
    
        if (!nurseId || !date || !address) {
            return res.status(400).json({ message: "Nurse ID, date, and address are required" });
        }
    
        const appointment = await Appointment.create({
            patient: req.user.id,
            nurse: nurseId,
            date,
            notes,
            address,
            status: "Pending"
        });
    
        res.status(201).json({ message: "Nurse visit requested successfully", appointment });
    }),
    
    

    // ✅ 4. Doctor Completes Appointment & Adds Notes
    completeAppointment: asyncHandler(async (req, res) => {
        if (req.user.role !== "doctor") {
            return res.status(403).json({ message: "Only doctors can complete appointments" });
        }

        const { appointmentId, carePlanId, notes } = req.body;
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (appointment.doctor.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only complete your own appointments" });
        }

        appointment.status = "Completed";
        appointment.carePlanId = carePlanId || appointment.carePlanId;
        appointment.notes = notes || appointment.notes;

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
            .populate("nurse", "username email")
            .populate("carePlanId");

        res.status(200).json(appointments);
    }),

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
