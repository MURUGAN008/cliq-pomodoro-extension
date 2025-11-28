const path=require("path");
const userModel=require(path.join(__dirname,"..","models","user.js"));
const pomodoroModel=require(path.join(__dirname,"..","models","pomodoroSessions.js"));
const activeTimerModel=require(path.join(__dirname,"..","models","activeTimers.js"));


const startActions=async(user,status,sessionType,workName)=>{
    if(status=="start"){
        //for start we need to check whether the user already start the session or not
        const dataInActiveTimer=await activeTimerModel.findOne({userId: user.userId});
        // we need to stop the user if already start work if now they perform break or stop the break if they now perform start work
        if(dataInActiveTimer){
            const remainingMs = dataInActiveTimer.expected_end_time - Date.now();
            const remainingMin = Math.ceil(remainingMs / 60000);
            return {
                error: `A ${dataInActiveTimer.session_type} session is already running (${remainingMin} min left)`,
                action: "choose",
                options: ["Stop and Restart", "Continue"]
            };
        }
        const activeTimerData = new activeTimerModel({
            userId: user.userId,
            session_type: sessionType,
            work_name: workName,
            start_time: new Date(),
            expected_end_time: new Date(Date.now()+user.default_work_duration*60*1000)
        })
        const respAT=await  activeTimerData.save();
        if(!respAT) return {error:"Unable to store in ActionTimer collection"};
        return {text: `Started ${sessionType} session successfully`};
    }
        //for stop we need to check first if there is a session is running in needed session type
        const dataInActiveTimer=await activeTimerModel.findOne({userId: user.userId});
        if(!dataInActiveTimer) return {error:`no session for ${sessionType} is running!`};
        if(dataInActiveTimer.session_type!=sessionType) return {error:`currently ${dataInActiveTimer.session_type} is running!`};
        const pomodoroData=new pomodoroModel({
            userId: user.userId,
            session_type: sessionType,
            start_time: new Date(dataInActiveTimer.start_time),
            end_time: new  Date(),
            duration_minutes: Math.round((Date.now()-dataInActiveTimer.start_time)/60000),
            status: "canceled",
            work_name: workName
        })
        const resp=await pomodoroData.save();
        if(!resp) return {error: "Unable to store data in pomodoroSession"};
        const result=await dataInActiveTimer.deleteOne();
        if(result && !result.acknowledged) return {error: "Unable to delete in active timer db"};
        return {text: `successfully  stopped ${sessionType} session!`}; 
}
     


module.exports={startActions};