const mysql = require('mysql2');
const HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DBName = process.env.DB_NAME;
const initialiseDB = require('./initialiseDB');

const connection = mysql.createConnection({
    host: HOST,
    port: DB_PORT,
    user: USER,
    password: PASSWORD,
});

connection.connect((err) => {
    if (err) {
        console.error('Connection to MySQL Server has failed!');
        throw err;
    }
    console.log('Connected to MySQL Server!');
    initialiseDB(connection, DBName);
});

module.exports = connection;
