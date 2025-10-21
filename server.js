require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io')
const express = require('express');

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const webSocketServer = require('./websocket/webSocketServer');
webSocketServer(io);

//Маршруты
const authRouter = require("./routes/authRouter");
const courseRouter = require("./routes/courseRouter");
const chatRouter = require("./routes/chatRouter");

//Маршруты и их обработчики
app.use('/auth', authRouter);
app.use('/app', courseRouter);
app.use('/app', chatRouter);

server.listen(5000, () => console.log('Server is working'));