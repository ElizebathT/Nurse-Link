const express = require("express");
const medicalRecordController = require("../controllers/medicalRecordController");
const userAuthentication = require("../middlewares/userAuthentication");
const medicalRecordRouter = express.Router();

medicalRecordRouter.post("/add", userAuthentication, medicalRecordController.createMedicalRecord);
medicalRecordRouter.get("/view",userAuthentication, medicalRecordController.getMedicalRecordById);
medicalRecordRouter.put("/edit", userAuthentication,medicalRecordController.updateMedicalRecord);
medicalRecordRouter.delete("/delete", userAuthentication,medicalRecordController.deleteMedicalRecord);

module.exports = medicalRecordRouter;