const path=require("path");
const userModel=require(path.join(__dirname,"..","models","user.js"));
const {createUser} =  require(path.join(__dirname,"..","utils","createUser.js"));

const createUserController = async(req,res) =>{
    try{
        const payload = req.body;
        const userId = payload.id;
        const name = payload.name;
        // console.log(userId+" "+name+" "+payload);
        if(!userId || !name) return res.status(400).send({error: "Please sent proper data to create user!"});
        const response=await createUser(userId,name);
        if(response.error) return res.status(400).send({"text":"Unable to create user"});
        return res.status(200).send({"text" : "User created Successfully! Let's crush the task"})
    }
    catch(error){
        return res.send(500).send({error: "Unable to  store in users collection"})
    }
}

module.exports = createUserController;

