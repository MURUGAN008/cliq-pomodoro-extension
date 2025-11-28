const path = require("path");
const {notifyUser} = require(path.join(__dirname,"..","..","utils","notifyUser.js"))

const test=async()=>{
    const response=await notifyUser("60044346339","Integration test message!");
    if(!response) console.error("Error: response not received from the notifyUser function");
    if(response && response.error) console.error("Error: "+response.error);
    console.log("Success: "+response)
}

test();
