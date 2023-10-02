const sql = require("../configDB/db");
const mysql = require("mysql");

const User = function (userData) {
    this.username = userData.userName,
    this.name = userData.name,
    this.password = userData.password,
    this.email = userData.email,
    this.avatar_id = userData.avatarId
}

//sign up a new user
User.signUp = (newUserData, result) => {
    let query = "INSERT INTO users SET ?";
    query = mysql.format(query, newUserData);
    sql.query(query, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        console.log("New user registered succesfully: ", { userId: res.insertId, ...newUserData });
        result(null, { success: true, userId: res.insertId, ...newUserData });
    });
};

//login a user
User.login = (username, password, result) => {
    let query = 
        `SELECT user_id AS userId, session_key AS sessionKey 
        FROM users 
        WHERE username = ? AND password = ?`;
    query = mysql.format(query, [username, password]);
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.length == 0) {
        console.log("Username or password is incorrect");
        result(null, {userId: '', sessionKey: ''});
        return;
      }
      console.log("Retrieved user credentials: ", res[0]);
      result(null, res[0]);
    });
  };

// return user details 
User.getDetails = (userId, sessionKey, result) => {
  let query = 
    `SELECT 
      user_id AS userId, name, username, email, 
      unix_timestamp(registration_date) * 1000 AS registrationDate, 
      unix_timestamp(last_login) * 1000 AS lastLogin, post_count AS postCount, 
      avatar_id as avatarId, session_key AS sessionKey
    FROM users 
    WHERE user_id = ?`;
  query = mysql.format(query, [userId]);
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if ((res.length == 0) || (res[0].sessionKey !== sessionKey)) {
      console.log("Session was terminated, please repeat log in");
      result(null, {userId: '', sessionKey: ''});
      return;
    }
    console.log("Returned details for user: " + res[0].username + " (ID: " + res[0].userId +").");
    result(null, res[0]);
  });
};

module.exports = User;
