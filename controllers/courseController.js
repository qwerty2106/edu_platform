const connection = require('../config/database');

//Получение всех курсов
exports.getCourses = (req, res) => {
    //Пагинация
    const page = parseInt(req.query.page) || 1;
    const count = parseInt(req.query.count) || 1;
    //Все курсы
    connection.query('SELECT * FROM total_courses_view LIMIT ? OFFSET ?', [count, (page - 1) * count], (error, coursesResult) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Database error on SELECT" });
        }
        //Кол-во курсов
        connection.query("SELECT COUNT(*) as totalCount FROM courses", (error, totalCountResult) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: "Database error on SELECT" });
            }
            return res.status(200).json({ courses: coursesResult, totalCount: totalCountResult[0].totalCount });
        });
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
        connection.query(`SELECT DISTINCT l.id, l.title, l.module_id, l.content_path, l.order_index, l.created_date, 
                CASE WHEN EXISTS (SELECT 1 FROM completed_lessons cl WHERE cl.lesson_id = l.id AND cl.user_id = ? AND cl.passed = TRUE)  
                THEN TRUE ELSE FALSE END AS is_completed 
                FROM lessons l 
                INNER JOIN modules m ON m.id = l.module_id
                WHERE m.course_id = ?
                ORDER BY l.order_index`, [userID, courseID], (error, lessonsResult) => {
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
    const { userID, passed } = req.body;
    const { courseID, moduleID, lessonID } = req.params;
    connection.query("INSERT INTO completed_lessons(user_id, course_id, module_id, lesson_id, passed) VALUES (?, ?, ?, ?, ?)", [userID, courseID, moduleID, lessonID, passed], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Database error on INSERT" });
        }
        return res.status(201).json({ message: "Lesson completed successfully" });
    })
};

