let tableQueries = {};
tableQueries.users = require('./migrations/001_create_table_users');
tableQueries.questions = require('./migrations/002_create_table_questions');
tableQueries.answers = require('./migrations/003_create_table_answers');
tableQueries.likes = require('./migrations/004_create_table_likes');
tableQueries.keys = require('./migrations/005_create_table_session_keys');

const selectDB = (connection, DBname) => {
    try {
        connection.query(
            `CREATE DATABASE IF NOT EXISTS ${DBname}`,
            (err, result) => {
                if (err) throw err;
            }
        );
        connection.changeUser({ database: DBname }, (err, result) => {
            if (err) throw err;
            console.log(`${DBname} database is initialising:`);
        });
    } catch (error) {
        console.log(error);
    }
};
const initialiseTable = (connection, tableName, initialisationQuery) => {
    try {
        connection.query(initialisationQuery, (err, result) => {
            if (err) throw err;
            console.log(`-- table "${tableName}"... OK`);
        });
    } catch (error) {
        console.log(`-- table "${tableName}"... failed`);
        console.log(error);
        return error;
    }
};

const initialiseDB = (connection, DBname) => {
    try {
        selectDB(connection, DBname);
        Object.entries(tableQueries).forEach(
            ([tableName, tableStructuringQuery]) => {
                initialiseTable(connection, tableName, tableStructuringQuery);
            }
        );
    } catch (error) {
        console.log(error);
    }
};

module.exports = initialiseDB;
