const User = require('../models/user.model.js');
const { createToken, verifyToken } = require('../utils/functions.js');
// const jwt = require('jsonwebtoken');

const {
    // testInputIntegrity,
    createJsonResponse,
    reportError,
    errorNotice,
} = require('../utils/functions.js');
const ClientError = require('../utils/clientErrorHandler.js');
const ServerError = require('../utils/serverErrorHandler.js');

// Register a new User
exports.signUp = async (req, res) => {
    try {
        const { userName, name, email, password } = req.body;
        if (!(userName && name && email && password)) {
            throw new ClientError(400, 'Required inputs are missing');
        }

        const newUser = new User(req.body);
        const usernameConflict = await User.isUsernameRegistered(userName);

        if (usernameConflict) {
            throw new ClientError(409, 'Username is already used');
        }
        newUser.signUp(async (signUpResult) => {
            if (signUpResult instanceof Error) {
                res.status(signUpResult.statusCode || 500).send(
                    errorNotice(signUpResult)
                );
            } else {
                res.status(201).send(signUpResult);
            }
        });
    } catch (error) {
        return res.status(error.statusCode || 500).send(errorNotice(error));
    }
};

// Provide credentials for user session
exports.login = (req, res) => {
    try {
        const { username, password } = req.body;
        if (!(username && password)) {
            throw new ClientError(400, 'Provide username and password');
        }

        User.login(username, password, (loginResult) => {
            if (loginResult instanceof Error) {
                res.status(loginResult.statusCode || 500).send(
                    errorNotice(loginResult)
                );
            } else {
                res.status(200).send(loginResult);
            }
        });
    } catch (error) {
        return res.status(error.statusCode || 500).send(errorNotice(error));
    }
};

// Get all user details
exports.getDetails = async (req, res) => {
    try {
        const { token } = req.headers;
        const payload = await verifyToken(token);

        if (payload instanceof Error) {
            res.status(payload.statusCode || 500).send(errorNotice(payload));
            return;
        }

        User.getDetails(payload.userId, async (getDetailsResult) => {
            if (getDetailsResult instanceof Error) {
                res.status(getDetailsResult.statusCode || 500).send(
                    errorNotice(getDetailsResult)
                );
                return;
            } else {
                res.status(200).send(getDetailsResult);
                return;
            }
        });
    } catch (error) {
        return res.status(error.statusCode || 500).send(errorNotice(error));
    }
};
