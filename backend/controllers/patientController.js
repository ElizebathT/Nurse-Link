const Patient = require("../models/patientModel");
const asyncHandler = require("express-async-handler");

const patientController = {
    // Create a new patient profile
    createPatient: asyncHandler(async (req, res) => {
        const { name, age, gender, details, emergencyContact, ongoingTreatments, allergies} = req.body;

        if (!name || !age || !gender) {
            res.status(400);
            throw new Error("Please provide all required fields: name, age, gender");
        }
        
        const patient = await Patient.create({
            user:req.user.id,
            name,
            age,
            gender,
            details,
            emergencyContact,
            ongoingTreatments, 
            allergies
        });

        res.status(201).json(patient);
    }),

    // Fetch patient details with search queries
    getPatientDetails: asyncHandler(async (req, res) => {
        const { name, allergies, ongoingTreatments, details } = req.body;

        // Build dynamic query object
        const query = {};
        if (name) query["name"] = { $regex: name, $options: "i" };
        if (allergies) query["allergies"] = { $regex: allergies, $options: "i" };
        if (ongoingTreatments) query["ongoingTreatments"] = { $regex: ongoingTreatments, $options: "i" };
        if (details) query["details"] = { $regex: details, $options: "i" };

        const patients = await Patient.find(query);

        if (!patients.length) {
            res.status(404);
            throw new Error("No patients found matching the criteria");
        }

        res.status(200).json(patients);
    }),

    // Update patient information
    updatePatient: asyncHandler(async (req, res) => {
        const { name, age, gender, medicalRecord, details, ongoingTreatments, allergies, emergencyContact,carePlanId } = req.body;
        const {id}=req.body
        const patient = await Patient.findById(id);

        if (!patient) {
            res.status(404);
            throw new Error("Patient not found");
        }

        // Update fields if provided
        patient.name = name || patient.name;
        patient.carePlanId = carePlanId || patient.carePlanId;
        patient.age = age || patient.age;
        patient.gender = gender || patient.gender;
        patient.medicalRecord = medicalRecord || patient.medicalRecord;
        patient.details = details || patient.details;
        patient.ongoingTreatments = ongoingTreatments || patient.ongoingTreatments;
        patient.allergies = allergies || patient.allergies;
        patient.emergencyContact = emergencyContact || patient.emergencyContact;

        const updatedPatient = await patient.save();

        res.status(200).json(updatedPatient);
    }),

    // Delete a patient profile
    deletePatient: asyncHandler(async (req, res) => {
        const {id}=req.body
        const patient = await Patient.findById(id);
        if (!patient) {
            res.status(404);
            throw new Error("Patient not found");
        }
        await patient.remove();
        res.status(200).json({ message: "Patient deleted successfully" });
    }),
};

module.exports = patientController;
