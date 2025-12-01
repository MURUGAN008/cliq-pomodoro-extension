const path=require("path");
const startController=require(path.join(__dirname,"..","controllers","startController.js"));
const express=require("express");
const route=express.Router();
route.post("/",startController);

module.exports=route;