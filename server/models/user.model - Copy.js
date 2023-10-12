const connection = require('../configDB/db');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const { createJsonResponse } = require('../utils/functions.js');

const User = function (userData) {
    (this.username = userData.userName),
        (this.name = userData.name),
        (this.password = userData.password),
        (this.email = userData.email),
        (this.avatar_id = userData.avatarID || 0);

    // const isUsernameRegistered = () => {
    //     console.log(this.username);
    //     return false;
    // };
};

//sign up a new user
User.signUp = async (newUserData, result) => {
    try {
        console.log(4);

        const { username, password } = newUserData;

        // const existingUser = await User.isUsernameRegistered(username);
        // console.log(7);
        // console.log('existinguser: ', await existingUser);
        // if ((await existingUser) instanceof Error) {
        //     console.log('error during data check');
        //     return result(existingUser, null);
        // }
        // console.log(8);

        // if (await existingUser) {
        //     console.log('rastas veikejas');
        //     return result(
        //         null,
        //         createJsonResponse('fail', 'Username is used.')
        //     );
        // }
        // console.log(8);

        // let query = `SELECT 1 FROM users WHERE username = ? LIMIT 1`;
        // console.log('query step:');
        // connection.query(query, username, (err, res) => {
        //     if (err) {
        //         console.log('err1');
        //         return result(err, null);
        //     }
        //     if (res[0]) {
        //         console.log('err2');
        //         return result(
        //             null,
        //             createJsonResponse('fail', 'Username is taken.')
        //         );
        //     }
        // });

        console.log('tesimas neradus vartotojo');
        newUserData.password = bcrypt.hash(password, 10);
        console.log(9);
        query = 'INSERT INTO users SET ?';
        connection.query(query, newUserData, (err, res) => {
            console.log(10);
            if (err) {
                console.log(11);
                return result(err, null);
            }
            return result(
                null,
                createJsonResponse(
                    'success',
                    `${username} user registration was succesful.`
                )
            );
        });
    } catch (error) {
        {
            console.log(12);
            return result(error, null);
        }
    }
};

//login a user
User.login = (username, password, result) => {
    let query = `
        SELECT user_id AS userId 
        FROM users 
        WHERE username = ? AND password = ?
    `;
    query = mysql.format(query, [username, password]);
    connection.query(query, (err, res) => {
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
    connection.query(query, (err, res) => {
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
    connection.query(query, (err, res) => {
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
    connection.query(query, (err, res) => {
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

// Validate user
User.validateUser = (userId, token, result) => {
    let query = `
        DELETE FROM session_keys
        WHERE key_expires_on < NOW()
        `;
    query = mysql.format(query, [userId]);
    connection.query(query, (err, res) => {
        if (err) {
            return result({ status: 'fail' });
        }
    });

    query = `
        SELECT *
        FROM session_keys
        WHERE owner_id = ? AND session_key = ?`;
    query = mysql.format(query, [userId, token]);

    connection.query(query, (err, res) => {
        if (err || res.length !== 1) {
            return result({ status: 'fail' });
        } else return result({ status: 'success' });
    });
};

// Check is username is available for registration
// User.isUsernameRegistered = () => {
// try {
// console.log(55555);
// let query = `SELECT 1 FROM users WHERE username = ? LIMIT 1`;
// const checkResult = connection.query(query, username, (err, res) => {
//     if (err) {
//         console.log('err1');
//         return err;
//     }
//     if (res[0]) {
//         console.log('err2');
//         return createJsonResponse('fail', 'Username is occupied.');
//     }
// });
// return checkResult;
// return false;

// return connection
//     .promise()
//     .query(query, username)
//     .then(([result, fields]) => {
//         console.log(6);
//         console.log('result: ', result);
//         // return true;
//         return result[0] ? true : false;
//     });
// } catch (error) {
//     console.log('klaida');
//     return error;
// }
// };

module.exports = User;

// await con1.promise().query("your query here")
//     .then( ([rows,fields]) => {
//         your var = rows[0]['field1'];
//         return nome_completo;
//     })
//     .catch(console.log)
