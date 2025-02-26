const express = require("express");
const userAuthentication = require("../middlewares/userAuthentication");
const appointmentController = require("../controllers/appointmentController");
const appointmentRoutes = express.Router();

appointmentRoutes.post("/add",userAuthentication, appointmentController.createAppointment);
appointmentRoutes.get("/search", userAuthentication,appointmentController.getAppointmentById);
appointmentRoutes.get("/viewall", userAuthentication,appointmentController.getAllAppointments);
appointmentRoutes.put("/edit", userAuthentication,appointmentController.updateAppointment);
appointmentRoutes.delete("/delete", userAuthentication,appointmentController.deleteAppointment);

module.exports = appointmentRoutes;