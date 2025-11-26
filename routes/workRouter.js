const express = require('express');
const { authMiddleware } = require("../middleware/authMiddleware");

const workController = require("../controllers/workController");
const workRouter = express.Router();

//middleware на уровне маршрутизатора
workRouter.use(authMiddleware);

workRouter.get('/works/:userID', workController.getWorks);
workRouter.get('/works/:userID/:lessonID', workController.getCurrentWork);
workRouter.put('/works/:userID/:lessonID', workController.updateWork);

module.exports = workRouter;