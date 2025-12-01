const path=require("path");
const userModel=require(path.join(__dirname,"..","models","user.js"));
const {createUser} =  require(path.join(__dirname,"..","utils","createUser.js"));
const {startActions} = require(path.join(__dirname,"..","utils","startActions.js"));
const {changeDefaultWorkTime, changeDefaultBreakTime} = require(path.join(__dirname,"..","utils","changeSessionTimes.js"));
const startController=async(req,res)=>{
    const payload=req.body.data;
    if(!payload) return res.status(400).send({"text":"No data provided"});
    console.log(payload);
    const userId=payload.id;
    const name=payload.name;
    const status=payload.action;
    const sessionType=payload.sessionType;
    const workName=payload.workName?payload.workName:null;
    const durationMins=Number(payload.durationMins);
    const command = payload.command.toLowerCase();
    console.log("payload: "+JSON.stringify(payload));
    if(!userId || !name || !status || !sessionType || !command || Number.isNaN(durationMins)) return res.status(400).send({"text":"Unable to process! Please sent data properly!"});
    let user=await userModel.findOne({userId : userId});
    // let response;
    console.log("User: "+JSON.stringify(user));
    if(!user){
        const response=await createUser(userId,name);
        if(response.error) return res.status(400).send({"text":"Unable to create user"});
        user=response.user;
    }
    if(payload.work_time && sessionType==="work") user=changeDefaultWorkTime(user,payload.work_time);
    if(payload.break_time && sessionType==="break") user=changeDefaultBreakTime(user,payload.break_time);
    //Do start actions like store data in pomodoroSessions and activeTimers
    const response=await startActions(user,status,sessionType,workName,durationMins,command);
    // console.log(req.body);
    console.log(response);
    return res.status(200).send(response);
}
module.exports=startController;
