const Question = require('../models/question.model.js');
const User = require('../models/user.model.js');

const {
    testInputIntegrity,
    createJsonResponse,
    reportError,
    // createJsonMessage,
    // randomMaxInt,
    // randomMaxFloat,
} = require('../utils/functions.js');

// Submit new question
exports.create = (req, res) => {
    try {
        const userId = req.body.authorId;
        const token = req.headers.authorization;
        const receivedQuestion = req.body;
        User.validateUser(userId, token, (result) => {
            console.log(result);
            if (result.status === 'fail') {
                console.log('pirmas');
                return res
                    .status(400)
                    .send(
                        createJsonResponse(
                            'fail',
                            'Error during authentification. Please repeat your log in.'
                        )
                    );
            } else {
                console.log('antras');
                const requiredInputKeys = ['title', 'body', 'authorId'];
                const invalidInputs = testInputIntegrity(
                    receivedQuestion,
                    requiredInputKeys
                );
                if (invalidInputs) {
                    return res
                        .status(422)
                        .send(
                            createJsonResponse(
                                'fail',
                                `Bad or missing inputs for: ${invalidInputs}.`
                            )
                        );
                }

                const newQuestion = new Question(receivedQuestion);
                Question.submitNew(
                    token,
                    userId,
                    newQuestion,
                    (err, result) => {
                        if (err) {
                            res.status(500).send(
                                createJsonResponse(
                                    'fail',
                                    'Question submission was unsuccessful',
                                    reportError('QN', err)
                                )
                            );
                        } else {
                            res.status(201).send(result);
                        }
                    }
                );
            }
        });
    } catch (error) {
        return res
            .status(500)
            .send(
                createJsonResponse(
                    'fail',
                    'Internal Server Error',
                    reportError('QNX', error)
                )
            );
    }
};

// Retrieve all questions from the database (with condition).
exports.getAll = (req, res) => {
    try {
        const condition = req.body.condition || '';
        Question.getAll(condition, (err, result) => {
            if (err) {
                res.status(500).send(
                    createJsonResponse(
                        'fail',
                        'Some error occurred while retrieving questions.',
                        reportError('QA', err)
                    )
                );
            } else {
                if (result === 0)
                    return res
                        .status(404)
                        .send(
                            createJsonResponse(
                                'fail',
                                'Questions DB is emty. Be the first to ask!'
                            )
                        );
                res.status(200).send(result);
            }
        });
    } catch (error) {
        return res
            .status(500)
            .send(
                createJsonResponse(
                    'fail',
                    'Error during data fetching',
                    reportError('QAX', err)
                )
            );
    }
};

// Update a question identified by the id in the request
exports.update = (req, res) => {
    try {
        if (!req.body) {
            res.status(400).send({
                success: false,
                message: 'Please provide inputs for the update!',
            });
        }

        const id = req.params.id;
        Question.updateById(id, new Question(req.body), (err, result) => {
            if (err) {
                if (err.kind === 'not_found') {
                    res.status(404).send({
                        success: false,
                        message: `Question with id ${id} was not found.`,
                    });
                } else {
                    res.status(500).send({
                        success: false,
                        message:
                            err.message ||
                            'Error updating question with id ' + id,
                    });
                }
            } else res.status(200).send(result);
        });
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
                if (err.kind === 'not_found') {
                    res.status(404).send({
                        message: `Question with id ${id} was not found.`,
                    });
                } else {
                    res.status(500).send({
                        message:
                            err.message ||
                            'Could not delete Question with id ' + id,
                    });
                }
            } else
                res.status(200).send({
                    message: `Question was deleted successfully!`,
                });
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
                if (err.kind === 'not_found') {
                    res.status(404).send({
                        message: `Question with id ${id} was not found.`,
                    });
                } else {
                    res.status(500).send({
                        message:
                            err.message ||
                            'Could not count answers for Question with id ' +
                                id,
                    });
                }
            } else res.status(200).send(result);
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send(error);
    }
};
