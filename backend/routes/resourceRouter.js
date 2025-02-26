const express = require("express");
const resourceRouter = express.Router();
const userAuthentication = require("../middlewares/userAuthentication");
const healthEducationController = require("../controllers/resourceController");
const { upload } = require("../middlewares/cloudinary");

resourceRouter.post("/add",userAuthentication,upload.fields([{ name: "image", maxCount: 1 },{ name: "video", maxCount: 1 },]),healthEducationController.createHealthEducation);
resourceRouter.get("/viewall", userAuthentication,healthEducationController.getAllHealthEducations);
resourceRouter.get("/search", userAuthentication,healthEducationController.getHealthEducationById);
resourceRouter.put("/edit",userAuthentication, healthEducationController.updateHealthEducation);
resourceRouter.delete("/delete",userAuthentication, healthEducationController.deleteHealthEducation);

module.exports = resourceRouter;