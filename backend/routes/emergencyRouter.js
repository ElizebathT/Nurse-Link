const express = require("express");
const userAuthentication = require("../middlewares/userAuthentication");
const emergencyAssistanceController = require("../controllers/emergencyController");
const emergencyRouter = express.Router();

emergencyRouter.post("/add", userAuthentication,emergencyAssistanceController.createEmergencyAssistance);
emergencyRouter.get("/viewall", userAuthentication,emergencyAssistanceController.getAllEmergencyAssistance);
emergencyRouter.get("/search", userAuthentication,emergencyAssistanceController.getEmergencyAssistanceById);
emergencyRouter.put("/edit", userAuthentication,emergencyAssistanceController.updateEmergencyAssistance);
emergencyRouter.delete("/delete", userAuthentication,emergencyAssistanceController.deleteEmergencyAssistance);

module.exports = emergencyRouter;