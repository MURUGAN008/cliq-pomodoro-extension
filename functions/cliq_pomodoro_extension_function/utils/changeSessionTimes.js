const path = require("path")
const userModel=require(path.join(__dirname,"..","models","user.js"));

const changeDefaultWorkTime = async(user,newWorkTime) => {
    return await userModel.findByIdAndUpdate(
        user.userId,
        { $set : {default_work_duration: newWorkTime}},
        { new : true}
    ); 
};

const  changeDefaultBreakTime = async(user, newBreakTime) => {
    return await userModel.findByIdAndUpdate(
        user.userId,
        { $set : {default_break_duration: newBreakTime}},
        { new : true}
    );
};

module.exports = {changeDefaultWorkTime, changeDefaultBreakTime};
