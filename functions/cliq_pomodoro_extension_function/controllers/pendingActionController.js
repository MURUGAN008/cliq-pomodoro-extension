const path = require("path")
const pendingActionModel = require(path.join(__dirname, "..", "models", "pendingAction.js"))
// const startController = require(path.join(__dirname, "startController.js"));
const activeTimerModel=require(path.join(__dirname,"..","models","activeTimers.js"));
const pomodoroModel=require(path.join(__dirname,"..","models","pomodoroSessions.js"));

const acceptPendingActionController = async(req,res) =>{
    try{
        const payload = req.body.data;
        const userId = payload.id;
        if(!userId) return res.status(400).send({error: "Please sent proper data"});
        const pendingActionData =  await pendingActionModel.findOne({userId});
        if(!pendingActionData) return res.status(400).send({error: "No pending actions!"});
        const activeTimerData = await activeTimerModel.findOne({ userId });
        // If data in activeTimer collection then we need to stop it and store in pomodoroSession collection
        if(activeTimerData){
            const pomodoroData=new pomodoroModel({
            userId: activeTimerData.userId,
            session_type: activeTimerData.session_type,
            start_time: new Date(activeTimerData.start_time),
            end_time: new  Date(),
            duration_minutes: Math.round((Date.now()-activeTimerData.start_time)/60000),
            status: "canceled",
            work_name: activeTimerData.work_name
            })
            await pomodoroData.save();
            await activeTimerModel.deleteOne({ userId: activeTimerData.userId });
        }

        const newActiveData = new activeTimerModel({
            userId: pendingActionData.userId,
            session_type: pendingActionData.session_type,
            work_name: pendingActionData.work_name,
            start_time: new Date(),
            expected_end_time: new Date(Date.now()+pendingActionData.duration*60*1000)
        })
        await newActiveData.save();
        await pendingActionModel.deleteOne({ userId });
        return res.status(200).send({"text": `${newActiveData.session_type} session started successfully`});
    }
    catch(error){
        console.error(error);
        return res.status(500).send({error: "An error occurred while processing!"})
    }
}

const rejectPendingActionController = async(req,res) =>{
    try{
    const payload = req.body.data;
    const userId = payload.id;
    if(!userId) return res.status(400).send({error: "Please sent proper data"});
    const pendingActionData =  await pendingActionModel.findOne({userId});
    if(!pendingActionData) return res.status(400).send({error: "No pending actions!"});
    await pendingActionModel.deleteOne({ userId });
    return res.status(200).send({text: "Okay! Keeping your current session running."});
    }
    catch(error){
        console.error(error);
        return res.status(500).send({error: "Unable to delete the data in the pendingActions collection"})
    }
}
module.exports = {acceptPendingActionController,rejectPendingActionController};
