const express = require('express');
const app = express();
app.use(express.json())
const port = process.env.PORT || 5000;


const mysql = require("mysql2");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "edu_platform_database",
    password: "2106"
});
connection.connect(() => console.log('Database is working'));

app.get('/test', (req, res) => {
  res.json({ message: 'Server works' });
});

//Получение всех курсов
app.get('/courses', (req, res) => {
    connection.query("SELECT * FROM courses", (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Database error on SELECT" });
        }
        return res.status(200).json(result);
    })
});

//Получение всех модулей и уроков курса
app.get('/courses/:course', (req, res) => {
    const course = req.params.course;
    connection.query("SELECT * FROM modules m LEFT JOIN lessons l on l.module_id=m.id where m.course_id=? ORDER BY m.order_index, l.order_index", [course], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Database error on SELECT" });
        }
        return res.status(200).json(result);
    })
});



app.listen(port, () => console.log('Server is working'));

