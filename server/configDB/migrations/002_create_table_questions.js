const initUsersTable = 
    `CREATE TABLE IF NOT EXISTS questions(
        question_id INT NOT NULL AUTO_INCREMENT,
        author_id INT NOT NULL,
        title VARCHAR(60) NOT NULL,
        body VARCHAR(1000) NOT NULL,
        published TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        edited TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
        rating INT NOT NULL DEFAULT 0,
        PRIMARY KEY (question_id),
        CONSTRAINT fk_questions_author_id_users_user_id 
            FOREIGN KEY (author_id) 
            REFERENCES users(user_id)
    )`;

module.exports = initUsersTable;