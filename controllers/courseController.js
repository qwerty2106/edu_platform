const connection = require('../config/database');

const fs = require('fs');
const path = require('path');

const QUERIES = {
    GET_COURSES: `
        SELECT c.*,
        -- Если null, то 0
        COALESCE(sc.user_count, 0) as users_count,
        GROUP_CONCAT(CASE WHEN ui.rn <= 5 THEN ui.user_img END) as user_images,
        -- is_available
        EXISTS (
            SELECT 1 FROM students_courses sc_check 
            WHERE sc_check.course_id = c.id AND sc_check.user_id = ?
        ) OR EXISTS (
            SELECT 1 FROM teachers_courses tc_check 
            WHERE tc_check.course_id = c.id AND tc_check.user_id = ?
        )
        as is_available
        FROM courses c
        -- user_images
        LEFT JOIN (
            SELECT 
            sc.course_id,
            u.img as user_img,
            -- Группировка курсов и изображений по 5 на каждый sc.course_id
            ROW_NUMBER() OVER (PARTITION BY sc.course_id ORDER BY sc.id) as rn
            FROM students_courses sc
            INNER JOIN users u ON u.id = sc.user_id
        ) ui ON ui.course_id = c.id AND ui.rn <= 5
        -- users_count
        LEFT JOIN (
            SELECT course_id, COUNT(*) as user_count 
            FROM students_courses 
            GROUP BY course_id
        ) sc ON sc.course_id = c.id
        -- Группировка + конкатенация
        GROUP BY c.id 
        LIMIT ? OFFSET ?`,

    GET_MY_COURSES: `
        SELECT c.*,
        -- Если null, то 0
        COALESCE(sc.user_count, 0) as users_count,
        GROUP_CONCAT(CASE WHEN ui.rn <= 5 THEN ui.user_img END) as user_images,
        -- is_available
        EXISTS (
            SELECT 1 FROM students_courses sc_check 
            WHERE sc_check.course_id = c.id AND sc_check.user_id = ?
        ) OR EXISTS (
            SELECT 1 FROM teachers_courses tc_check 
            WHERE tc_check.course_id = c.id AND tc_check.user_id = ?
        )            
        as is_available
        FROM courses c
        -- user_images
        LEFT JOIN (
            SELECT 
            sc.course_id,
            u.img as user_img,
            -- Группировка курсов и изображений по 5 на каждый sc.course_id
            ROW_NUMBER() OVER (PARTITION BY sc.course_id ORDER BY sc.id) as rn
            FROM students_courses sc
            INNER JOIN users u ON u.id = sc.user_id
        ) ui ON ui.course_id = c.id AND ui.rn <= 5
        -- users_count
        LEFT JOIN (
            SELECT course_id, COUNT(*) as user_count 
            FROM students_courses 
            GROUP BY course_id
        ) sc ON sc.course_id = c.id
        -- Фильтрация курсов пользователя
        WHERE EXISTS (
            SELECT 1 FROM students_courses sc_my 
            WHERE sc_my.course_id = c.id AND sc_my.user_id = ?
        ) OR EXISTS (
            SELECT 1 FROM teachers_courses tc_my 
            WHERE tc_my.course_id = c.id AND tc_my.user_id = ?
        )
        -- Группировка + конкатенация
        GROUP BY c.id 
        LIMIT ? OFFSET ?`,

    COUNT_COURSES: `SELECT COUNT(*) as totalCount FROM courses`,
    COUNT_MY_COURSES: `
        SELECT COUNT(DISTINCT c.id) as totalCount 
        FROM courses c 
        WHERE EXISTS (
            SELECT 1 FROM students_courses sc 
            WHERE sc.course_id = c.id AND sc.user_id = ?
        ) OR EXISTS (
            SELECT 1 FROM teachers_courses tc 
            WHERE tc.course_id = c.id AND tc.user_id = ?
        )`,

    GET_MODULES: `
        SELECT * FROM modules WHERE course_id = ? 
        ORDER BY order_index
        LIMIT ? OFFSET ?`,

    GET_LESSONS: `
       SELECT l.*,
       CASE 
            WHEN EXISTS (
                SELECT 1 FROM completed_lessons cl 
                WHERE cl.lesson_id = l.id AND cl.user_id = ?
            ) THEN TRUE 
            ELSE FALSE 
       END AS is_completed
       FROM lessons l 
       WHERE module_id = ?
       ORDER BY l.order_index
       LIMIT ? OFFSET ?`,

    COMPLETE_LESSON: `
        INSERT INTO completed_lessons (user_id, lesson_id, content_path, comment_student, status, score) 
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        content_path = VALUES(content_path),
        comment_student = VALUES(comment_student),
        created_date = NOW(),
        status = VALUES(status),
        score = VALUES(score)`,

    COUNT_MODULES: `SELECT COUNT(*) as totalCount FROM modules WHERE course_id = ?`,

    COUNT_LESSONS: `
        SELECT COUNT(*) as totalCount    
        FROM lessons l 
        WHERE module_id = ?`,

    GET_CURRENT_LESSONS: `
        SELECT *    
        FROM lessons 
        WHERE id = ?`,
}

