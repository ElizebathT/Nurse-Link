const express = require("express");
const userAuthentication = require("../middlewares/userAuthentication");
const doctorController = require("../controllers/doctorController");

const doctorRoutes = express.Router();

doctorRoutes.post("/add", userAuthentication, doctorController.createDoctor);
doctorRoutes.get("/search", userAuthentication, doctorController.getDoctorById);
doctorRoutes.get("/viewall", userAuthentication, doctorController.getAllDoctors);
doctorRoutes.put("/edit", userAuthentication, doctorController.updateDoctor);
doctorRoutes.delete("/delete", userAuthentication, doctorController.deleteDoctor);

module.exports = doctorRoutes;
