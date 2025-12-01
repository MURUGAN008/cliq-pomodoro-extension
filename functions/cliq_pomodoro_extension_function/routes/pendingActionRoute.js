const  path = require("path");
const express = require("express");
const route = express.Router();
const {acceptPendingActionController,rejectPendingActionController} = require(path.join(__dirname,"..","controllers","pendingActionController.js"));

route.post("/accept",acceptPendingActionController);
route.post("/reject",rejectPendingActionController);

module.exports = route;

