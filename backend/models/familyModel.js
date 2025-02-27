const mongoose = require('mongoose');

const familySchema = mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    familyMemberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    relationship: {
      type: String, // e.g., 'Father', 'Mother', 'Spouse'
      required: true
    },
    notificationsEnabled: {
      type: Boolean,
      default: true // Family members can toggle notifications on/off
    }
  },
  {
    timestamps: true
  }
);

const Family = mongoose.model('Family', familySchema);

module.exports = Family;
