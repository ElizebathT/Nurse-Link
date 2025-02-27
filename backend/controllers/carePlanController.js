const CarePlan = require("../models/carePlanModel");
const asyncHandler = require("express-async-handler");

const carePlanController = {
    // Create a new CarePlan
    createCarePlan: asyncHandler(async (req, res) => {
        const { patientId, healthGoals, medications, appointments, notes } = req.body;

        // Check if the carePlanId already exists
        const existingCarePlan = await CarePlan.findOne({ patientId, healthGoals});
        if (existingCarePlan) {
            res.status(400);
            throw new Error("CarePlan already exists.");
        }

        // Create the CarePlan
        const carePlan = await CarePlan.create({
            patientId,
            healthGoals,
            medications,
            appointments,
            notes
        });
        const notification = new Notification({
            user: patientId,  // Assuming the notification is for the patient
            message: `A new CarePlan has been created with your health goals: ${healthGoals.join(", ")}.`,
        });

        await notification.save();
        res.status(201).json(carePlan);
    }),

    // Get all CarePlans
    getAllCarePlans: asyncHandler(async (req, res) => {
        const carePlans = await CarePlan.find().populate("patientId ");
        res.status(200).json(carePlans);
    }),

    // Get a specific CarePlan by ID
    getCarePlanById: asyncHandler(async (req, res) => {
        const { id, patientId, healthGoal, medication, appointment, note } = req.body;

        let query = {};

        if (id) {
            // Search by CarePlan ID
            const carePlan = await CarePlan.findById(id).populate("patientId");
            if (!carePlan) {
                res.status(404);
                throw new Error("CarePlan not found.");
            }
            return res.status(200).json(carePlan);
        }

        // Build query dynamically based on search parameters
        if (patientId) query.patientId = patientId;
        if (healthGoal) query.healthGoals = { $in: [healthGoal] };
        if (medication) query.medications = { $in: [medication] };
        if (appointment) query.appointments = { $in: [appointment] };
        if (note) query.notes = { $regex: note, $options: 'i' };

        // If no specific query, fetch all care plans
        const carePlans = await CarePlan.find(query).populate("patientId");

        if (!carePlans || carePlans.length === 0) {
            res.status(404);
            throw new Error("No care plans found with the given criteria.");
        }

        res.status(200).json(carePlans);
    }),

    // Update a CarePlan by ID
    updateCarePlan: asyncHandler(async (req, res) => {
        const { id, healthGoals, medications, appointments, notes } = req.body;

        const carePlan = await CarePlan.findById(id);

        if (!carePlan) {
            res.status(404);
            throw new Error("CarePlan not found.");
        }

        // Update fields if provided
        if (healthGoals) carePlan.healthGoals = healthGoals;
        if (medications) carePlan.medications = medications;
        if (appointments) carePlan.appointments = appointments;
        if (notes) carePlan.notes = notes;

        // Save the updated CarePlan
        const updatedCarePlan = await carePlan.save();
        const notification = new Notification({
            user: carePlan.patientId,  // Assuming the notification is for the patient
            message: `Your CarePlan has been updated with new health goals: ${healthGoals.join(", ")}.`,
        });

        await notification.save(); 
        res.status(200).json(updatedCarePlan);
    }),

    // Delete a CarePlan by ID
    deleteCarePlan: asyncHandler(async (req, res) => {
        const {id}=req.body
        const carePlan = await CarePlan.findById(id);

        if (!carePlan) {
            res.status(404);
            throw new Error("CarePlan not found.");
        }

        await carePlan.deleteOne();

        res.status(200).json({ message: "CarePlan deleted successfully." });
    }),

};

module.exports = carePlanController;