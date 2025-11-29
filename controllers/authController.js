const connection = require('../config/database');
//Шифрование пароля
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Сброс пароля
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

//Регистрация пользователя
exports.register = (req, res) => {
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
                    //Токен доступа
                    const accessToken = jwt.sign({ id: insertResult.insertId, role: 'student' }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                    //Токен обновления
                    const refreshToken = jwt.sign({ id: insertResult.insertId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
                    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });

                    return res.status(201).json({
                        message: "User registered successfully",
                        user: {
                            id: insertResult.insertId,
                            username,
                            email,
                            role: 'student',
                            img: null,
                            created_date: new Date().toISOString()
                        },
                        accessToken
                    })
                })
            })
        })
    })
};

//Авторизация пользователя
exports.login = (req, res) => {
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
            const user = result[0];
            //Токен доступа
            const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            //Токен обновления
            const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
            res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });

            return res.status(200).json({
                message: "User authorized successfully",
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    img: user.img,
                    created_date: user.created_date.toISOString()
                },
                accessToken
            })
        })
    })
};

//Запрос на изменение пароля (отправка письма)
exports.requestReset = (req, res) => {
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
                const resetLink = `http://localhost:3000/auth/reset?token=${resetToken}`;
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
};

//Изменнение пароля
exports.reset = (req, res) => {
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
                    const user = result[0];
                    //Токен доступа
                    const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                    //Токен обновления
                    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
                    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });

                    return res.status(200).json({
                        message: "Password changed successfully",
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            role: user.role,
                            img: user.img,
                            createdDate: user.created_date.toISOString()
                        },
                        accessToken
                    })
                })
            })
        })
    })
};

exports.getUserData = (req, res) => {
    const userID = req.user.id;
    connection.query('SELECT id, username, role, email, created_date, img FROM users WHERE id = ?', [userID], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database error on SELECT" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(result[0])
    })
};

//Обновление токена доступа
exports.refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token required" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        //Токен невалиден
        if (err) {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            return res.status(403).json({ error: "Invalid or expired refresh token" });
        }

        connection.query('SELECT id, role FROM users WHERE id = ?', [decoded.id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Database error" });
            }

            // Если пользователь не найден
            if (result.length === 0) {
                res.clearCookie('refreshToken', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict'
                });
                return res.status(403).json({ error: "User not found" });
            }

            const user = result[0];

            //Генерация нового accessToken
            const newAccessToken = jwt.sign(
                {
                    id: user.id,
                    role: user.role
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' } // 15 минут
            );

            // Возвращаем новый access token
            res.json({
                accessToken: newAccessToken
            });
        });

    });

};

//Обновление токена доступа
exports.logout = (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    // Возвращаем новый access token
    res.json({
        message: "Logged out successfully"
    });

};