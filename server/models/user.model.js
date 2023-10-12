const connection = require('../configDB/db');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const {
    createJsonResponse,
    // makeErrorReport,
    createToken,
    isPasswordValid,
} = require('../utils/functions.js');

const ClientError = require('../utils/clientErrorHandler');
const ServerError = require('../utils/serverErrorHandler');

class User {
    constructor(userData) {
        (this.username = userData.userName),
            (this.name = userData.name),
            (this.password = userData.password),
            (this.email = userData.email),
            (this.avatar_id = userData.avatarID || 0);
    }

    /**
     * checks if received username is already registered.
     *
     * @param {string} username - username.
     * @returns {boolean} - true if username is registered, false - if not.
     */
    static async isUsernameRegistered(username) {
        try {
            const query = 'SELECT * FROM users WHERE username = ?';
            const rows = await connection.promise().execute(query, [username]);
            return rows[0].length > 0;
        } catch (error) {
            throw new ServerError(
                500,
                'Unexpected database error',
                error,
                'U-IUR'
            );
        }
    }

    /**
     * @callback CallBack1
     * @param {Error || Object} signUpResult - Registration confirmation response or an Error object
     */
    /**
     * Function for user data storage at DB
     *
     * @function
     * @param {CallBack1} next - Callback function to handle response or Error
     */
    async signUp(next) {
        try {
            const hash = await bcrypt.hash(this.password, 10);

            let query = `
                INSERT INTO users (username, name, email, password, avatar_id) 
                VALUES (?, ?, ?, ?, ?)
                `;
            const rows = await connection
                .promise()
                .execute(query, [
                    this.username,
                    this.name,
                    this.email,
                    hash,
                    this.avatar_id,
                ]);

            if (rows[0].insertId && rows[0].affectedRows === 1) {
                next(
                    createJsonResponse(
                        'success',
                        `${this.username} user registration was successful.`
                    )
                );
            } else {
                next(new ServerError(500, 'User registration failed'));
            }
        } catch (error) {
            next(
                new ServerError(500, 'Unexpected database error', error, 'U-SU')
            );
        }
    }

    /**
     * @callback CallBack2
     * @param {Error || Object} LoginResult - Response (with jwt token) or an Error object
     */
    /**
     * if username and password are valid returns user token
     *
     * @param {string} username - username.
     * @param {string} password - password.
     * @param {CallBack2} next - Callback function to handle response or Error
     */
    static async login(username, password, next) {
        try {
            let query = `
                SELECT user_id AS userId, password as hash
                FROM users
                WHERE username = ?
                `;
            const rows = await connection.promise().query(query, [username]);

            if (rows.length !== 2 || rows[0].length !== 1 || !rows[0][0]) {
                next(new ClientError(404, 'Incorrect username or password'));
                return;
            }

            const { userId, hash } = rows[0][0];
            const passwordIsValid = await isPasswordValid(password, hash);

            if (!passwordIsValid) {
                next(new ClientError(404, 'Incorrect username or password'));
                return;
            }

            const token = await createToken(username, userId);
            if (token instanceof Error) {
                next(
                    new ServerError(
                        500,
                        'Unexpected system error',
                        token,
                        'U-LG'
                    )
                );
            } else {
                next(createJsonResponse('success', token));
            }
        } catch (error) {
            next(
                new ServerError(500, 'Unexpected database error', error, 'U-LG')
            );
        }
    }

    /**
     * @callback CallBack3
     * @param {Error || Object} getDetailsResult - return user details or an Error object
     */
    /**
     * if user token is valid, function returns user details
     *
     * @param {number} userId - userId
     * @param {CallBack3} next - Callback function to handle response or Error
     */
    static async getDetails(userId, next) {
        try {
            let query = `
                SELECT
                    name, username, email,
                    unix_timestamp(registration_date) * 1000 AS registrationDate,
                    unix_timestamp(last_login) * 1000 AS lastLogin,
                    post_count AS postCount, avatar_id as avatarId
                FROM users
                WHERE user_id = ?
                `;

            const rows = await connection.promise().query(query, [userId]);
            if (rows.length !== 2 || rows[0].length !== 1 || !rows[0][0]) {
                next(new ServerErrorError(500, 'Unexpected database error'));
                return;
            }

            const userDetails = rows[0][0];
            next(userDetails);
        } catch (error) {
            next(
                new ServerError(500, 'Unexpected server error', error, 'U-LG')
            );
        }
    }
}

// //updateToken
// User.updateToken = (userId, token, result) => {
//     let query = `
//         DELETE FROM session_keys
//         WHERE key_expires_on < NOW() OR owner_id = ?
//     `;
//     query = mysql.format(query, [userId]);
//     connection.query(query, (err, res) => {
//         if (err) {
//             result(err, null);
//             return;
//         }
//     });

//     query = `
//         INSERT INTO session_keys
//         SET session_key = ?, owner_id = ?,
//         key_expires_on = (NOW() + INTERVAL 24 HOUR)
//     `;
//     query = mysql.format(query, [token, userId]);
//     connection.query(query, (err, res) => {
//         if (err) {
//             console.error('error: ', err);
//             result(err, null);
//             return;
//         }
//         return result(null, res);
//     });
// };

// // Validate user
// User.validateUser = (userId, token, result) => {
//     let query = `
//         DELETE FROM session_keys
//         WHERE key_expires_on < NOW()
//         `;
//     query = mysql.format(query, [userId]);
//     connection.query(query, (err, res) => {
//         if (err) {
//             return result({ status: 'fail' });
//         }
//     });

//     query = `
//         SELECT *
//         FROM session_keys
//         WHERE owner_id = ? AND session_key = ?`;
//     query = mysql.format(query, [userId, token]);

//     connection.query(query, (err, res) => {
//         if (err || res.length !== 1) {
//             return result({ status: 'fail' });
//         } else return result({ status: 'success' });
//     });
// };

// // Check is username is available for registration
// // User.isUsernameRegistered = () => {
// // try {
// // console.log(55555);
// // let query = `SELECT 1 FROM users WHERE username = ? LIMIT 1`;
// // const checkResult = connection.query(query, username, (err, res) => {
// //     if (err) {
// //         console.log('err1');
// //         return err;
// //     }
// //     if (res[0]) {
// //         console.log('err2');
// //         return createJsonResponse('fail', 'Username is occupied.');
// //     }
// // });
// // return checkResult;
// // return false;

// // return connection
// //     .promise()
// //     .query(query, username)
// //     .then(([result, fields]) => {
// //         console.log(6);
// //         console.log('result: ', result);
// //         // return true;
// //         return result[0] ? true : false;
// //     });
// // } catch (error) {
// //     console.log('klaida');
// //     return error;
// // }
// // };

module.exports = User;

// // await con1.promise().query("your query here")
// //     .then( ([rows,fields]) => {
// //         your var = rows[0]['field1'];
// //         return nome_completo;
// //     })
// //     .catch(console.log)
