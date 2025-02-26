const HealthEducation = require("../models/resourceModel");
const asyncHandler = require("express-async-handler");

const healthEducationController = {
  // Create a new Health Education Resource
  createHealthEducation: asyncHandler(async (req, res) => {
    const { title, description, contentType, tags } = req.body;

    // Validate required fields
    if (!title || !description || !contentType) {
      res.status(400);
      throw new Error("Please provide all required fields: title, description, contentType.");
    }

    const newResource = await HealthEducation.create({
      title,
      description,
      contentType,
      image: req.files["image"] ? req.files["image"][0].path : null,
      video: req.files["video"] ? req.files["video"][0].path : null,
      tags,
    });

    res.status(201).json(newResource);
  }),

  getAllHealthEducations: asyncHandler(async (req, res) => {
    const resources = await HealthEducation.find();
    res.status(200).json(resources);
  }),

  getHealthEducationById: asyncHandler(async (req, res) => {
    const { title,id } = req.body; 
    
    const searchCondition = {
      title: { $regex: title, $options: "i" }, 
       _id:id   };
    const resource = await HealthEducation.find(searchCondition);

    if (resource.length === 0) {
      res.status(404);
      throw new Error("Resource not found.");
    }

    res.status(200).json(resource);
  }),

  updateHealthEducation: asyncHandler(async (req, res) => {
    const { id, title, description, contentType, tags } = req.body;

    const resource = await HealthEducation.findById(id);

    if (!resource) {
      res.status(404);
      throw new Error("Resource not found.");
    }

    resource.title = title || resource.title;
    resource.description = description || resource.description;
    resource.contentType = contentType || resource.contentType;
    resource.tags = tags || resource.tags;

    const updatedResource = await resource.save();

    res.status(200).json(updatedResource);
  }),

  deleteHealthEducation: asyncHandler(async (req, res) => {
    const {id}=req.body
    const resource = await HealthEducation.findById(id);

    if (!resource) {
      res.status(404);
      throw new Error("Resource not found.");
    }

    await resource.remove();

    res.status(200).json({ message: "Resource deleted successfully." });
  }),
};

module.exports = healthEducationController;