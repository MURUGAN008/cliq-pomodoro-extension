const path=require("path")
const userModel=require(path.join(__dirname,"..","models","user.js"));
const pomodoroModel=require(path.join(__dirname,"..","models","pomodoroSessions.js"));
const activeTimerModel=require(path.join(__dirname,"..","models","activeTimers.js"));
const {getWorkSuggestions, getBreakSuggestions} = require(path.join(__dirname,"..","utils","getSuggestions.js"));
const stopController=async(req,res)=>{
    try{
    const payload=req.body.data;
    const userId=payload.id;
    if(!userId) return res.status(400).send({error: "User Id unavailable!"});
    const activeTimerData=await activeTimerModel.findOne({ userId });
    if(!activeTimerData) return res.status(200).send({text: "No session available to stop!"});
    const durationMins = Math.floor((Date.now() - activeTimerData.start_time.getTime())/60000);
    const newPomodoroSessionData = new pomodoroModel({
        userId: activeTimerData.userId,
        session_type: activeTimerData.session_type,
        start_time: activeTimerData.start_time,
        end_time: new Date(),
        status: "canceled",
        duration_minutes: durationMins,
        work_name: activeTimerData.work_name,
    });
    const savedData=await newPomodoroSessionData.save();
    if(!savedData) return res.status(500).send({error: "Unable to save the data on pomodoroSessions"});
    const deleteResponse = await activeTimerData.deleteOne();
    if(!deleteResponse.acknowledged || deleteResponse.deletedCount !== 1) return res.status(500).send({error: "Unable to delete in activeTimer"});
    // let suggestions = null;
    let suggestionsResult = savedData.session_type=="work"?(await getBreakSuggestions(userId)):(await getWorkSuggestions(userId));
	console.log("result: "+suggestionsResult);
    // if(suggestionsResult)	suggestions = suggestionsResult.map(suggestion => ({text: suggestion}));
    return res.status(200).send({text: `Session stopped successfully.Duration: ${durationMins} mins`,suggestions: suggestionsResult});
    }
    catch(error){
        console.error(error);
        return res.status(500).send({error: "An error occurred while processing: "+error});
    }

}

module.exports = stopController;


