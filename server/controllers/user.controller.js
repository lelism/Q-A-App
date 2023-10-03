const User = require('../models/user.model.js');
const { createNewToken } = require('../utils/functions.js');
const jwt = require('jsonwebtoken');

const {
    testInputIntegrity,
    createJsonResponse,
    reportError,
} = require('../utils/functions.js');

// Register a new User
exports.signUp = (req, res) => {
    try {
        let receivedUserData = req.body;

        const requiredKeys = ['userName', 'name', 'password', 'email'];
        const invalidInputs = testInputIntegrity(
            receivedUserData,
            requiredKeys
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

        const newUser = new User(receivedUserData);

        User.signUp(newUser, (err, result) => {
            if (err) {
                res.status(500).send(
                    createJsonResponse(
                        'fail',
                        'User registration was unsuccessful',
                        reportError('US', err)
                    )
                );
            } else {
                res.status(201).send(result);
            }
        });
    } catch (error) {
        return res
            .status(500)
            .send(
                createJsonResponse(
                    'fail',
                    'Internal Server Error',
                    reportError('USX', error)
                )
            );
    }
};

// Provide credentials for user session
exports.login = (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        User.login(username, password, (err, loginResult) => {
            if (err) {
                if (err.kind === 'not_found') {
                    return res
                        .status(404)
                        .send(createJsonResponse('fail', 'User was not found'));
                } else {
                    return res
                        .status(500)
                        .send(
                            createJsonResponse(
                                'fail',
                                'Error during authentification',
                                reportError('UL', err)
                            )
                        );
                }
            } else {
                const token = createNewToken(jwt, username);
                User.updateToken(
                    username,
                    password,
                    token,
                    (err, tokenResult) => {
                        if (err || tokenResult.changedRows !== 1) {
                            return res
                                .status(500)
                                .send(
                                    createJsonResponse(
                                        'fail',
                                        'Authentification has failed'
                                    )
                                );
                        }
                        return res
                            .status(200)
                            .send(
                                createJsonResponse(
                                    'success',
                                    token,
                                    loginResult.userId
                                )
                            );
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
                    reportError('ULX', err)
                )
            );
    }
};

// Get all user details
exports.getDetails = (req, res) => {
    try {
        const userId = req.body.userId;
        const sessionKey = req.body.sessionKey;
        User.getDetails(userId, sessionKey, (err, result) => {
            if (err) {
                if (err.kind === 'not_found') {
                    res.status(404).send({
                        message: `User was not found`,
                    });
                } else {
                    res.status(500).send({
                        message: err.message || 'Error during data collection',
                    });
                }
            } else res.status(200).send(result);
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send(error);
    }
};
