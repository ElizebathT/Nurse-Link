const Family = require("../models/familyModel");
const asyncHandler = require("express-async-handler");

const familyController = {
  // Add a new family member to a patient
  addFamilyMember: asyncHandler(async (req, res) => {
    const { patientId, relationship } = req.body;

    if (!patientId || !relationship) {
      res.status(400);
      throw new Error("Please provide all required fields: patientId, familyMemberId, relationship");
    }

    const familyMember = await Family.create({
      patientId,
      familyMemberId:req.user.id,
      relationship,
    });

    res.status(201).json(familyMember);
  }),

  // Fetch family members for a specific patient
  getFamilyMembersByPatientId: asyncHandler(async (req, res) => {
    const { patientId } = req.body;

    const familyMembers = await Family.find({ patientId }).populate('familyMemberId', 'name email');

    if (!familyMembers.length) {
      res.status(404);
      throw new Error("No family members found for this patient");
    }

    res.status(200).json(familyMembers);
  }),

  // Update family member relationship or notification settings
  updateFamilyMember: asyncHandler(async (req, res) => {
    const { patientId, relationship, notificationsEnabled } = req.body;

    const familyMember = await Family.findOne({ patientId });

    if (!familyMember) {
      res.status(404);
      throw new Error("Family member not found for this patient");
    }

    // Update fields if provided
    familyMember.relationship = relationship || familyMember.relationship;
    familyMember.notificationsEnabled = notificationsEnabled !== undefined ? notificationsEnabled : familyMember.notificationsEnabled;

    const updatedFamilyMember = await familyMember.save();

    res.status(200).json(updatedFamilyMember);
  }),

  // Remove a family member from the patient's profile
  removeFamilyMember: asyncHandler(async (req, res) => {
    const familyMember = await Family.findOneAndDelete({ familyMemberId:req.user.id });

    if (!familyMember) {
      res.status(404);
      throw new Error("Family member not found for this patient");
    }

    res.status(200).json({ message: "Family member removed successfully" });
  }),
};

module.exports = familyController;
