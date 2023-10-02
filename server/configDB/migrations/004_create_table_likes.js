const initLikesTable = 
    `CREATE TABLE IF NOT EXISTS likes(
        like_id INT NOT NULL AUTO_INCREMENT,
        answer_id INT NOT NULL,
        user_id INT NOT NULL,
        PRIMARY KEY (like_id),
        CONSTRAINT fk_likes_answer_id_answers_answer_id 
            FOREIGN KEY (answer_id) 
            REFERENCES answers(answer_id)
            ON DELETE CASCADE,
        CONSTRAINT fk_likes_user_id_users_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES users(user_id)
    )`;

module.exports = initLikesTable;