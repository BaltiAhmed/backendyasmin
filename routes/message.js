const express = require("express");
const route = express.Router();
const { check } = require("express-validator");
const messageControllers = require("../controllers/message");

route.post("/ajoutClient", messageControllers.sendMessageClient);
route.post("/sendMessageClientToFourniseur", messageControllers.sendMessageClientToFinanciere);
route.post("/sendMessageFinanciereToClient", messageControllers.sendMessageFinanciereToClient);
route.get('/',messageControllers.getMessage)
route.get('/client/:id',messageControllers.getMessageByClientId)
route.get('/financiere/:id',messageControllers.getMessageByFinanciereId)


module.exports = route;