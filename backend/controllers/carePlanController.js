const CarePlan = require("../models/carePlanModel");
const asyncHandler = require("express-async-handler");
const Patient = require("../models/patientModel");
const Notification = require("../models/notificationModel"); // Added

const carePlanController = {
    // ✅ 1. Create a new CarePlan
    createCarePlan: asyncHandler(async (req, res) => {
        const { patientId, healthGoals, medications, appointments, notes } = req.body;
        
        // Prevent duplicate care plans for the same patient
        const existingCarePlan = await CarePlan.findOne({ patientId, healthGoals });
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

        await Patient.findByIdAndUpdate(
            patientId,
            { $push: { carePlanId: carePlan._id } },
            { new: true }
        );

        // Send notification to patient
        await Notification.create({
            user: patientId,
            message: `A new CarePlan has been created with your health goals: ${healthGoals.join(", ")}.`,
        });

        res.status(201).json(carePlan);
    }),

    // ✅ 2. Get all CarePlans
    getAllCarePlans: asyncHandler(async (req, res) => {
        const carePlans = await CarePlan.find()
            .populate("patientId", "name age gender")
            .populate("appointments");

        res.status(200).json(carePlans);
    }),

    // ✅ 3. Get a specific CarePlan by ID
    getCarePlanById: asyncHandler(async (req, res) => {
        const { id, patientId, healthGoal, medication, appointment, note } = req.body;
        let query = {};

        if (id) {
            const carePlan = await CarePlan.findById(id)
                .populate("patientId", "name age gender")
                .populate("appointments");

            if (!carePlan) {
                res.status(404);
                throw new Error("CarePlan not found.");
            }
            return res.status(200).json(carePlan);
        }

        // Dynamic filtering
        if (patientId) query.patientId = patientId;
        if (healthGoal) query.healthGoals = { $in: [healthGoal] };
        if (medication) query.medications = { $in: [medication] };
        if (appointment) query.appointments = { $in: [appointment] };
        if (note) query.notes = { $regex: note, $options: 'i' };

        const carePlans = await CarePlan.find(query)
            .populate("patientId", "name age gender")
            .populate("appointments");

        if (!carePlans.length) {
            res.status(404);
            throw new Error("No care plans found with the given criteria.");
        }

        res.status(200).json(carePlans);
    }),

    // ✅ 4. Update a CarePlan by ID
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

        const updatedCarePlan = await carePlan.save();

        // Send notification to patient
        await Notification.create({
            user: carePlan.patientId,
            message: `Your CarePlan has been updated with new health goals: ${healthGoals.join(", ")}.`,
        });

        res.status(200).json(updatedCarePlan);
    }),

    // ✅ 5. Delete a CarePlan by ID
    deleteCarePlan: asyncHandler(async (req, res) => {
        const { id } = req.body;

        const carePlan = await CarePlan.findByIdAndDelete(id);
        if (!carePlan) {
            res.status(404);
            throw new Error("CarePlan not found.");
        }

        await Patient.findByIdAndUpdate(
            carePlan.patientId,
            { $pull: { carePlanId: carePlan._id } },
            { new: true }
        );

        res.status(200).json({ message: "CarePlan deleted successfully." });
    }),
};

module.exports = carePlanController;
