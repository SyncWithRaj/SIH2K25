import mongoose from "mongoose";

// A reusable sub-schema to define the structure for educational records
const EducationSchema = new mongoose.Schema({
  instituteName: { type: String, default: '' },
  passingYear: { type: String, default: '' },
  board: { type: String, default: '' },
  grade: { type: String, default: '' },
  stream: { type: String, default: '' }, // Specific to 12th
  city: { type: String, default: '' },
});

// The main, unified schema for all user profile data
const PersonalDetailSchema = new mongoose.Schema({
  // --- Core Details from Clerk & Initial Form ---
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String },
  mobile: { type: String },
  dob: { type: Date },
  gender: { type: String },
  role: { type: String, enum: ["student", "parent", "admin"] },
  city: { type: String },
  courseInterested: { type: String },
  
  // --- Profile Page Fields ---
  educationDetails: {
    tenth: { type: EducationSchema, default: () => ({}) },
    twelfth: { type: EducationSchema, default: () => ({}) },
    graduation: { type: EducationSchema, default: () => ({}) },
  },

  // --- Onboarding Status Flag ---
  hasCompletedOnboarding: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true }); // Automatically manages createdAt and updatedAt fields

const PersonalDetail = mongoose.models.PersonalDetail || mongoose.model("PersonalDetail", PersonalDetailSchema);

export default PersonalDetail;
