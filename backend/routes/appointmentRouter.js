const express = require("express");
const userAuthentication = require("../middlewares/userAuthentication");
const appointmentController = require("../controllers/appointmentController");
const appointmentRoutes = express.Router();

appointmentRoutes.post("/add",userAuthentication, appointmentController.requestAppointment);
appointmentRoutes.get("/search", userAuthentication,appointmentController.searchAppointments);
appointmentRoutes.get("/viewall", userAuthentication,appointmentController.getAppointments);
appointmentRoutes.put("/manage", userAuthentication,appointmentController.manageAppointment);
appointmentRoutes.put("/nurse", userAuthentication,appointmentController.requestNurseVisit);
appointmentRoutes.put("/complete", userAuthentication,appointmentController.completeNurseAppointment);
appointmentRoutes.delete("/delete", userAuthentication,appointmentController.deleteAppointment);

module.exports = appointmentRoutes;