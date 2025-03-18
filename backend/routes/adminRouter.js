const express = require("express");
const userAuthentication = require("../middlewares/userAuthentication");
const adminController = require("../controllers/adminController");
const adminAuthentication = require("../middlewares/admin");
const adminRoutes = express.Router();

adminRoutes.put("/approve", userAuthentication,adminAuthentication,adminController.approveProvider);
adminRoutes.put("/assign_nurse", userAuthentication,adminAuthentication,adminController.assignNurseToPatient);
adminRoutes.put("/reject", userAuthentication,adminAuthentication,adminController.rejectUser);
adminRoutes.get("/users", userAuthentication,adminAuthentication,adminController.getUsers);
adminRoutes.delete("/delete", userAuthentication,adminAuthentication,adminController.deleteUser);

module.exports = adminRoutes;