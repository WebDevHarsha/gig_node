import { Schema, model, models } from "mongoose";

const JobPostSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    projectType: { 
        type: String, 
        required: true,
        enum: ['Full-time', 'Part-time', 'Contract', 'One-time'] 
    },
    skills: [{ 
        type: String,
        required: true 
    }],
    budget: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Crypto', 'Fiat', 'Hybrid']
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Open'
    }
}, {
    timestamps: true,
});

const JobPost = models.JobPost || model("JobPost", JobPostSchema);
export default JobPost;