import mongoose from "mongoose";

const AssessmentSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk user ID
  answers: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Assessment || mongoose.model("Assessment", AssessmentSchema);
