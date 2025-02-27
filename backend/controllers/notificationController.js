const asyncHandler = require("express-async-handler");
const Notification = require("../models/notificationModel");

const notificationController = {
    getUserNotifications: asyncHandler(async (req, res) => {
        const {patientId}=req.body
        const notifications = await Notification.find({ user: patientId,read:false }).sort({ date: -1 });
        res.send(notifications);
    }),

    markNotificationAsRead: asyncHandler(async (req, res) => {
        const { id } = req.body;
        const notification = await Notification.findById(id);

        if (!notification) {
            throw new Error("Notification not found.");
        }

        notification.read = true;
        await notification.save();
        res.send("Notification marked as read.");
    }),

    deleteNotification: asyncHandler(async (req, res) => {
        const { id } = req.body;
        const notification = await Notification.findById(id);

        if (!notification) {
            throw new Error("Notification not found.");
        }

        await notification.deleteOne();
        res.send("Notification deleted successfully.");
    }),    
};

module.exports = notificationController;

