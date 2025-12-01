'use strict';
require("dotenv").config();
const path=require("path");
const { IncomingMessage, ServerResponse } = require("http");
const userModel=require(path.join(__dirname,"models","user.js"));
const pomodoroModel=require(path.join(__dirname,"models","pomodoroSessions.js"));
const activeTimerModel=require(path.join(__dirname,"models","activeTimers.js"));
const pendingActionModel = require(path.join(__dirname,"models","pendingAction.js")); 
const mongoose=require("mongoose");
const express=require("express");
const app=express();
const startRoute=require(path.join(__dirname,"routes","startRoute.js"));
const stopRoute=require(path.join(__dirname,"routes","stopRoute.js"));
const createUserRoute = require(path.join(__dirname,"routes","createUserRoute.js"));
const pendingActionRoute = require(path.join(__dirname,"routes","pendingActionRoute.js"));

const MONGODB_URI=process.env.MONGODB_URI;
app.use(express.json());
if(mongoose.connection.readyState==0){
	mongoose.connect(MONGODB_URI)
	.then(async()=>{
		// console.log("DB CONNECTED!");
		await userModel.syncIndexes();
		await pomodoroModel.syncIndexes();
		await activeTimerModel.syncIndexes();
		await pendingActionModel.syncIndexes();
	})
	.catch((err)=>console.error("Unable to connect.\nError:"+err));
}
app.use("/start",startRoute);
app.use("/stop",stopRoute);
app.use("/createUser",createUserRoute);
app.use("/pendingAction",pendingActionRoute);




/**
 * 
 * @param {IncomingMessage} req 
 * @param {ServerResponse} res 
 */
module.exports = (req, res) => {
	app(req,res);
};
