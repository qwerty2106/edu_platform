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

const bcrypt = require('bcrypt');

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
        connection.query("SELECT * FROM lessons l INNER JOIN modules m ON m.id = l.module_id WHERE m.course_id=? ORDER BY l.order_index", [courseID], (error, lessonsResult) => {
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
    const { username, password } = req.body;
    //Проверка свободного имени
    connection.query('SELECT * FROM users WHERE username=?', [username], (err, selectResult) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: "Database error on SELECT" })
        }
        //Имя занято (пользователь существует)
        if (selectResult.length > 0)
            return res.status(409).json({ error: "User already exists" })
        //Имя не занято (пользователь не существует)
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
                connection.query('INSERT INTO users(username, password) VALUES(?, ?)', [username, hash], (err, insertResult) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json({ error: "Database error on INSERT" })
                    }
                    return res.status(201).json({
                        message: "User registered successfully",
                        user: { id: insertResult.insertId, username: username, role: 'student', created_date: new Date().toLocaleString() }
                    })
                })
            })
        })
    })
});

//Авторизация пользователя
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    connection.query('SELECT * FROM users WHERE username=?', [username], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: "Database error on SELECT" })
        }
        //Неверное имя пользователя
        if (result.length === 0) 
            return res.status(401).json({ error: "User doesn't exist" })
        
        //Сравнение паролей
        bcrypt.compare(password, result[0].password, (err, isMatch) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ error: "Server error" })
            }
            //Пароль неверный
            if (!isMatch)
                return res.status(401).json({ error: "Incorrect username or password" })
            //Пароль верный
            return res.status(200).json({
                message: "User authorized successfully",
                user: { id: result[0].id, username: username, role: result[0].role, created_date: result[0].created_date.toLocaleString() }
            })
        })
    })
});


app.listen(port, () => console.log('Server is working'));

