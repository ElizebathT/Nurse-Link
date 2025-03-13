const express = require("express");
const userAuthentication = require("../middlewares/userAuthentication");
const adminController = require("../controllers/adminController");
const adminAuthentication = require("../middlewares/admin");
const adminRoutes = express.Router();

adminRoutes.put("/approve", userAuthentication,adminAuthentication,adminController.approveProvider);
adminRoutes.put("/reject", userAuthentication,adminAuthentication,adminController.rejectHealthcareProvider);
adminRoutes.get("/users", userAuthentication,adminAuthentication,adminController.getUsers);
adminRoutes.delete("/delete", userAuthentication,adminAuthentication,adminController.deleteUser);

module.exports = adminRoutes;