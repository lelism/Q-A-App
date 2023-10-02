const sql = require("../configDB/db");
const mysql = require("mysql");

const Answer = function (answerData) {
    this.question_id = answerData.questionId,
    this.author_id = answerData.authorId,
    this.body = answerData.body
}

//submit new answer
Answer.submitNew = (newAnswerData, result) => {
    let query = "INSERT INTO answers SET ?";
    query = mysql.format(query, newAnswerData);
    sql.query(query, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        console.log("New answer submited succesfully: ", { answerId: res.insertId, ...newAnswerData });
        result(null, { success: true, answerId: res.insertId });
    });
};

// GET - get all answers to the question
Answer.getAnswers = (questionId, condition, result) => {
    let query = 
        `SELECT 
            a.answer_id AS answerId, a.author_id AS authorId,        
            u.username AS authorName, a.body,
            unix_timestamp(a.published) * 1000 AS published, 
            unix_timestamp(a.edited) * 1000 AS edited, 
            (SELECT COUNT(*) AS 'likes' FROM likes AS l WHERE a.answer_id = l.answer_id) AS votes
        FROM answers AS a 
        LEFT JOIN users AS u 
        ON a.author_id = u.user_id
        WHERE a.question_id = ? ?
        ORDER BY a.vote_count DESC, a.published ASC`;
    query = mysql.format(query, [questionId, condition]).replace(/'/g, "");

    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.length == 0) {
        console.log("No entries found");
        result(null, null);
        return;
      }
      console.log("Returned " + res.length + " answer records");
      result(null, res);
    });
  };

// PATCH update answer identified by ID
Answer.updateById = (id, newData, result) => {
  let query = `UPDATE answers SET body = ? WHERE answer_id = ?`;
  query = mysql.format(query, [newData.body, id]);
  sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      };

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      };

      console.log("updated answer record: ", { answer_id: id, ...newData });
      result(null, {
        success: true,
        message: `Answer (id=${id}) was updated scessfully` 
      });
    }
  );
};

// DELETE - delete single Answer by ID
Answer.deleteById = (id, result) => {
  let query = "DELETE FROM answers WHERE answer_id = ?";
  query = mysql.format(query, id);

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ success: false, message: 'Answer was not found', kind: "not_found" }, null);
      return;
    }
    console.log("deleted answer with id: ", id);
    result(null, { success: true, message: 'Answer found. Deleted successfully.' });
  });
};

//submit new like
Answer.submitLike = (newLikeData, result) => {
  let query = "INSERT INTO likes SET ?";
  query = mysql.format(query, newLikeData);
  sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log("New Like submited succesfully: ", { LikeId: res.insertId, ...newLikeData });
      result(null, { success: true, likeId: res.insertId });
  });
};

Answer.isLiked = (userId, AnswerId, result) => {
  let query = "SELECT * FROM likes WHERE user_id = ? AND answer_id = ?";
  query = mysql.format(query, [userId, AnswerId]);
  sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log(res.length);
      if (res.length) {
        result(null, { success: true, isLiked: true });
      } else {
        result(null, { success: true, isLiked: false });
      }
      
  });
};

// DELETE - delete single like by ID
Answer.deleteLike = (userId, answerId, result) => {
  let query = "DELETE FROM likes WHERE answer_id = ? AND user_id = ?";
  query = mysql.format(query, [answerId, userId]);

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ success: false, message: 'Answer was not found', kind: "not_found" }, null);
      return;
    }
    console.log("Like removed");
    result(null, { success: true, message: 'Like found. Deleted successfully.' });
  });
};

module.exports = Answer;
