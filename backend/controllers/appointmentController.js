const Appointment = require("../models/appointmentModel");
const asyncHandler = require("express-async-handler");
const Patient = require("../models/patientModel");
const HealthcareProvider = require("../models/healthProviderModel");
const Notification = require("../models/notificationModel");
// const { google } = require('googleapis');

// const credentials = require('../credentials.json');
// const { client_secret, client_id, redirect_uris } = credentials.web;
// const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// async function getCalendarClient(auth) {
//   return google.calendar({ version: 'v3', auth });
// }

const appointmentController = {
  // Create a new Appointment
  createAppointment: asyncHandler(async (req, res) => {
    const { patientId, providerId, dateTime, status, notes, reminders } = req.body;
    // const { patientId, providerId, dateTime, status, notes, reminders,accesstoken } = req.body;
    const existingAppointment = await Appointment.findOne({ patientId, providerId });
    if (existingAppointment) {
      res.status(400);
      throw new Error("Appointment already exists");
    }
    const patient=await Patient.findById(patientId)
    if(!patient){
      throw new Error("Patient not found")
    }
    const provider=await HealthcareProvider.findById(providerId)
    if(!provider){
      throw new Error("HealthcareProvider not found")
    }
    // Create the appointment
    const appointment = await Appointment.create({
      patientId,
      providerId,
      dateTime,
      status,
      notes,
      reminders,
    });
    patient.appointments.push(appointment._id);
    await patient.save();

    provider.appointments.push(appointment._id);
    await provider.save();

    const patientNotification = new Notification({
      user: patientId,
      message: `A new appointment with ${provider.name} has been created for you.`,
    });
    await patientNotification.save();

    if (appointment) {
    //   // Set the access token for the OAuth2 client
    //   oAuth2Client.setCredentials({ access_token: accessToken });

    //   // Get the Google Calendar API client
    //   const calendar = await getCalendarClient(oAuth2Client);

    //   // Create an event in Google Calendar
    //   const event = {
    //     summary: `Appointment with ${providerId}`,
    //     description: notes,
    //     start: {
    //       dateTime: dateTime,
    //       timeZone: 'UTC',
    //     },
    //     end: {
    //       dateTime: new Date(new Date(dateTime).getTime() + 60 * 60 * 1000).toISOString(), // Assuming 1 hour duration
    //       timeZone: 'UTC',
    //     },
    //     reminders: {
    //       useDefault: false,
    //       overrides: reminders.map(reminder => ({
    //         method: 'popup',
    //         minutes: reminder.minutesBefore,
    //       })),
    //     },
    //   };

    //   // Insert the event into Google Calendar
    //   const calendarResponse = await calendar.events.insert({
    //     calendarId: 'primary',
    //     resource: event,
    //   });

    //   res.status(201).json({ appointment, calendarEvent: calendarResponse.data });
    res.status(201).send("Appointment added successfully");
    } else {
      res.status(400);
      throw new Error("Invalid appointment data");
    }
  }),

  // Get all Appointments
  getAllAppointments: asyncHandler(async (req, res) => {
    const appointments = await Appointment.find()
      .populate("patientId", "name") // Populate patient details (e.g., name)
      .populate("providerId", "name"); // Populate provider details (e.g., name)

    res.status(200).json(appointments);
  }),

  // Get a single Appointment by ID
  getAppointmentById: asyncHandler(async (req, res) => {
    const {patientId,providerId}=req.body
    const searchCondition = {};
    if (patientId) searchCondition.patientId = patientId;
    if (providerId) searchCondition.providerId = providerId;
    const appointment = await Appointment.find(searchCondition)
      .populate("patientId", "name")
      .populate("providerId", "name specialty");

    if (appointment) {
      res.status(200).json(appointment);
    } else {
      res.status(404);
      throw new Error("Appointment not found");
    }
  }),

  // Update an Appointment
  updateAppointment: asyncHandler(async (req, res) => {
    const { id, dateTime, status, notes, reminders } = req.body;

    const appointment = await Appointment.findById(id);

    if (appointment) {
      appointment.dateTime = dateTime || appointment.dateTime;
      appointment.status = status || appointment.status;
      appointment.notes = notes || appointment.notes;
      appointment.reminders = reminders || appointment.reminders;

      const updatedAppointment = await appointment.save();
      const patientNotification = new Notification({
        user: appointment.patientId,
        message: `Your appointment with ${appointment.providerId.name} has been updated.`,
      });
      await patientNotification.save();
      res.status(200).json({updatedAppointment
      });
    } else {
      res.status(404);
      throw new Error("Appointment not found");
    }
  }),

  // Delete an Appointment
  deleteAppointment: asyncHandler(async (req, res) => {
    const {id}=req.body
    const appointment = await Appointment.findById(id);
    const patient=await Patient.findById(appointment.patientId)
    const provider=await HealthcareProvider.findById(appointment.providerId)
    if (patient && patient.appointments) {
      patient.appointments.pull(appointment._id);
      await patient.save();
    }
    if (provider && provider.appointments) {
        provider.appointments.pull(appointment._id);
        await provider.save();
    }
    const patientNotification = new Notification({
      user: appointment.patientId,
      message: `Your appointment with ${appointment.providerId.name} has been canceled.`,
    });
    await patientNotification.save();
    if (appointment) {
      await appointment.deleteOne();
      res.status(200).json({ message: "Appointment deleted successfully" });
    } else {
      res.status(404);
      throw new Error("Appointment not found");
    }
  }),
};

module.exports = appointmentController;