const mongoose = require("mongoose");

const pendingActionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    // action_type: {
    //     type: String,
    //     enum: ["start","stop"],
    //     required: true
    // },
    session_type: {
        type: String,
        enum: ["work", "break"],
        required: false
    },
    work_name: {
        type: String,
        default: null,
        required: false
    },
    duration: {
        type: Number,
        required: false,
        default: null
    },
    requestedAt: {
        type: Date,
        default: Date.now,
        index: { expires: "1h"}
    }
}, { collection: "pendingAction", timestamps: true });

const pendingActionModel = mongoose.model("PendingActions", pendingActionSchema);

module.exports = pendingActionModel;
