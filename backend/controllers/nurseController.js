const Nurse = require("../models/nurseModel");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const nurseController = {
    // 📌 Create a Nurse Profile
    registerNurse: asyncHandler(async (req, res) => {
        const { username, email, password } = req.body;
    
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: "User already exists" });
        }
    
        const hashed_password = await bcrypt.hash(password, 10);
    
        const userCreated = await User.create({
            username,
            email,
            password: hashed_password,
            role:"nurse",
            verified: false // Automatically verify patients
        });
    
        if (!userCreated) {
            throw new Error("User creation failed");
        }
        const nurseExists = await Nurse.findOne({ user: userCreated._id });
        if (nurseExists) {
            return res.status(400).json({ message: "Nurse profile already exists" });
        }
    
        await Nurse.create({
            user: userCreated._id,
            image:req.files
        });
        const payload={
            name:userCreated.username,  
            email:userCreated.email,
            role:userCreated.role,
            id:userCreated.id
        }
        const token=jwt.sign(payload,process.env.JWT_SECRET_KEY)
        res.json(token)
    }),    

    // 📌 Get All Nurses
    getAllNurses: asyncHandler(async (req, res) => {
        const nurses = await Nurse.find().populate("user", "username email phone");
        res.status(200).json(nurses);
    }),

    // 📌 Get Single Nurse by ID
    getNurseById: asyncHandler(async (req, res) => {
        const nurse = await Nurse.findById(req.params.id).populate("user", "username email phone");
        if (!nurse) {
            return res.status(404).json({ message: "Nurse not found" });
        }
        res.status(200).json(nurse);
    }),

    // 📌 Update Nurse Profile
    updateNurse: asyncHandler(async (req, res) => {
        const { experience, qualifications } = req.body;
        const nurse = await Nurse.findOne({ user: req.user.id });

        if (!nurse) {
            return res.status(404).json({ message: "Nurse profile not found" });
        }

        nurse.experience = experience || nurse.experience;
        nurse.qualifications = qualifications || nurse.qualifications;

        const updatedNurse = await nurse.save();
        res.status(200).json(updatedNurse);
    }),

    // 📌 Delete Nurse Profile
    deleteNurse: asyncHandler(async (req, res) => {
        const nurse = await Nurse.findOne({ user: req.user.id });

        if (!nurse) {
            return res.status(404).json({ message: "Nurse profile not found" });
        }

        await nurse.deleteOne();
        res.status(200).json({ message: "Nurse profile deleted successfully" });
    }),
};

module.exports = nurseController;
