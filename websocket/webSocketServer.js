const connection = require('../config/database');

module.exports = (io) => {
    io.on('connection', (socket) => {
        //Отправка сообщения
        socket.on('send-message', ({ message, username, chatID }) => {
            //Добавление записи в БД
            connection.query("INSERT INTO messages(message, username, chat_id) VALUES(?, ?, ?)", [message, username, chatID], (err, insertRes) => {
                if (err) {
                    console.log(err);
                    return;
                }
                //Получение информации о добавленной записи
                connection.query("SELECT * FROM messages WHERE id = ?", [insertRes.insertId], (err, selectRes) => {
                    if (err) {
                        console.log(err);
                    }
                    const data = selectRes[0];
                    io.to(chatID).emit('receive-message', { id: data.id, username: data.username, message: data.message, chatId: data.chat_id, createdDate: data.created_date });
                });
            });
        });


        //Подключение пользователя в комнату
        socket.on('join', ({ username, chatID }) => {
            socket.join(chatID);
            console.log(`User ${username} joined`);
        });

        //Отключение пользователя при выходе из комнаты
        socket.on('leave', ({ username, chatID }) => {
            socket.leave(chatID);
            console.log(`User ${username} left`);
        });

        //Отключение пользователя при закрытии вкладки 
        socket.on('disconnect', () => {
            console.log(`User ${socket.id} disconnected`);
        });
    });
};

