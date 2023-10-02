const User = require('../models/user.model.js');
const {
    testInputIntegrity,
    createJsonMessage,
    randomMaxInt,
    randomMaxFloat,
} = require('../utils/functions.js');

// Register a new User
exports.signUp = (req, res) => {
    try {
        let receivedUserInputs = req.body;

        //comment-uncomment this section for dummy entries
        // receivedUserInputs = {
        //     userName: req.body.userName         ||      `userName ${randomMaxInt(9)}`,
        //     name: req.body.name                 ||      `Name ${randomMaxInt(9)}`,
        //     password: req.body.password         ||      `password ${randomMaxInt(9)}`,
        //     email: req.body.email               ||      `mail${randomMaxInt(100)}@mail.com`,
        //     avatarId: req.body.avatarId         ||      0
        // }
        // end of dummy values

        // input validation
        const requiredInputKeys = [
            'userName',
            'name',
            'password',
            'email',
            // 'avatarId'
        ];
        const invalidInputs = testInputIntegrity(
            receivedUserInputs,
            requiredInputKeys
        );
        if (invalidInputs) {
            const response = createJsonMessage(
                `Bad inputs for: ${invalidInputs}.`
            );
            return res.status(422).send(response);
        }

        const newUser = new User(receivedUserInputs);

        User.signUp(newUser, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({
                    message: err.message || 'User registration has failed.',
                });
            } else {
                console.log(result);
                res.status(201).send(result);
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
};

// Provide credentials for user session
exports.login = (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        User.login(username, password, (err, result) => {
            if (err) {
                if (err.kind === 'not_found') {
                    res.status(404).send({
                        message: `User was not found`,
                    });
                } else {
                    res.status(500).send({
                        message: err.message || 'Error during authentification',
                    });
                }
            } else res.status(201).send(result);
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send(error);
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
