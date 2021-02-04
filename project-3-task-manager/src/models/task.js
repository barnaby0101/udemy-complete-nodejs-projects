const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        required: false,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"     // defines relationship to User and makes methods avail
    }
}, {
    timestamps: true
})

const Task = mongoose.model("Task", taskSchema)
module.exports = Task;