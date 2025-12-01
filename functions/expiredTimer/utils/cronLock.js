const CronLock = require("../models/cronLock");

async function acquireLock() {
  const minuteKey = new Date().toISOString().slice(0, 16); 

  try {
    await CronLock.create({ minuteKey });
    return true; 
  } catch (err) {
    return false; 
  }
}

module.exports = { acquireLock };

