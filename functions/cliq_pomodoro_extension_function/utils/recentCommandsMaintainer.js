const path = require("path")
const userModel= require(path.join(__dirname,"..","models","user.js"));


const recentCommandsMaintainer = async(userId,fieldName,command) => {
    await userModel.findOneAndUpdate(
        {userId},
        {
            $pull : {[fieldName] : command}
        }
    );
    const userData = await userModel.findOneAndUpdate(
        {userId},
        {
            $push:{
                [fieldName] : {
                    $each : [command],
                    $position : 0,
                    $slice : 3
                } 
            }
        }
    );
}

module.exports = recentCommandsMaintainer;


