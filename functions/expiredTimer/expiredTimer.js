const path = require("path");
const mongoose = require("mongoose");
const { IncomingMessage, ServerResponse } = require("http");
const userModel = require(path.join(__dirname, "models", "user.js"));
const activeTimerModel = require(path.join(__dirname, "models", "activeTimers.js"));
const pomodoroModel = require(path.join(__dirname, "models", "pomodoroSessions.js"));
const cronLockModel = require(path.join(__dirname, "models", "cronLock.js"));
const { notifyUser } = require(path.join(__dirname, "utils", "notifyUser.js"));
const {getWorkSuggestions, getBreakSuggestions} = require(path.join(__dirname,"utils","getSuggestions.js"));
const getRandomMessage = require(path.join(__dirname,"utils","getRandomMessage.js"));
const {appreciationMessages, startWorkMessages} = require(path.join(__dirname,"utils","messages.js"));
const {acquireLock} = require(path.join(__dirname,"utils","cronLock.js"));

require("dotenv").config();
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB once
if (mongoose.connection.readyState === 0) {
  mongoose.connect(MONGODB_URI)
	.then(async () => {
	  console.log("DB CONNECTED");
	  await userModel.syncIndexes();
	  await pomodoroModel.syncIndexes();
	  await activeTimerModel.syncIndexes();
	  await cronLockModel.syncIndexes();
	})
	.catch(err => console.error("DB ERROR:", err));
}

module.exports = async (context) => {
  try {
	if(!await acquireLock()) return {success: true};
	const expiredData = await activeTimerModel.find({
	  expected_end_time: { $lte: new Date() }
	});

	for (const session of expiredData) {

	  const durationMins = Math.round((Date.now() - session.start_time) / 60000);

	  const newPomodoroSession = new pomodoroModel({
		userId: session.userId,
		session_type: session.session_type,
		start_time: session.start_time,
		end_time: new Date(),
		status: "completed",
		duration_minutes: durationMins,
		work_name: session.work_name
	  });

	  await newPomodoroSession.save();

	  await activeTimerModel.deleteOne({ userId: session.userId });
	  let suggestions = null;
	  let suggestionsResult = session.session_type=="work"?(await getBreakSuggestions(session.userId)):(await getWorkSuggestions(session.userId));
	// If nothing returned → don't add suggestions
	if (suggestionsResult && suggestionsResult.length > 0) {
		suggestions = {
			list: suggestionsResult.map(item => ({ text: item }))
		};
	}

	let message = session.session_type=="work"?getRandomMessage(appreciationMessages):getRandomMessage(startWorkMessages);

	await notifyUser(session.userId, `Your ${session.session_type} session is completed${session.session_type=="work"?"🎉":""}\n${message}`,suggestions);
	}

	return {success: true, count: expiredData.length };
  }
  catch (err) {
	console.error("Error running expire logic:", err);
	return { error: err.message};
  }
};

