const express = require('express');

const authController = require("../controllers/authController");
const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/reset', authController.reset);
authRouter.post('/request-reset', authController.requestReset);

module.exports = authRouter;
