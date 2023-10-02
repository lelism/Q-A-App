const initAnswersTable = 
    `CREATE TABLE IF NOT EXISTS answers(
        answer_id INT NOT NULL AUTO_INCREMENT,
        question_id INT NOT NULL,
        author_id INT NOT NULL,
        body VARCHAR(1000) NOT NULL,
        published TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        edited TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
        vote_count INT NOT NULL DEFAULT 0,
        PRIMARY KEY (answer_id),
        CONSTRAINT fk_answers_question_id_questions_question_id 
            FOREIGN KEY (question_id) 
            REFERENCES questions(question_id) ON DELETE CASCADE,
        CONSTRAINT fk_answers_author_id_users_user_id 
        FOREIGN KEY (author_id) 
        REFERENCES users(user_id)
    )`;

module.exports = initAnswersTable;