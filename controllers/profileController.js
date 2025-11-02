const connection = require('../config/database');

//Получение дат прохождения (для графика)
exports.getUserCourses = (req, res) => {
    const userID = req.params.userID;
    connection.query("SELECT c.id, title, uc.created_day, c.stack FROM users_courses uc INNER JOIN courses c ON uc.course_id = c.id WHERE user_id = ?", [userID], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Database error on SELECT" });
        }
        return res.status(200).json(result);
    })
};

//Получение процента прохождения курсов
exports.getUserProgress = (req, res) => {
    const userID = req.params.userID;
    connection.query(`SELECT c.id, c.title, c.img, COUNT(DISTINCT l.id) AS total_lessons, COUNT(cl.lesson_id) AS completed_lessons, 
        CASE 
            WHEN COUNT(DISTINCT l.id) > 0
            THEN ROUND(COUNT(DISTINCT cl.lesson_id) * 100.0 / COUNT(DISTINCT l.id)) 
        ELSE 0
        END as completion_percent
        FROM users_courses uc 
        INNER JOIN courses c ON uc.course_id = c.id 
        INNER JOIN modules m ON m.course_id = c.id
        INNER JOIN lessons l ON l.module_id = m.id
        LEFT JOIN completed_lessons cl ON cl.lesson_id = l.id AND cl.user_id = uc.user_id
        WHERE uc.user_id = ?
        GROUP BY c.id, c.title`, [userID], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Database error on SELECT" });
        }
        return res.status(200).json(result);
    })
};