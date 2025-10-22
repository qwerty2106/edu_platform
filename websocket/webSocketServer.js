const connection = require('../config/database');
const crypto = require('crypto');

module.exports = (io) => {
    io.on('connection', (socket) => {
        //Подключение пользователя в комнату
        socket.on('join', ({ username, chatID }) => {
            socket.join(chatID);
            console.log(`User ${username} joined`);
            //Отправка уведомления всем участникам чата, кроме отправителя
            io.to(chatID).emit('notify', {
                status: 'success',
                message: `User ${username} joined`
            });
        });

        //Отключение пользователя при выходе из комнаты
        socket.on('leave', ({ username, chatID }) => {
            socket.leave(chatID);
            console.log(`User ${username} left`);
            io.to(chatID).emit('notify', {
                status: 'error',
                message: `User ${username} left`
            });
        });

        //Отключение пользователя при закрытии вкладки 
        socket.on('disconnect', () => {
            console.log(`User ${socket.id} disconnected`);
        });

        //Отправка сообщения
        socket.on('send-message', ({ message, username, chatID }) => {
            const key = getMessageKey(chatID);
            const encrypted = encryptAES256(message, key);
            //Добавление записи в БД
            connection.query("INSERT INTO messages(message, iv, username, chat_id) VALUES(?, ?, ?, ?)", [encrypted.message, encrypted.iv, username, chatID], (err, insertRes) => {
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
                    const sameKey = getMessageKey(chatID);
                    const decrypted = decryptAES256({
                        message: data.message,
                        iv: data.iv
                    }, sameKey);
                    //Отправка сообщения в чат
                    io.to(chatID).emit('receive-message', {
                        id: data.id,
                        username: data.username,
                        message: decrypted,
                        chatId: data.chat_id,
                        createdDate: data.created_date
                    });
                });
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


