const connection = require('../config/database');

//Получение статистики (процент прохождения курса) и активности (дата, кол-во выполненных уроков)
exports.getUserProgress = (req, res) => {
    const userID = req.params.userID;
    const page = parseInt(req.query.page) || 1;
    const count = parseInt(req.query.count) || 2;

    connection.query(`SELECT c.id, c.title, c.img, COUNT(DISTINCT l.id) AS total_lessons, COUNT(DISTINCT CASE WHEN cl.passed = TRUE THEN cl.lesson_id END) AS completed_lessons, 
        CASE 
            WHEN COUNT(DISTINCT l.id) > 0
            THEN ROUND(COUNT(DISTINCT CASE WHEN cl.passed = TRUE THEN cl.lesson_id END) * 100.0 / COUNT(DISTINCT l.id)) 
        ELSE 0
        END as completion_percent
        FROM users_courses uc 
        INNER JOIN courses c ON uc.course_id = c.id 
        LEFT JOIN modules m ON m.course_id = c.id
        LEFT JOIN lessons l ON l.module_id = m.id
        LEFT JOIN completed_lessons cl ON cl.lesson_id = l.id AND cl.user_id = uc.user_id
        WHERE uc.user_id = ?
        GROUP BY c.id, c.title, c.img
        LIMIT ? OFFSET ?`, [userID, count, (page - 1) * count], (error, statisticsResult) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Database error on SELECT" });
        }
        connection.query("SELECT COUNT(*) as lessons_count, DATE(created_date) as completed_date FROM completed_lessons WHERE user_id = ? GROUP BY DATE(created_date) ORDER BY completed_date DESC", [userID], (error, activityResult) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: "Database error on SELECT" });
            }
            connection.query("SELECT COUNT(*) as totalCount FROM users_courses WHERE user_id = ?", [userID], (error, totalCountResult) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ error: "Database error on SELECT" });
                }
                return res.status(200).json({ 'statistics': statisticsResult, 'activity': activityResult, 'totalCount': totalCountResult[0].totalCount });
            })
        });
    });
};