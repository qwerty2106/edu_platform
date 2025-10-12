//Сервер
const express = require('express');
const app = express();
app.use(express.json())
const port = process.env.PORT || 5000;

//БД
const mysql = require("mysql2");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "edu_platform_database",
    password: "2106"
});
connection.connect(() => console.log('Database is working'));

//Шифрование пароля
const bcrypt = require('bcrypt');

//Сбор пароля
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
        user: "anna.asessorova.05@mail.ru",
        pass: "d8eUEBuN9sIquvqxK6cS"
    }
});


//Получение всех курсов
app.get('/app/courses', (req, res) => {
    connection.query("SELECT * FROM courses", (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Database error on SELECT" });
        }
        return res.status(200).json(result);
    })
});

//Получение всех модулей и уроков курса
app.get('/app/courses/:courseID', (req, res) => {
    const courseID = req.params.courseID;
    //Получение модулей
    connection.query("SELECT * FROM modules WHERE course_id=? ORDER BY order_index", [courseID], (error, modulesResult) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Database error on SELECT" });
        }
        //Получение уроков
        connection.query("SELECT l.id, l.title, l.module_id, l.content_path, l.order_index, l.created_date FROM lessons l INNER JOIN modules m ON m.id = l.module_id WHERE m.course_id=? ORDER BY l.order_index", [courseID], (error, lessonsResult) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: "Database error on SELECT" });
            }
            return res.status(200).json({ modules: modulesResult, lessons: lessonsResult });
        })
    })
});

//Регистрация пользователя
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    //Проверка свободного имени
    connection.query('SELECT * FROM users WHERE username=? OR email=? ', [username, email], (err, selectResult) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: "Database error on SELECT" })
        }
        //Имя или почта заняты (пользователь существует)
        if (selectResult.length > 0) {
            if (selectResult[0].email === email)
                return res.status(409).json({ error: "Email already exists" });
            if (selectResult[0].username === username)
                return res.status(409).json({ error: "Username already exists" });
        }
        //Генерация соли
        bcrypt.genSalt(10, (err, salt) => {  //10 - уровень сложности
            if (err) {
                console.log('Generate salt error')
                return res.status(500).json({ error: "Server error" })
            }
            //Хеширование пароля
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    console.log('Hash password error')
                    return res.status(500).json({ error: "Server error" })
                }
                connection.query('INSERT INTO users(email, username, password) VALUES(?, ?, ?)', [email, username, hash], (err, insertResult) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json({ error: "Database error on INSERT" })
                    }
                    return res.status(201).json({
                        message: "User registered successfully",
                        user: {
                            id: insertResult.insertId,
                            username,
                            email,
                            role: 'student',
                            created_date: new Date().toLocaleString()
                        }
                    })
                })
            })
        })
    })
});

//Авторизация пользователя
app.post('/login', (req, res) => {
    const { login, password } = req.body;
    connection.query('SELECT * FROM users WHERE email=? OR username=?', [login, login], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: "Database error on SELECT" })
        }
        //Неверное почта/имя пользователя
        if (result.length === 0)
            return res.status(401).json({ error: "Invalid login" })

        //Сравнение паролей
        bcrypt.compare(password, result[0].password, (err, isMatch) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ error: "Server error" })
            }
            //Пароль неверный
            if (!isMatch)
                return res.status(401).json({ error: "Invalid login or password" })
            //Пароль верный
            return res.status(200).json({
                message: "User authorized successfully",
                user: {
                    id: result[0].id,
                    username: result[0].username,
                    email: result[0].email,
                    role: result[0].role,
                    created_date: result[0].created_date.toLocaleString()
                }
            })
        })
    })
});

//Запрос на изменение пароля (отправка письма)
app.post('/request-reset', (req, res) => {
    const { email } = req.body;
    connection.query('SELECT * FROM users WHERE email=?', [email], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database error on SELECT" });
        }
        //Пользователь по email не существует
        if (result.length === 0)
            return res.status(401).json({ error: "User doesn't exist" })
        const userID = result[0].id;
        //Генерация токена и времени его жизни
        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Server error" });
            }
            const resetToken = buffer.toString('hex');
            const resetTokenExp = Date.now() + 60 * 60 * 1000; //1ч

            //Сохранение токена в базу
            connection.query('UPDATE users SET reset_token=?, reset_token_exp=? WHERE id=?', [resetToken, resetTokenExp, userID], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: "Database error on UPDATE" });
                }
                const resetLink = `http://localhost:3000/reset?token=${resetToken}`;
                const message = {
                    from: 'edu_platform <anna.asessorova.05@mail.ru>',
                    to: `${email}`,
                    subject: "Password reset",
                    html: `<p>Click this link to reset your password: <a href="${resetLink}">Link</a></p>`,
                };
                transporter.sendMail(message, (err, info) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ error: "Server error" });
                    }
                    return res.status(200).json({ message: "Reset token created succesfully" });
                })
            })
        })
    })
});

//Изменнение пароля
app.post('/reset', (req, res) => {
    const { resetToken, newPassword } = req.body;
    connection.query('SELECT * FROM users WHERE reset_token=? AND reset_token_exp>?', [resetToken, Date.now()], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database error on SELECT" });
        }
        //Записей не найдено
        if (result.length === 0)
            return res.status(401).json({ error: "Invalid or expired token" })
        bcrypt.genSalt(10, (err, salt) => {  //10 - уровень сложности
            if (err) {
                console.log('Generate salt error')
                return res.status(500).json({ error: "Server error" })
            }
            //Хеширование пароля
            bcrypt.hash(newPassword, salt, (err, hash) => {
                if (err) {
                    console.log('Hash password error')
                    return res.status(500).json({ error: "Server error" })
                }
                connection.query('UPDATE users SET password=?, reset_token=null, reset_token_exp=null WHERE reset_token=?', [hash, resetToken], (err, insertResult) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json({ error: "Database error on UPDATE" })
                    }
                    return res.status(200).json({
                        message: "User change password successfully",
                        user: {
                            id: result[0].id,
                            username: result[0].username,
                            role: result[0].role,
                            email: result[0].email,
                            createdDate: result[0].created_date.toLocaleString()
                        }
                    })
                })
            })
        })
    })
});

//Получение всех сообщений
app.get('/chat/:currentChat', (req, res) => {
    const currentChat = req.params.currentChat;
    connection.query("SELECT * FROM messages WHERE chat_id = ?", [currentChat], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: "Database error on SELECT" })
        }
        return res.status(200).json(result)
    })
})

//Получение всех комнат
app.get('/app/rooms', (req, res) => {
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
});

app.listen(port, () => console.log('Server is working'));

