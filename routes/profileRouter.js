const express = require('express');

const profileController = require("../controllers/profileController");
const profileRouter = express.Router();

profileRouter.get('/profile/:userID', profileController.getUserProgress);

module.exports = profileRouter;