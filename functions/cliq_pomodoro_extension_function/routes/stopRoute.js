const path = require("path"); 
const express = require("express");
const route = express.Router();
const stopController=require(path.join(__dirname,"..","controllers","stopController.js"));

route.post("/",stopController);

module.exports = route;
