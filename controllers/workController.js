const connection = require('../config/database');

const QUERIES = {
    GET_WORKS: `
        SELECT cl.*, u.username, u.img, l.title 
        FROM completed_lessons cl
        INNER JOIN users u ON u.id = cl.user_id
        INNER JOIN lessons l ON l.id = cl.lesson_id
        INNER JOIN modules m ON m.id = l.module_id
        WHERE
        ( 
            -- Для ученика - его работы
            cl.user_id = ? 
        OR
            -- Для преподавателя - работы его учеников
        EXISTS (
            SELECT 1 FROM teachers_courses tc 
            WHERE tc.user_id = ? AND tc.course_id = m.course_id
        ))
        AND l.lesson_type = 'Практика'
        LIMIT ? OFFSET ?`,
    GET_CURRENT_WORK: `
        SELECT * FROM completed_lessons 
        WHERE user_id = ? AND lesson_id = ?`,
    UPDATE_WORK: `
        UPDATE completed_lessons
        SET status = ?, comment_teacher = ?, score = ?
        WHERE user_id = ? AND lesson_id = ?`,
    COUNT_WORKS: `
        SELECT COUNT(*) as totalCount
        FROM completed_lessons cl
        INNER JOIN users u ON u.id = cl.user_id
        INNER JOIN lessons l ON l.id = cl.lesson_id
        INNER JOIN modules m ON m.id = l.module_id
        WHERE 
        (
            -- Для ученика - его работы
            cl.user_id = ? 
        OR
            -- Для преподавателя - работы его учеников
            EXISTS (
                SELECT 1 FROM teachers_courses tc 
                WHERE tc.user_id = ? AND tc.course_id = m.course_id
            )
        )
        AND l.lesson_type = 'Практика'`,
    GET_VALID_USERS: `
        SELECT DISTINCT cl.user_id
        FROM completed_lessons cl
        INNER JOIN lessons l ON l.id = cl.lesson_id
        INNER JOIN modules m ON m.id = l.module_id
        INNER JOIN teachers_courses tc ON tc.course_id = m.course_id
        WHERE tc.user_id = ?`
}

//Получение всех выполненных работ
exports.getWorks = (req, res) => {
    const currentUser = req.user;

    //Пагинация
    const page = parseInt(req.query.page) || 1;
    const count = parseInt(req.query.count) || 3;

    const { userID } = req.params;

    if (userID != currentUser.id)
        return res.status(403).json({ error: "Access denied" });

    connection.query(QUERIES.GET_WORKS, [userID, userID, count, (page - 1) * count], (error, worksResult) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Database error on SELECT" });
        }
        connection.query(QUERIES.COUNT_WORKS, [userID, userID], (error, totalCountResult) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: "Database error on SELECT" });
            }
            return res.status(200).json({ works: worksResult, worksCount: totalCountResult[0].totalCount });
        });
    });
};

//Получение выполненного урока
exports.getCurrentWork = (req, res) => {
    const { userID, lessonID } = req.params;
    const currentUser = req.user;

    const executeQuery = () => {
        connection.query(QUERIES.GET_CURRENT_WORK, [userID, lessonID], (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: "Database error on SELECT" });
            }
            return res.status(200).json(result[0]);
        });
    };

    if (currentUser.role === "student" && userID != currentUser.id)
        return res.status(403).json({ error: "Access denied" });

    if (currentUser.role === "student" && userID == currentUser.id)
        executeQuery();

    if (currentUser.role === "teacher") {
        connection.query(QUERIES.GET_VALID_USERS, [currentUser.id], (error, usersResult) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: "Database error on SELECT" });
            }
            const usersID = usersResult.map(user => user.user_id);

            if (!usersID.includes(parseInt(userID)))
                return res.status(403).json({ error: "Access denied" });

            executeQuery();
        })
    }
};

//Получение выполненного урока
exports.updateWork = (req, res) => {
    const { userID, lessonID } = req.params
    const { status, score } = req.body;

    let comment = req.body.comment;
    if (comment.trim() === '')
        comment = null;

    connection.query(QUERIES.UPDATE_WORK, [status, comment, score, userID, lessonID], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Database error on UPDATE" });
        }
        return res.status(200).json({ message: "Work updated successfully" })
    })
};