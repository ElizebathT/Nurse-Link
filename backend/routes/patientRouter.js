const express = require("express");
const patientController = require("../controllers/patientController");
const userAuthentication = require("../middlewares/userAuthentication");
const patientRoutes = express.Router();

patientRoutes.post("/add",userAuthentication, patientController.createOrUpdatePatient);
patientRoutes.get("/search", userAuthentication,patientController.getPatientDetails);
patientRoutes.get("/profile", userAuthentication,patientController.getMyPatientProfile);
patientRoutes.put("/edit", userAuthentication,patientController.updatePatient);
patientRoutes.delete("/delete", userAuthentication,patientController.deletePatient);

module.exports = patientRoutes;