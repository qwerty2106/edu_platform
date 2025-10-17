const express = require('express');

const chatController = require("../controllers/chatController");
const chatRouter = express.Router();

chatRouter.get('/chats/:chatID', chatController.getChatMessages);
chatRouter.get('/chats', chatController.getUserChats);

module.exports = chatRouter;
