const connection = require('../config/database');

const QUERIES = {
    GET_WORKS: `
        SELECT * FROM completed_lessons
        LIMIT ? OFFSET ?`,
}

//Получение всех выполненных работ
exports.getWorks = (req, res) => {
    //Пагинация
    const page = parseInt(req.query.page) || 1;
    const count = parseInt(req.query.count) || 1;

    connection.query(QUERIES.GET_WORKS, [count, (page - 1) * count], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Database error on SELECT" });
        }
        return res.status(200).json(result)
    })
};