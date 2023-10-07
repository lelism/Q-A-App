const sql = require('../configDB/db');
const mysql = require('mysql');
// const User = require('../models/user.model.js');
const { createJsonResponse } = require('../utils/functions.js');

const Question = function (questionData) {
    (this.title = questionData.title),
        (this.body = questionData.body),
        (this.author_id = questionData.authorId);
};

//submit new question
Question.submitNew = (token, userId, newQuestionData, result) => {
    let query = 'INSERT INTO questions SET ?';
    query = mysql.format(query, newQuestionData);
    sql.query(query, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.warningStatus !== 0) {
            console.error(`Warning during question submission`);
        }
        result(
            null,
            createJsonResponse('success', `Question submition was succesful`)
        );
    });
};

// GET - get all questions with conditions
Question.getAll = (condition, result) => {
    let query = `SELECT 
        q.question_id AS questionId, q.author_id AS authorId, 
        u.username AS authorName, q.title, q.body,
        unix_timestamp(q.published) * 1000 AS published, 
        unix_timestamp(q.edited) * 1000 AS edited, 
        (SELECT COUNT(*) AS 'count' FROM answers AS a WHERE a.question_id = q.question_id) AS answerCount
      FROM questions AS q 
      LEFT JOIN users AS u 
      ON q.author_id = u.user_id ?`;
    query = mysql.format(query, condition).replace(/'/g, '');
    sql.query(query, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length == 0) {
            result(null, 0);
            return;
        }
        result(null, res);
    });
};

// PATCH update question identified by ID
Question.updateById = (id, newData, result) => {
    let query = `UPDATE questions SET title = ?, body = ? WHERE question_id = ?`;
    query = mysql.format(query, [newData.title, newData.body, id]);
    sql.query(query, (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: 'not_found' }, null);
            return;
        }

        result(null, {
            success: true,
            message: `Question (id=${id}) was updated scessfully`,
        });
    });
};

// DELETE - delete single Question by ID
Question.deleteById = (id, result) => {
    let query = 'DELETE FROM questions WHERE question_id = ?';
    query = mysql.format(query, id);

    sql.query(query, (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            result(
                {
                    success: false,
                    message: 'Question was not found',
                    kind: 'not_found',
                },
                null
            );
            return;
        }
        console.log('deleted question with id: ', id);
        result(null, {
            success: true,
            message: 'Question found. Deleted successfully.',
        });
    });
};

// Count answers for Question by ID
Question.countAnswers = (id, result) => {
    console.log('counting answers');
    let query = `SELECT COUNT(*) AS 'count'
      FROM answers 
      WHERE question_id = ?;`;
    query = mysql.format(query, id);

    sql.query(query, (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }

        console.log(res);
        // result(null, res);
        result(null, { success: true, message: 'answers counted', ...res[0] });
    });
};

module.exports = Question;
