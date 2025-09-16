import mongoose from 'mongoose';

const { Schema } = mongoose;

// ✅ Add the description field here
const NodeDataSchema = new Schema({
  label: { type: String, required: true },
  description: { type: String } // New optional field for the description
}, { _id: false });

const PositionSchema = new Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true }
}, { _id: false });

// The 'style' object is no longer needed with custom nodes,
// but we'll leave it in the schema for any existing data.
const StyleSchema = new Schema({
    padding: { type: Number },
    borderRadius: { type: Number }
}, { _id: false });

const NodeSchema = new Schema({
  id: { type: String, required: true },
  position: { type: PositionSchema, required: true },
  data: { type: NodeDataSchema, required: true },
  style: { type: StyleSchema },
  // 'type' will be saved to remember to use the custom node
  type: { type: String }
});

const EdgeSchema = new Schema({
  id: { type: String, required: true },
  source: { type: String, required: true },
  target: { type: String, required: true }
});

const RoadmapSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  nodes: [NodeSchema],
  edges: [EdgeSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Roadmap = mongoose.models.Roadmap || mongoose.model('Roadmap', RoadmapSchema);

export default Roadmap;