const express = require('express');

const workController = require("../controllers/workController");
const workRouter = express.Router();

workRouter.get('/works', workController.getWorks);

module.exports = workRouter;