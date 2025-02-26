const MedicalRecord = require("../models/medicalRecordModel");
const TestResult = require("../models/testResultModel");
const asyncHandler = require("express-async-handler");

const testResultController = {
  // Create a new Test Result
  createTestResult: asyncHandler(async (req, res) => {
    const { patientId, testName, result, referenceRange, unit, date, notes } = req.body;

    const testResult = new TestResult({
      patientId,
      testName,
      result,
      referenceRange,
      unit,
      date,
      notes,
    });
    const record=await MedicalRecord.findOne({patientId})
    record.tests.push(testResult._id)
    await record.save()
    const savedTestResult = await testResult.save();
    res.status(201).json(savedTestResult);
  }),

  // Get all Test Results
  getAllTestResults: asyncHandler(async (req, res) => {
    const testResults = await TestResult.find().populate("patientId", "name");
    res.status(200).json(testResults);
  }),

  // Get Test Results by Patient ID
  getTestResultsByPatient: asyncHandler(async (req, res) => {
    const { patientId } = req.body;
    const testResults = await TestResult.find({ patientId }).populate("patientId", "name");

    if (!testResults.length) {
      res.status(404);
      throw new Error("No test results found for this patient");
    }

    res.status(200).json(testResults);
  }),

  // Get a Single Test Result by ID
  getTestResultById: asyncHandler(async (req, res) => {
    const {id}=req.body
    const testResult = await TestResult.findById(id).populate("patientId", "name");

    if (!testResult) {
      res.status(404);
      throw new Error("Test result not found");
    }

    res.status(200).json(testResult);
  }),

  // Update a Test Result
  updateTestResult: asyncHandler(async (req, res) => {
    const {id}=req.body
    const { testName, result, referenceRange, unit, date, notes } = req.body;
    const testResult = await TestResult.findById(id);

    if (!testResult) {
      res.status(404);
      throw new Error("Test result not found");
    }

    testResult.testName = testName || testResult.testName;
    testResult.result = result || testResult.result;
    testResult.referenceRange = referenceRange || testResult.referenceRange;
    testResult.unit = unit || testResult.unit;
    testResult.date = date || testResult.date;
    testResult.notes = notes || testResult.notes;

    const updatedTestResult = await testResult.save();
    res.status(200).json(updatedTestResult);
  }),

  // Delete a Test Result
  deleteTestResult: asyncHandler(async (req, res) => {
    const {id}=req.body
    const testResult = await TestResult.findById(id);

    if (!testResult) {
      res.status(404);
      throw new Error("Test result not found");
    }
    const record=await MedicalRecord.findOne({patientId:testResult.patientId})
    if (Array.isArray(record.tests)) {
        record.tests.pull(testResult._id);
        await record.save();
    }
    await testResult.deleteOne();
    res.status(200).json({ message: "Test result deleted successfully" });
  }),
};

module.exports = testResultController;
