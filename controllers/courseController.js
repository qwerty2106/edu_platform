const connection = require('../config/database');

const QUERIES = {
    GET_COURSES: `
        SELECT c.*,
        COALESCE(uc.user_count, 0) as users_count,
        GROUP_CONCAT(CASE WHEN ui.rn <= 5 THEN ui.user_img END) as user_images,
        EXISTS (
            SELECT 1 FROM users_courses uc_check 
            WHERE uc_check.course_id = c.id AND uc_check.user_id = ?
        ) as is_available
        FROM courses c
        LEFT JOIN (
            SELECT 
            uc.course_id,
            u.img as user_img,
            ROW_NUMBER() OVER (PARTITION BY uc.course_id ORDER BY uc.id) as rn
            FROM users_courses uc
            INNER JOIN users u ON u.id = uc.user_id
        ) ui ON ui.course_id = c.id AND ui.rn <= 5
        LEFT JOIN (
            SELECT course_id, COUNT(*) as user_count 
            FROM users_courses 
            GROUP BY course_id
        ) uc ON uc.course_id = c.id
        GROUP BY c.id LIMIT ? OFFSET ?`,

    COUNT_COURSES: `SELECT COUNT(*) as totalCount FROM courses`,

    GET_MODULES: `SELECT * FROM modules WHERE course_id=? ORDER BY order_index`,

    GET_LESSONS: `
        SELECT DISTINCT l.id, l.title, l.module_id, l.content_path, l.order_index, l.created_date, 
        CASE WHEN EXISTS (SELECT 1 FROM completed_lessons cl WHERE cl.lesson_id = l.id AND cl.user_id = ? AND cl.passed = TRUE)  
        THEN TRUE ELSE FALSE END AS is_completed 
        FROM lessons l 
        INNER JOIN modules m ON m.id = l.module_id
        WHERE m.course_id = ?
        ORDER BY l.order_index`,

    COMPLETE_LESSON: `INSERT INTO completed_lessons(user_id, course_id, module_id, lesson_id, passed) VALUES (?, ?, ?, ?, ?)`,
}

//Получение всех курсов
exports.getCourses = (req, res) => {
    //Пагинация
    const page = parseInt(req.query.page) || 1;
    const count = parseInt(req.query.count) || 1;
    const userID = req.get('userID');
    //Все курсы
    connection.query(QUERIES.GET_COURSES, [userID, count, (page - 1) * count], (error, coursesResult) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Database error on SELECT" });
        }
        //Кол-во курсов
        connection.query(QUERIES.COUNT_COURSES, (error, totalCountResult) => {
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
    connection.query(QUERIES.GET_MODULES, [courseID], (error, modulesResult) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Database error on SELECT" });
        }
        //Получение уроков
        connection.query(QUERIES.GET_LESSONS, [userID, courseID], (error, lessonsResult) => {
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
    connection.query(QUERIES.COMPLETE_LESSON, [userID, courseID, moduleID, lessonID, passed], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Database error on INSERT" });
        }
        return res.status(201).json({ message: "Lesson completed successfully" });
    })
};

