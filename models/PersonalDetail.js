import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema({ /* ... (no changes) ... */ });

const PersonalDetailSchema = new mongoose.Schema({
  // --- Core Fields ---
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String },
  mobile: { type: String },
  dob: { type: Date },
  gender: { type: String },
  role: { type: String, enum: ["student", "parent", "admin"], default: 'student' },
  city: { type: String },
  
  // --- Fields from Initial Form ---
  field: { type: String },
  courseInterested: { type: String }, // Renamed from 'course' for consistency
  
  // --- Profile Page Fields ---
  educationDetails: {
    tenth: { type: EducationSchema, default: () => ({}) },
    twelfth: { type: EducationSchema, default: () => ({}) },
    graduation: { type: EducationSchema, default: () => ({}) },
  },

  // --- NEW: Onboarding Status Flag ---
  hasCompletedOnboarding: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

const PersonalDetail = mongoose.models.PersonalDetail || mongoose.model("PersonalDetail", PersonalDetailSchema);

export default PersonalDetail;