const HealthcareProvider = require("../models/healthProviderModel");
const asyncHandler = require("express-async-handler");

const healthcareProviderController = {
  // Create a new Healthcare Provider
  createHealthcareProvider: asyncHandler(async (req, res) => {
    const { name, specialty, licenseNumber } = req.body;

    // Check if the provider already exists
    const existingProvider = await HealthcareProvider.findOne({ user:req.user.id });
    if (existingProvider) {
      res.status(400);
      throw new Error("Healthcare provider already exists");
    }

    // Create the provider
    const provider = await HealthcareProvider.create({
        user:req.user.id,
        name,
      specialty,
      licenseNumber,
    });

    res.status(201).json(provider);
  }),

  // Get all Healthcare Providers
  getAllHealthcareProviders: asyncHandler(async (req, res) => {
    const providers = await HealthcareProvider.find({});
    res.status(200).json(providers);
  }),

  // Get a single Healthcare Provider by ID
  getHealthcareProviderById: asyncHandler(async (req, res) => {
        const { name,specialty,licenseNumber } = req.body; 
    
        const searchCondition = {
          name: { $regex: name, $options: "i" },
          specialty: { $regex: specialty, $options: "i" }, // Case-insensitive search for specialty
          licenseNumber: { $regex: licenseNumber, $options: "i" }
        };
    
        const providers = await HealthcareProvider.find(searchCondition);
    
        if (providers.length === 0) {
          res.status(404);
          throw new Error("No healthcare providers found matching the specialty");
        }
    
        res.status(200).json(providers);
      }),

  // Update a Healthcare Provider
  updateHealthcareProvider: asyncHandler(async (req, res) => {
    const { name, specialty, licenseNumber} = req.body;

    const provider = await HealthcareProvider.findOne({user:req.user.id});

    if (!provider) {
      res.status(404);
      throw new Error("Healthcare provider not found");
    }

    // Update the provider fields
    provider.specialty = specialty || provider.specialty;
    provider.name = name || provider.name;
    provider.licenseNumber = licenseNumber || provider.licenseNumber;

    const updatedProvider = await provider.save();
    res.status(200).json(updatedProvider);
  }),

  // Delete a Healthcare Provider
  deleteHealthcareProvider: asyncHandler(async (req, res) => {
    const provider = await HealthcareProvider.findById({user:req.user.id});

    if (!provider) {
      res.status(404);
      throw new Error("Healthcare provider not found");
    }

    await provider.deleteOne();
    res.status(200).json({ message: "Healthcare provider deleted successfully" });
  }),
};

module.exports = healthcareProviderController;