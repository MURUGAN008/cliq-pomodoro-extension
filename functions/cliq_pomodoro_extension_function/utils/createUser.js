const path=require("path");
const userModel=require(path.join(__dirname,"..","models","user.js"));
const createUser=async(id,user_name)=>{
    try{
        console.log("User creation starts!");
        const newUser=new userModel({
            userId: id,
            name: user_name,
        })
        const user=await newUser.save();
        console.log(user);
        return {user};
    }
    catch(error){
        console.error("error:"+error);
        return {error};
    }
}
module.exports = {createUser};