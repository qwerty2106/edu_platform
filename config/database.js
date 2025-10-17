//БД
const mysql = require("mysql2");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "edu_platform_database",
    password: "2106"
});
connection.connect(() => console.log('Database is working'));

module.exports = connection;