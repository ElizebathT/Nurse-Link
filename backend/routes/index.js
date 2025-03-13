const express=require("express");
const userRoutes = require("./userRouter");
const patientRoutes = require("./patientRouter");
const carePlanRoutes = require("./carePlanRouter");
const appointmentRoutes = require("./appointmentRouter");
const healthcareProviderRouter = require("./healthProviderRouter");
const medicalRecordRouter = require("./medicalRecordRouter");
const emergencyRouter = require("./emergencyRouter");
const resourceRouter = require("./resourceRouter");
const familyRouter = require("./familyRouter");
const notificationRouter = require("./notificationRouter");
const adminRoutes = require("./adminRouter");
const router=express()

router.use("/users", userRoutes);
router.use("/patient", patientRoutes);
router.use("/careplan", carePlanRoutes);
router.use("/emergency", emergencyRouter);
router.use("/appointment", appointmentRoutes);
router.use("/healthprovider", healthcareProviderRouter);
router.use("/medicalrecord", medicalRecordRouter);
router.use("/resources", resourceRouter);
router.use("/family", familyRouter);
router.use("/admin", adminRoutes);
router.use("/notification", notificationRouter);

module.exports=router