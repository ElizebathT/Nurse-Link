const express=require("express");
const userRoutes = require("./userRouter");
const patientRoutes = require("./patientRouter");
const carePlanRoutes = require("./carePlanRouter");
const appointmentRoutes = require("./appointmentRouter");
const healthcareProviderRouter = require("./healthProviderRouter");
const medicalRecordRouter = require("./medicalRecordRouter");
const emergencyRouter = require("./emergencyRouter");
const resourceRouter = require("./resourceRouter");
const router=express()

router.use("/users", userRoutes);
router.use("/patient", patientRoutes);
router.use("/careplan", carePlanRoutes);
router.use("/emergency", emergencyRouter);
router.use("/appointment", appointmentRoutes);
router.use("/healthprovider", healthcareProviderRouter);
router.use("/medicalrecord", medicalRecordRouter);
router.use("/resources", resourceRouter);

module.exports=router