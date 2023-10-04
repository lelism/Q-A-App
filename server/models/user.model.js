const sql = require('../configDB/db');
const mysql = require('mysql2');
const { createJsonResponse } = require('../utils/functions.js');

const User = function (userData) {
    (this.username = userData.userName),
        (this.name = userData.name),
        (this.password = userData.password),
        (this.email = userData.email),
        (this.avatar_id = userData.avatarID || 0);
};

//sign up a new user
User.signUp = (newUserData, result) => {
    let query = 'INSERT INTO users SET ?';
    query = mysql.format(query, newUserData);
    sql.query(query, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.warningStatus !== 0) {
            console.error(`Warning during user (${res.insertId}) registration`);
        }
        result(
            null,
            createJsonResponse(
                'success',
                `${newUserData.username} user registration was succesful`
            )
        );
    });
};

//login a user
User.login = (username, password, result) => {
    let query = `
        SELECT user_id AS userId 
        FROM users 
        WHERE username = ? AND password = ?
    `;
    query = mysql.format(query, [username, password]);
    sql.query(query, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length == 0) {
            result(new Error('not_found'), null);
            return;
        }
        return result(null, res[0]);
    });
};

//updateToken
User.updateToken = (userId, token, result) => {
    let query = `
        DELETE FROM session_keys 
        WHERE key_expires_on < NOW() OR owner_id = ?
    `;
    query = mysql.format(query, [userId]);
    sql.query(query, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
    });

    query = `
        INSERT INTO session_keys
        SET session_key = ?, owner_id = ?,
        key_expires_on = (NOW() + INTERVAL 24 HOUR)
    `;
    query = mysql.format(query, [token, userId]);
    sql.query(query, (err, res) => {
        if (err) {
            console.error('error: ', err);
            result(err, null);
            return;
        }
        return result(null, res);
    });
};

// return user details
User.getDetails = (userId, sessionKey, result) => {
    let query = `
        SELECT 
            sk.owner_id AS userId, u.name, u.username, u.email, 
            unix_timestamp(u.registration_date) * 1000 AS registrationDate, 
            unix_timestamp(u.last_login) * 1000 AS lastLogin, 
            u.post_count AS postCount, u.avatar_id as avatarId
        FROM session_keys AS sk
        LEFT JOIN users AS u
        ON sk.owner_id = u.user_id
        WHERE sk.owner_id = ? AND sk.session_key = ?
    `;
    query = mysql.format(query, [userId, sessionKey]);
    sql.query(query, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length === 0) {
            result(
                null,
                createJsonResponse(
                    'fail',
                    'User session is not active. Please login.'
                )
            );
            return;
        }
        result(null, { ...{ status: 'success' }, ...res[0] });
    });
};

module.exports = User;
