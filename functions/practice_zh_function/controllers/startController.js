const path=require("path");
const userModel=require(path.join(__dirname,"..","models","user.js"));
const {createUser} =  require(path.join(__dirname,"..","utils","createUser.js"));
const {startActions} = require(path.join(__dirname,"..","utils","startActions.js"));
const startController=async(req,res)=>{
    const payload=req.body.data;
    if(!payload) return res.status(400).send({"text":"No data provided"});
    console.log(payload);
    const userId=payload.id;
    const name=payload.name;
    const status=payload.action;
    const sessionType=payload.sessionType;
    const workName=payload.workName?payload.workName:null;
    if(!userId || !name || !status || !sessionType) return res.status(400).send({"text":"Unable to process! Please sent data properly!"});
    let user=await userModel.findOne({userId : userId});
    let response;
    if(!user){
        response=await createUser(userId,name);
        if(response.error) return res.status(400).send({"text":"Unable to create user"});
        user=response.user;
    }
    //Do start actions like store data in pomodoroSessions and activeTimers
    response=await startActions(user,status,sessionType,workName);
    // console.log(req.body);
    return res.status(200).send(response);
}
module.exports=startController;
