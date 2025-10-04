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
app.get('/courses/:courseID', (req, res) => {
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


app.listen(port, () => console.log('Server is working'));

