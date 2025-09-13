import mongoose from "mongoose";

const PersonalDetailSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "parent", "admin"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

delete mongoose.connection.models["PersonalDetail"];

const PersonalDetail = mongoose.model(
  "PersonalDetail",
  PersonalDetailSchema
);

export default PersonalDetail;
