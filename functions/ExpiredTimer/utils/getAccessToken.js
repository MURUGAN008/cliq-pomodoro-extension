const path=require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const axios=require("axios");

let cachedToken=null;
let tokenExpiry=0;
const  getAccessToken=async()=>{
    let now=Date.now();
    if(cachedToken && now<tokenExpiry) return cachedToken;
    const refreshToken=process.env.CLIQ_REFRESH_TOKEN;
    const clientId=process.env.CLIQ_CLIENT_ID;
    const clientSecret=process.env.CLIQ_CLIENT_SECRET;
    if(!refreshToken || !clientId || !clientSecret){
        console.log(`rt: ${refreshToken}\nci: ${clientId}\ncs: ${clientSecret}`)
        console.error("Unable to get credentials to get access token");
        return {error: "Unable to get credentials to get access token"};
    }
    const params = new URLSearchParams({
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token"
    });

    const response = await axios.post("https://accounts.zoho.in/oauth/v2/token", params);
    cachedToken = response.data.access_token;
    tokenExpiry = now + (response.data.expires_in - 60) * 1000;
    console.log("new access token: "+cachedToken);
    return cachedToken;
}
module.exports={getAccessToken};