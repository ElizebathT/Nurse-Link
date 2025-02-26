const express = require("express");
const userAuthentication = require("../middlewares/userAuthentication");
const healthcareProviderController = require("../controllers/healthProviderController");
const healthcareProviderRouter = express.Router();

healthcareProviderRouter.post("/add", userAuthentication,healthcareProviderController.createHealthcareProvider);
healthcareProviderRouter.get("/viewall", userAuthentication,healthcareProviderController.getAllHealthcareProviders);
healthcareProviderRouter.get("/search", userAuthentication,healthcareProviderController.getHealthcareProviderById);
healthcareProviderRouter.put("/edit", userAuthentication,healthcareProviderController.updateHealthcareProvider);
healthcareProviderRouter.delete("/delete", userAuthentication,healthcareProviderController.deleteHealthcareProvider);

module.exports = healthcareProviderRouter;