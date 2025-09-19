// models/College.js

import mongoose, { Schema, model } from 'mongoose';

const BranchSchema = new Schema({
    branchName: { type: String, required: true, trim: true },
    intake: { type: Number, required: true },
    governmentSeats: { type: Number, required: true },
    board: { type: String, required: true },
    category: { type: String, required: true },
    closingRank: { type: Number, required: true }
});

const CollegeSchema = new Schema({
    name: { type: String, required: true, unique: true, trim: true },
    address: String,
    contactNo: String,
    email: String,
    website: String,
    university: String,
    fees: String,
    facilities: {
        boysHostel: Boolean,
        girlsHostel: Boolean,
        mess: Boolean,
        transportation: Boolean
    },
    branches: [BranchSchema]
}, { timestamps: true });

// Access 'models' from the main mongoose object
const College = mongoose.models.College || model('College', CollegeSchema);

export default College;