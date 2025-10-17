const connection = require('../config/database');

//Получение всех сообщений
exports.getChatMessages = (req, res) => {
    const chatID = req.params.chatID;
    connection.query("SELECT * FROM messages WHERE chat_id = ?", [chatID], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: "Database error on SELECT" })
        }
        return res.status(200).json(result)
    })
};

//Получение всех комнат
exports.getUserChats = (req, res) => {
    const userID = req.get('userID'); //headers
    connection.query(`SELECT c.id, title, description, DATE_FORMAT(created_date, '%d.%m.%Y, %H:%i:%s') as created_date FROM chats c
                        WHERE 
	                        -- admins and moderators
	                        EXISTS (SELECT 1 FROM users WHERE id = ? AND role IN ('admin', 'moderator'))
                            OR
                            -- students and teachers
                            EXISTS (SELECT 1 FROM users_chats WHERE user_id = ? AND chat_id = c.id)`, [userID, userID], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: "Database error on SELECT" })
        }
        return res.status(200).json(result)
    })
};