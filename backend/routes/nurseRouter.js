const express = require("express");
const userAuthentication = require("../middlewares/userAuthentication");
const nurseController = require("../controllers/nurseController");

const nurseRoutes = express.Router();

nurseRoutes.post("/add", userAuthentication, nurseController.createNurse);
nurseRoutes.get("/search", userAuthentication, nurseController.getNurseById);
nurseRoutes.get("/viewall", userAuthentication, nurseController.getAllNurses);
nurseRoutes.put("/edit", userAuthentication, nurseController.updateNurse);
nurseRoutes.delete("/delete", userAuthentication, nurseController.deleteNurse);

module.exports = nurseRoutes;
