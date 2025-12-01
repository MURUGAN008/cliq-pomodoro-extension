const mongoose = require("mongoose");

const activeTimerSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    session_type: {
        type: String,
        enum: ["work", "break"],
        required: true
    },
    work_name:{
        type: String,
    },
    start_time: {
        type: Date,
        required: true,
        default: Date.now
    },
    expected_end_time: {
        type: Date,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, { collection: "ActiveTimers", timestamps: true });

const activeTimerModel = mongoose.model("ActiveTimer", activeTimerSchema);

module.exports = activeTimerModel;
