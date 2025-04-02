const express=require("express");
const userRoutes = require("./userRouter");
const patientRoutes = require("./patientRouter");
const carePlanRoutes = require("./carePlanRouter");
const appointmentRoutes = require("./appointmentRouter");
const medicalRecordRouter = require("./medicalRecordRouter");
const emergencyRouter = require("./emergencyRouter");
const resourceRouter = require("./resourceRouter");
const familyRouter = require("./familyRouter");
const notificationRouter = require("./notificationRouter");
const adminRoutes = require("./adminRouter");
const doctorRoutes = require("./doctorRouter");
const nurseRoutes = require("./nurseRouter");
const chatRoutes = require("./chatRouter");
const complaintRouter = require("./complaintRoutes");
const router=express()

router.use("/users", userRoutes);
router.use("/patient", patientRoutes);
router.use("/complaint", complaintRouter);
router.use("/careplan", carePlanRoutes);
router.use("/emergency", emergencyRouter);
router.use("/appointment", appointmentRoutes);
router.use("/medicalrecord", medicalRecordRouter);
router.use("/resources", resourceRouter);
router.use("/family", familyRouter);
router.use("/admin", adminRoutes);
router.use("/doctor", doctorRoutes);
router.use("/nurse", nurseRoutes);
router.use("/chat", chatRoutes);
router.use("/notification", notificationRouter);

module.exports=router