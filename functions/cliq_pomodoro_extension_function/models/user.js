const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String
    },
    default_work_duration: {
        type: Number,
        default: 25
    },
    default_break_duration: {
        type: Number,
        default: 5
    },
    notify_preference: {
        type: Boolean,
        default: true
    },
    recent_work_commands: {
        type: [String],
        default: []
    },
    recent_break_commands: {
        type: [String],
        default: []
    }
}, { collection: "Users", timestamps: true }); 

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;

