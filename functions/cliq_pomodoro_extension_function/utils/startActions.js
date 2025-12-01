const path=require("path");
const userModel=require(path.join(__dirname,"..","models","user.js"));
const pomodoroModel=require(path.join(__dirname,"..","models","pomodoroSessions.js"));
const activeTimerModel=require(path.join(__dirname,"..","models","activeTimers.js"));
const pendingActionModel = require(path.join(__dirname, "..", "models", "pendingAction.js"))
const recentCommandsMaintainer = require(path.join(__dirname,"recentCommandsMaintainer.js"));
const {getWorkSuggestions, getBreakSuggestions} = require(path.join(__dirname,"getSuggestions.js"));

const startActions=async(user,status,sessionType,workName,durationMins,command)=>{
    if(status=="start"){
        // console.log(user);
        //for start we need to check whether the user already start the session or not
        const dataInActiveTimer=await activeTimerModel.findOne({userId: user.userId});
        // we need to stop the user if already start work if now they perform break or stop the break if they now perform start work
        if(dataInActiveTimer){
            const remainingMs = dataInActiveTimer.expected_end_time - Date.now();
            const remainingMin = Math.ceil(remainingMs / 60000);
            await pendingActionModel.deleteOne({userId: user.userId});
            const newPendingActionData = new pendingActionModel({
                userId:user.userId,
                session_type:sessionType,
                work_name:workName,
                duration:durationMins
            })
            await newPendingActionData.save();
            return {
                error: `A ${dataInActiveTimer.session_type} session is already running (${remainingMin} min left)`,
                action: "choose",
                options : ["Yes", "No"]
            };
        }
        console.log("type:,"+sessionType+",name:"+workName+",end:"+new Date(Date.now()+durationMins*60*1000));
        const activeTimerData = new activeTimerModel({
            userId: user.userId,
            session_type: sessionType,
            work_name: workName,
            start_time: new Date(),
            expected_end_time: new Date(Date.now()+durationMins*60*1000)
        })
        const respAT=await  activeTimerData.save();
        if(!respAT) return {error:"Unable to store in ActionTimer collection"};
        const fieldName = sessionType=="work"?"recent_work_commands":"recent_break_commands";
        await recentCommandsMaintainer(user.userId,fieldName,command);
        return {text: `Started ${sessionType} session successfully`};
    }
        //for stop we need to check first if there is a session is running in needed session type
        // const dataInActiveTimer=await activeTimerModel.findOne({userId: user.userId});
        // if(!dataInActiveTimer) return {error:`no session for ${sessionType} is running!`};
        // if(dataInActiveTimer.session_type!=sessionType) return {error:`currently ${dataInActiveTimer.session_type} is running!`};
        // const pomodoroData=new pomodoroModel({
        //     userId: user.userId,
        //     session_type: sessionType,
        //     start_time: new Date(dataInActiveTimer.start_time),
        //     end_time: new  Date(),
        //     duration_minutes: Math.round((Date.now()-dataInActiveTimer.start_time)/60000),
        //     status: "canceled",
        //     work_name: workName
        // })
        // const resp=await pomodoroData.save();
        // if(!resp) return {error: "Unable to store data in pomodoroSession"};
        // const result=await dataInActiveTimer.deleteOne();
        // if(result && !result.acknowledged) return {error: "Unable to delete in active timer db"};
        // let suggestions;
        // if(sessionType=="work") suggestions = getBreakSuggestions();
        // else suggestions = getWorkSuggestions();
        // return {text: `successfully  stopped ${sessionType} session!`,suggestions: suggestions}; 
}
     


module.exports={startActions};