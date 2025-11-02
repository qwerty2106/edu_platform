const connection = require('../config/database');
const crypto = require('crypto');

const onlineUsersStats = new Map();

module.exports = (io) => {
    //Расчет кол-ва онлайн-пользователей на каждую комнату
    const emitRoomStatsToAll = () => {
        const roomStats = {};
        Array.from(onlineUsersStats.values()).forEach(user => {
            if (user.chatID) {
                if (!roomStats[user.chatID]) {
                    roomStats[user.chatID] = 0
                };
                roomStats[user.chatID]++;
            };
        });
        io.emit('roomStats', roomStats);  //Для всех сокетов
        console.log("roomStats: ", roomStats)
    };
    //Расчет кол-ва сообщений на каждую комнату
    const emitMessageStatsToAll = () => {
        const messageStats = {};
        connection.query("SELECT chat_id, COUNT(*) AS messageCount FROM messages GROUP BY chat_id", (err, result) => {
            if (err) {
                console.log(err);
                return;
            };

            result.forEach(row => {
                messageStats[row.chat_id] = row.messageCount;
            })
            io.emit('messageStats', messageStats);
        });
    };

    emitRoomStatsToAll();
    emitMessageStatsToAll();

    io.on('connection', (socket) => {
        //Подключение пользователя в комнату
        socket.on('join', ({ username, chatID }) => {
            socket.join(chatID);
            console.log(`User ${username} joined`);
            onlineUsersStats.set(socket.id, { username, chatID });
            console.log("onlineUsersStats:", onlineUsersStats);
            //Отправка уведомления всем участникам чата, кроме отправителя
            io.to(chatID).emit('notify', {
                status: 'success',
                message: `User ${username} joined`
            });
            emitRoomStatsToAll();
        });

        //Отключение пользователя при выходе из комнаты
        socket.on('leave', ({ username, chatID }) => {
            socket.leave(chatID);
            onlineUsersStats.delete(socket.id)

            console.log(`User ${username} left`);
            console.log("onlineUsersStats:", onlineUsersStats);

            io.to(chatID).emit('notify', {
                status: 'error',
                message: `User ${username} left`
            });
            emitRoomStatsToAll();
        });

        //Отключение пользователя при закрытии вкладки 
        socket.on('disconnect', () => {
            console.log(`User ${socket.id} disconnected`);
            const userData = onlineUsersStats.get(socket.id)
            //Выход из приложения не зайдя ни в одну комнату
            if (!userData)
                return
            const { username, chatID } = userData;
            onlineUsersStats.delete(socket.id);

            io.to(chatID).emit('notify', {
                status: 'error',
                message: `User ${username} left`
            });
            emitRoomStatsToAll();
        });

        //Отправка сообщения
        socket.on('send-message', ({ message, username, chatID }) => {
            const key = getMessageKey(chatID);
            const encrypted = encryptAES256(message, key);
            //Добавление записи в БД
            connection.query("INSERT INTO messages(message, iv, username, chat_id) VALUES(?, ?, ?, ?)", [encrypted.message, encrypted.iv, username, chatID], (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }
                io.to(chatID).emit('receive-message', {
                    id: result.insertId,
                    username: username,
                    message: message,
                    chatId: chatID,
                    createdDate: new Date().toLocaleString()
                });
                emitMessageStatsToAll();
            });
        });

        socket.on('requestRoomStats', () => {
            const roomStats = {};
            Array.from(onlineUsersStats.values()).forEach(user => {
                if (user.chatID) {
                    if (!roomStats[user.chatID]) {
                        roomStats[user.chatID] = 0;
                    };
                    roomStats[user.chatID]++
                };
            });
            socket.emit('roomStats', roomStats);  //Для текущего сокета
        })

        socket.on('requestMessageStats', () => {
            const messageStats = {};
            connection.query("SELECT chat_id, COUNT(*) AS messageCount FROM messages GROUP BY chat_id", (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                };

                result.forEach(row => {
                    messageStats[row.chat_id] = row.messageCount;
                });
                socket.emit('messageStats', messageStats);  //Для текущего сокета
            });
        });
    });
};

//Шифрование сообщений
const encryptAES256 = (message, key) => {
    const iv = crypto.randomBytes(16); //Вектор инициализации (уникальность)
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    let encrypted = cipher.update(message, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    return {
        iv: iv.toString('hex'),
        message: encrypted
    };
};

//Дешифрование сообщений
const decryptAES256 = (encryptedData, key) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(encryptedData.iv, 'hex'));
    let decrypted = decipher.update(encryptedData.message, 'hex', 'utf-8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

//Генерация ключа шифрования
const getMessageKey = (chatID) => {
    const masterKey = process.env.MASTER_KEY;
    return crypto.createHmac('sha256', masterKey)
        .update(chatID.toString())
        .digest();
};