//Получение всех курсов
exports.getCourses = (req, res) => {
    //Пагинация
    const page = parseInt(req.query.page) || 1;
    const count = parseInt(req.query.count) || 1;
    const userID = req.get('userID');
    const filter = req.query.filter || 'all';

    let GET_QUERY;
    let COUNT_QUERY;
    let queryParams;
    let countParams;

    if (filter === 'all') {
        GET_QUERY = QUERIES.GET_COURSES;
        COUNT_QUERY = QUERIES.COUNT_COURSES;
        queryParams = [userID, userID, count, (page - 1) * count];
        countParams = [];
    }

    else {
        GET_QUERY = QUERIES.GET_MY_COURSES;
        COUNT_QUERY = QUERIES.COUNT_MY_COURSES;
        queryParams = [userID, userID, userID, userID, count, (page - 1) * count];
        countParams = [userID, userID];
    }

    //Все курсы
    connection.query(GET_QUERY, queryParams, (error, coursesResult) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Database error on SELECT" });
        }
        //Кол-во курсов
        connection.query(COUNT_QUERY, countParams, (error, totalCountResult) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: "Database error on SELECT" });
            }
            return res.status(200).json({ courses: coursesResult, totalCount: totalCountResult[0].totalCount });
        });
    })
};

//Получение урока
exports.getCurrentLesson = (req, res) => {
    const lessonID = req.params.lessonID;
    connection.query(QUERIES.GET_CURRENT_LESSONS, [lessonID], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Database error on SELECT" });
        }
        return res.status(200).json(result[0])
    })
};

//Получение всех модулей и уроков курса
exports.getCourseContent = (req, res) => {
    //Пагинация модулей 
    const modulePage = parseInt(req.query.modulePage) || 1;
    const moduleCount = parseInt(req.query.moduleCount) || 3;
    //Пагинация уроков
    const lessonPage = parseInt(req.query.lessonPage) || 1;
    const lessonCount = parseInt(req.query.lessonCount) || 2;

    let moduleID = req.query.moduleID;
    if (moduleID === "null" || moduleID === '' || moduleID === undefined)
        moduleID = null;

    const courseID = req.params.courseID;
    const userID = req.get('userID'); //headers

    //Получение модулей
    connection.query(QUERIES.GET_MODULES, [courseID, moduleCount, (modulePage - 1) * moduleCount], (error, modulesResult) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Database error on SELECT" });
        }

        if (!moduleID && modulesResult.length > 0) {
            moduleID = modulesResult[0].id;
        }
        //Получение уроков
        connection.query(QUERIES.GET_LESSONS, [userID, moduleID, lessonCount, (lessonPage - 1) * lessonCount], (error, lessonsResult) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: "Database error on SELECT" });
            }
            //Кол-во модулей
            connection.query(QUERIES.COUNT_MODULES, [courseID], (error, totalModulesCount) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ error: "Database error on SELECT" });
                }
                //Кол-во уроков
                connection.query(QUERIES.COUNT_LESSONS, [moduleID], (error, totalLessonsCount) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ error: "Database error on SELECT" });
                    }
                    return res.status(200).json({
                        modules: modulesResult,
                        lessons: lessonsResult,
                        modulesCount: totalModulesCount[0].totalCount,
                        lessonsCount: totalLessonsCount[0].totalCount
                    });
                });
            });
        });
    });
};

//Выполнение урока
exports.completeLesson = (req, res) => {
    const file = req.files?.file;
    const { userID, comment } = req.body;
    const { lessonID } = req.params;

    if (file) {
        const fileName = `user${userID}-lesson${lessonID}-${Date.now()}-${file.name}`;
        const uploadPath = path.join(__dirname, '../static/completed-lessons', fileName);

        //Создание папки, если не существует
        const folder = path.join(__dirname, '../static/completed-lessons');
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        //Сохранение файла
        file.mv(uploadPath, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "File saving error" });
            }
            const filePath = `/completed-lessons/${fileName}`;

            //С файлом
            connection.query(QUERIES.COMPLETE_LESSON, [userID, lessonID, filePath, comment, 'На проверке', 0], (error, result) => {
                if (error) {
                    console.error(error);
                    //Удаление файла, если произошла ошибка сохранения в БД
                    try {
                        fs.unlinkSync(uploadPath)
                    } catch (err) {
                        console.error(err);
                        return res.status(500).json({ error: "File delete error" });
                    }
                    return res.status(500).json({ error: "Database error on INSERT" });
                }
                return res.status(201).json({ message: "Lesson completed successfully" });
            });
        });
    }
    else {
        // Без файла
        connection.query(QUERIES.COMPLETE_LESSON, [userID, lessonID, null, null, 'Проверено', 1], (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Database error on INSERT" });
            }
            return res.status(201).json({ message: "Lesson completed successfully" });
        });
    }
};


