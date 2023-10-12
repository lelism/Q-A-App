const initUsersTable = `CREATE TABLE IF NOT EXISTS users(
        user_id INT NOT NULL AUTO_INCREMENT,
        username VARCHAR(20) NOT NULL UNIQUE,
        name VARCHAR(30) NOT NULL,
        password TEXT NOT NULL,
        email VARCHAR(40) NOT NULL,
        registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        post_count INT DEFAULT 0,
        avatar_id INT DEFAULT 1,
        PRIMARY KEY (user_id)
    )`;

module.exports = initUsersTable;
