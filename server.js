//Сервер
const express = require('express');
const app = express();
app.use(express.json())
const port = process.env.PORT || 5000;

//Маршруты
const authRouter = require("./routes/authRouter");
const courseRouter = require("./routes/courseRouter");
const chatRouter = require("./routes/chatRouter");

//Маршруты и их обработчики
app.use('/auth', authRouter);
app.use('/app', courseRouter);
app.use('/app', chatRouter);

app.listen(port, () => console.log('Server is working'));