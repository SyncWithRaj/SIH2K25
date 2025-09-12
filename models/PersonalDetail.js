import mongoose from "mongoose";

const PersonalDetailSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk user ID
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.PersonalDetail || mongoose.model("PersonalDetail", PersonalDetailSchema);
