import mongoose, { Schema, model } from 'mongoose';

const ResourceSchema = new Schema({
    category: { 
        type: String, 
        required: [true, 'Category is required.'], 
        trim: true 
    },
    subCategory: { 
        type: String, 
        required: [true, 'Sub-category is required.'], 
        trim: true 
    },
    title: { 
        type: String, 
        required: [true, 'Title is required.'], 
        unique: true, 
        trim: true 
    },
    description: { 
        type: String, 
        required: [true, 'Description is required.'] 
    },
    link: { 
        type: String, 
        required: [true, 'Resource link is required.'] 
    },
    imageUrl: { 
        type: String, 
        required: [true, 'Image URL is required.'] 
    },
}, { timestamps: true });

const Resource = mongoose.models.Resource || model('Resource', ResourceSchema);

export default Resource;

