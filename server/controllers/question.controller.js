const Question = require('../models/question.model.js');
const { testInputIntegrity, createJsonMessage, randomMaxInt, randomMaxFloat} 
  = require('../utils/functions.js');


// Submit new question
exports.create = (req, res) => {
    try {
        let receivedInputs = req.body;

        //comment-uncomment this section for dummy entries
        receivedInputs = {
            title: req.body.title               ||      `title${randomMaxInt(9)}`,
            body: req.body.body                 ||      `body ${randomMaxInt(999999999999999)}`,
            authorId: req.body.authorId         ||      randomMaxInt(9)
        }
        // end of dummy values

    // input validation
        const requiredInputKeys = [
            'title',
            'body',
            'authorId'
        ];
        const invalidInputs = testInputIntegrity(receivedInputs, requiredInputKeys);
        if (invalidInputs) {
            const response = createJsonMessage(`Bad inputs for: ${invalidInputs}.`);
            return res.status(422).send(response);
        };

        const newQuestion = new Question(receivedInputs);
        
        Question.submitNew(newQuestion, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({
                    message: err.message || "New question submission has failed."
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

// Retrieve all questions from the database (with condition).
exports.getAll = (req, res) => {
    try {
      const condition = req.body.condition || '';
      Question.getAll(condition, (err, result) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving questions."
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

// Update a question identified by the id in the request
exports.update = (req, res) => {
  try {
    if (!req.body) {
      res.status(400).send({
        success: false,
        message: "Please provide inputs for the update!"
      });
    }

    const id = req.params.id;
    Question.updateById(id, new Question(req.body), (err, result) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              success: false,
              message: `Question with id ${id} was not found.`
            });
          } else {
            res.status(500).send({
              success: false,
              message: err.message ||"Error updating question with id " + id
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

// Delete a Question identified by ID
exports.deleteById = (req, res) => {
  try {
    const id = req.params.id;
    Question.deleteById(id, (err, result) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Question with id ${id} was not found.`
          });
        } else {
          res.status(500).send({
            message: err.message || "Could not delete Question with id " + id
          });
        }
      } else res.status(200).send({ message: `Question was deleted successfully!` });
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
};

// Count answers to Question identified by ID
exports.countAnswers = (req, res) => {
  try {
    const id = req.params.id;
    Question.countAnswers(id, (err, result) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Question with id ${id} was not found.`
          });
        } else {
          res.status(500).send({
            message: err.message || "Could not count answers for Question with id " + id
          });
        }
      } else res.status(200).send(result);
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
};
