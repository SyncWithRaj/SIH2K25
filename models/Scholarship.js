import mongoose from 'mongoose';

const ScholarshipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for the scholarship.'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description.'],
    trim: true,
  },
  url: {
    type: String,
    required: [true, 'Please provide a website URL.'],
    trim: true,
  },
}, { timestamps: true });

// Avoid recompiling the model if it already exists
export default mongoose.models.Scholarship || mongoose.model('Scholarship', ScholarshipSchema);