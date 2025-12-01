const mongoose = require("mongoose");

const cronLockSchema = new mongoose.Schema(
  {
    minuteKey: { type: String, required: true, unique: true },
    timestamp: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

module.exports = mongoose.model("CronLock", cronLockSchema);