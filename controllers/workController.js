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
}

//Получение всех выполненных работ
exports.getWorks = (req, res) => {
    //Пагинация
    const page = parseInt(req.query.page) || 1;
    const count = parseInt(req.query.count) || 3;

    const { userID } = req.params;

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

    connection.query(QUERIES.GET_CURRENT_WORK, [userID, lessonID], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Database error on SELECT" });
        }
        return res.status(200).json(result[0])
    })
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