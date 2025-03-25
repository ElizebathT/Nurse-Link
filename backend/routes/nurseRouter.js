const express = require("express");
const userAuthentication = require("../middlewares/userAuthentication");
const nurseController = require("../controllers/nurseController");

const nurseRoutes = express.Router();

nurseRoutes.get("/search", userAuthentication, nurseController.getNurseById);
nurseRoutes.get("/viewall", userAuthentication, nurseController.getAllNurses);
nurseRoutes.put("/edit", userAuthentication, nurseController.updateNurse);
nurseRoutes.delete("/delete", userAuthentication, nurseController.deleteNurse);

module.exports = nurseRoutes;
