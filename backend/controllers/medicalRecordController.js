const HealthcareProvider = require("../models/healthProviderModel");
const MedicalRecord = require("../models/medicalRecordModel");
const asyncHandler = require("express-async-handler");

const medicalRecordController = {
  // Create a new medical record
  createMedicalRecord: asyncHandler(async (req, res) => {
    const { patientId, diagnosis, prescriptions, treatmentHistory } = req.body;
    const provider = await HealthcareProvider.findOne({ user: req.user._id });

    if (!provider || !provider.verified) {
        res.status(403);
        throw new Error("Access denied. Only verified healthcare providers can create a MedicalRecord.");
    }
    const exist=await MedicalRecord.findOne({patientId})
    if(exist){
        throw new Error("Record exist")
    }
    const medicalRecord = new MedicalRecord({
      patientId,
      diagnosis,
      prescriptions: prescriptions || [],
      treatmentHistory: treatmentHistory || [],
    });
    const createdRecord = await medicalRecord.save();
    res.status(201).json(createdRecord);
  }),

 // Get a single medical record by ID
  getMedicalRecordById: asyncHandler(async (req, res) => {
    const {patientId}=req.body
    const medicalRecord = await MedicalRecord.findOne({patientId}).populate("patientId");
    if (medicalRecord) {
      res.status(200).json(medicalRecord);
    } else {
      res.status(404);
      throw new Error("Medical record not found");
    }
  }),

  // Update a medical record by ID
  updateMedicalRecord: asyncHandler(async (req, res) => {
    const { id, diagnosis, tests, prescriptions, treatmentHistory } = req.body;
    const medicalRecord = await MedicalRecord.findByIdAndUpdate(
      id,
      {
        diagnosis,
        tests,
        prescriptions,
        treatmentHistory,
      },
      { new: true }
    ).populate("patientId");

    if (medicalRecord) {
      res.status(200).json(medicalRecord);
    } else {
      res.status(404);
      throw new Error("Medical record not found");
    }
  }),

  // Delete a medical record by ID
  deleteMedicalRecord: asyncHandler(async (req, res) => {
    const {id:patientId}=req.body
    const medicalRecord = await MedicalRecord.deleteOne({patientId});
    if (medicalRecord) {
      res.status(200).json({ message: "Medical record deleted successfully" });
    } else {
      res.status(404);
      throw new Error("Medical record not found");
    }
  }),
};

module.exports = medicalRecordController;