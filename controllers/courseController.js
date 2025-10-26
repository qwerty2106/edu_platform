const connection = require('../config/database');

//Получение всех курсов
exports.getCourses = (req, res) => {
    connection.query("SELECT * FROM courses", (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Database error on SELECT" });
        }
        return res.status(200).json(result);
    })
};

//Получение всех модулей и уроков курса
exports.getCourseContent = (req, res) => {
    const courseID = req.params.courseID;
    const userID = req.get('userID'); //headers
    //Получение модулей
    connection.query("SELECT * FROM modules WHERE course_id=? ORDER BY order_index", [courseID], (error, modulesResult) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Database error on SELECT" });
        }
        //Получение уроков
        connection.query("SELECT l.id, l.title, l.module_id, l.content_path, l.order_index, l.created_date, CASE WHEN cl.user_id IS NULL THEN FALSE ELSE TRUE END AS is_completed FROM lessons l INNER JOIN modules m ON m.id = l.module_id LEFT JOIN completed_lessons cl ON cl.lesson_id = l.id and cl.user_id = ? WHERE m.course_id=? ORDER BY l.order_index", [userID, courseID], (error, lessonsResult) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: "Database error on SELECT" });
            }
            return res.status(200).json({ modules: modulesResult, lessons: lessonsResult });
        });
    });
};

//Выполенние урока
exports.completeLesson = (req, res) => {
    const { userID } = req.body;
    const { courseID, lessonID } = req.params;
    connection.query("INSERT INTO completed_lessons(user_id, course_id, lesson_id) VALUES (?, ?, ?)", [userID, courseID, lessonID], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Database error on INSERT" });
        }
        return res.status(201).json({ message: "Lesson completed successfully" });
    })
};
