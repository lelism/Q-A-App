const Answer = require('../models/answer.model.js');
const { testInputIntegrity, createJsonMessage, randomMaxInt, randomMaxFloat} 
  = require('../utils/functions.js');


// Submit new answer
exports.create = (req, res) => {
    try {
        let receivedInputs = req.body;

        //comment-uncomment this section for dummy entries
        receivedInputs = {
            questionId: req.body.questionId     ||      randomMaxInt(9),
            authorId: req.body.authorId         ||      randomMaxInt(9),
            body: req.body.body                 ||      `body content ${randomMaxInt(10)}`,
        }
        // end of dummy values

        const requiredInputKeys = [
            'questionId',
            'authorId',
            'body'
        ];
        const invalidInputs = testInputIntegrity(receivedInputs, requiredInputKeys);
        if (invalidInputs) {
            const response = createJsonMessage(`Bad inputs for: ${invalidInputs}.`);
            return res.status(422).send(response);
        };

        const newAnswer = new Answer(receivedInputs);
        
        Answer.submitNew(newAnswer, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({
                    message: err.message || "New answer submission has failed."
                })
            } else {
                res.status(200).send(result);
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(400).send(error);
    }
}

// Retrieve all answers to question by question ID.
exports.getAnswers = (req, res) => {
    try {
      const questionId = req.query.questionId;
      const condition = req.body.condition || '';
      if (!questionId) {
        return (res.status(400).send({
            success: false,
            message: "Question identifier is missing."
          }));
      };
      Answer.getAnswers(questionId, condition, (err, result) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving answers."
          });
        else {
          if (!result)
            return res.status(200).send(createJsonMessage("No entries found"));
          res.status(200).send(result);
        }
      });  
    } catch (error) {
      console.error(error);
      return res.status(400).send(error);
    }
  };

// Update a answer identified by the id in the request
exports.update = (req, res) => {
  try {
    if (!req.body) {
      res.status(400).send({
        success: false,
        message: "Please provide inputs for the update!"
      });
    }

    const id = req.params.id;
    Answer.updateById(id, new Answer(req.body), (err, result) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              success: false,
              message: `Answer with id ${id} was not found.`
            });
          } else {
            res.status(500).send({
              success: false,
              message: err.message ||"Error updating answer with id " + id
            });
          }
        } else res.status(200).send(result);
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
};

// Delete a Answer identified by ID
exports.deleteById = (req, res) => {
  try {
    const id = req.params.id;
    Answer.deleteById(id, (err, result) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Answer with id ${id} was not found.`
          });
        } else {
          res.status(500).send({
            message: err.message || "Could not delete Answer with id " + id
          });
        }
      } else res.status(200).send({ message: `Answer was deleted successfully!` });
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
};

// Submit new like for answer
exports.like = (req, res) => {
  try {
      let receivedInputs = req.body;

  // input validation
      const requiredInputKeys = [
          'userId', 
          'answerId'
      ];
      const invalidInputs = testInputIntegrity(receivedInputs, requiredInputKeys);
      if (invalidInputs) {
          const response = createJsonMessage(`Bad inputs for: ${invalidInputs}.`);
          return res.status(422).send(response);
      };

      const newLike = 
        {
          user_id: receivedInputs.userId,
          answer_id: receivedInputs.answerId
        }
      
      Answer.submitLike(newLike, (err, result) => {
          if (err) {
              console.log(err);
              res.status(500).send({
                  message: err.message || "New like submission has failed."
              })
          } else {
              res.status(200).send(result);
          }
      });
  } catch (error) {
      console.error(error);
      return res.status(400).send(error);
  }
}


// Retrieve like status for answer by answer and user IDs.
exports.isLiked = (req, res) => {
  try {
    const answerId = req.body.answerId;
    const userId = req.body.userId;
    if (!answerId || !userId) {
      return (res.status(400).send({
          success: false,
          message: "Identifiers are missing."
        }));
    };
    Answer.isLiked(userId, answerId, (err, result) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving like data."
        });
      else {
        res.status(200).send(result);
      }
    });  
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
};

// Delete a like identified by user and answer IDs
exports.deleteLike = (req, res) => {
  try {
    const userId = req.body.userId;
    const answerId = req.body.answerId;
    Answer.deleteLike(userId, answerId, (err, result) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Like was not found.`
          });
        } else {
          res.status(500).send({
            message: err.message || "Could not delete the Like record"
          });
        }
      } else res.status(200).send({ success: true, message: `Like was deleted successfully!` });
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
};
