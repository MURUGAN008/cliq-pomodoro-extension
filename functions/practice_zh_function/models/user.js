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
        default: 1
    },
    default_break_duration: {
        type: Number,
        default: 1
    },
    notify_preference: {
        type: Boolean,
        default: true
    }
}, { collection: "Users", timestamps: true }); 

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
