const path = require("path");
const userModel= require(path.join(__dirname,"..","models","user.js"));

const getWorkSuggestions = async(userId) =>{
    console.log("Work suggestion");
    const recentlyUsedWorkCommands = await userModel.findOne({ userId }).select("recent_work_commands").lean();
    // if(!recentlyUsedWorkCommands || recentlyUsedWorkCommands.length==0) return null;
    return recentlyUsedWorkCommands?.recent_work_commands||null; 
}

const getBreakSuggestions = async(userId) =>{
    console.log("Break suggestion");
    const recentlyUsedBreakCommands = await userModel.findOne({ userId }).select("recent_break_commands").lean();
    console.log(recentlyUsedBreakCommands);
    // if(!recentlyUsedBreakCommands || recentlyUsedBreakCommands.length==0) return null;
    
    return recentlyUsedBreakCommands?.recent_break_commands||null;
}

module.exports = {getWorkSuggestions, getBreakSuggestions};
