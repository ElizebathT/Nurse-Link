const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    unique:true,
        minLength:[5,"Minimum 5 characters required"],
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    minLength:[5,"Minimum 5 characters required"]
  },
  role: { 
    type: String, 
    enum: ["nurse", "admin", "doctor", "patient", "family"], 
    default: "family",
    required: true 
  },
  phone: { 
      type: String,
  },
  address:{ 
      type:  String,
  },
  license:{ 
    type:  String,
},
  verified: { 
    type: Boolean, 
    default: false // Users are unverified by default
  },
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
module.exports = User;