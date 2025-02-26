const express = require("express");
const patientController = require("../controllers/patientController");
const userAuthentication = require("../middlewares/userAuthentication");
const patientRoutes = express.Router();

patientRoutes.post("/add",userAuthentication, patientController.createPatient);
patientRoutes.get("/search", userAuthentication,patientController.getPatientDetails);
patientRoutes.put("/edit", userAuthentication,patientController.updatePatient);
patientRoutes.delete("/delete", userAuthentication,patientController.deletePatient);

module.exports = patientRoutes;