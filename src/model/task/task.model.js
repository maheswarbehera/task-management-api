
import mongoose, { Schema } from "mongoose"

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    dueDate: {
        type: Date,
        required: true,
    }, 
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'], 
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    }
})

export const Task = mongoose.model("Task", taskSchema);