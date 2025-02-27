const express = require("express");
const userAuthentication = require("../middlewares/userAuthentication");
const familyController = require("../controllers/familyController");
const familyRouter = express.Router();

familyRouter.post("/add", userAuthentication,familyController.addFamilyMember);
familyRouter.get("/view", userAuthentication,familyController.getFamilyMembersByPatientId);
familyRouter.put("/edit", userAuthentication,familyController.updateFamilyMember);
familyRouter.delete("/delete", userAuthentication,familyController.removeFamilyMember);

module.exports = familyRouter;