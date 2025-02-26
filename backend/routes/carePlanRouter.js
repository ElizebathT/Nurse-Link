const express = require("express");
const userAuthentication = require("../middlewares/userAuthentication");
const carePlanController = require("../controllers/carePlanController");
const carePlanRoutes = express.Router();

carePlanRoutes.post("/add",userAuthentication, carePlanController.createCarePlan);
carePlanRoutes.get("/search", userAuthentication,carePlanController.getCarePlanById);
carePlanRoutes.get("/viewall", userAuthentication,carePlanController.getAllCarePlans);
carePlanRoutes.put("/edit", userAuthentication,carePlanController.updateCarePlan);
carePlanRoutes.delete("/delete", userAuthentication,carePlanController.deleteCarePlan);

module.exports = carePlanRoutes;