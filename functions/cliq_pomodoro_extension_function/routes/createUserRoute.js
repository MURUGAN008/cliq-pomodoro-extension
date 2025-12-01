const path=require("path");
const express = require("express");
const route = express.Router();
const createUserController = require(path.join(__dirname,"..","controllers","createUserController.js"));

route.post("/",createUserController);

module.exports = route;
