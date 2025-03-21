const express = require("express");
const userAuthentication = require("../middlewares/userAuthentication");
const adminController = require("../controllers/adminController");
const adminAuthentication = require("../middlewares/admin");
const adminRoutes = express.Router();

adminRoutes.get("/users", userAuthentication,adminAuthentication,adminController.getUsers);
adminRoutes.delete("/delete", userAuthentication,adminAuthentication,adminController.deleteUser);
adminRoutes.get("/appointments", userAuthentication,adminAuthentication,adminController.getAppointmentReport);

module.exports = adminRoutes;