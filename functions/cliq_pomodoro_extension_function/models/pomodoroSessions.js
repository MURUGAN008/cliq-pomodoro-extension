const mongoose = require("mongoose");

const pomodoroSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    session_type: {
        type: String,
        enum: ["work", "break"],
        required: true,
    },
    start_time: {
        type: Date,
        required: true,
    },
    end_time: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["started","completed", "canceled", "paused"],
        required: true,
    },
    duration_minutes: {
        type: Number,
    },
    work_name: {
        type: String,
    },
}, { collection: "PomodoroSessions" }); 

const pomodoroModel = mongoose.model("PomodoroSession", pomodoroSchema);

module.exports = pomodoroModel;
