require("dotenv").config()
const path=require("path");
const axios=require("axios");


// const {getAccessToken}=require(path.join(__dirname,"getAccessToken.js"));

const notifyUser = async (userId, message) => {
    // const accessToken = await getAccessToken();
    console.log(`zapikey: ${process.env.CLIQ_BOT_ZAPIKEY}\nuserId:${userId}\nmessage: ${message}`);

    try {
        const response = await axios.post(
            `https://cliq.zoho.in/api/v2/bots/timerbot/message?zapikey=${process.env.CLIQ_BOT_ZAPIKEY}`,
            {
                text: message,
                userids: userId
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error occured while notify user:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};

module.exports={notifyUser};



// {
//     "access_token": "1000.03497ffef4ca7888769e7c5846409302.ddeecbb87787fcea5c657fda2cf93893",
//     "refresh_token": "1000.1936c4f34792ae848fe2870037465649.39ac2ea1c3e1ef706e0e075c26f821d2",
//     "scope": "ZohoCliq.messages.CREATE",
//     "api_domain": "https://www.zohoapis.in",
//     "token_type": "Bearer",
//     "expires_in": 3600
// }