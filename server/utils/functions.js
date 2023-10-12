const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ClientError = require('./clientErrorHandler');
const ServerError = require('./serverErrorHandler');
const serverConfig = process.env;

function testInputIntegrity(receivedInputs, requiredInputKeys) {
    if (Object.entries(receivedInputs).length > requiredInputKeys.length) {
        return 'Too much input entries';
    }
    const missingInputKeys = [];
    requiredInputKeys.forEach((key) => {
        if (key in receivedInputs) return;
        else missingInputKeys.push(key);
    });
    if (missingInputKeys.length) return missingInputKeys.join(', ');
    return null;
}

function createJsonMessage(messageText) {
    return { 'Server message': messageText };
}

function createJsonResponse(status, messageText, referenceNo) {
    let response = {
        status: status,
        message: messageText,
    };
    if (referenceNo) {
        response = { ...response, ...{ reference: referenceNo } };
    }
    return response;
}

// function respondWithError (code, messageText, res){
//     let status;
//     if (code>= 200 && code<300) {
//         status='success';
//     } else status = 'fail'
//     let response = {
//         status: 'fail',
//         message: messageText,
//     };
//     if (referenceNo) {
//         response = { ...response, ...{ reference: referenceNo } };
//     }
//     return response;
// }

// function reportError(location, errorData) {
//     const errorRef = `ErrorRef: ${location}${new Date().getTime()}`;
//     console.error(errorRef, errorData);
//     return errorRef;
// }

// function makeErrorReport(
//     statusCode,
//     message,
//     fullErrorData = null,
//     location = 'X'
// ) {
//     let errorReport = { statusCode, message };
//     if (fullErrorData) {
//         const errorRef = `ErrorRef: ${location}${new Date().getTime()}`;
//         console.error(errorRef, fullErrorData);
//         errorReport = { ...errorReport, reference: errorRef };
//     }
//     return errorReport;
// }

function errorNotice(errorDetails) {
    console.log('errorNotice function activated, received errorDetails object');
    console.log(errorDetails);
    // console.log()
    let errNotice = {
        status: 'fail',
        message: errorDetails.message || 'Unexpected system error',
    };
    // if (errorDetails.message) {
    //     errNotice.message = errorDetails.message;
    // } else {
    //     errNotice.message = 'Unexpected system error';
    // }
    if (errorDetails.reference) errNotice.reference = errorDetails.reference;
    console.log('content of returning errNotice');
    console.log(errNotice);
    return errNotice;
}

// todo: check necessity
function randomMaxInt(maxNumber) {
    return 1 + Math.floor(Math.random() * maxNumber);
}

// todo check necessity
function randomMaxFloat(maxNumber) {
    return Number((Math.random() * maxNumber).toFixed(2));
}

async function isPasswordValid(password, hash) {
    return await bcrypt.compare(password, hash);
}

function createToken(username, userId) {
    const jwtKey = serverConfig.JWT_KEY;
    const jwtExpiry = serverConfig.JWT_EXPIRY_SECONDS;

    const token = jwt.sign({ username, userId }, jwtKey, {
        algorithm: 'HS256',
        expiresIn: jwtExpiry,
    });
    return token;
}

async function verifyToken(token) {
    if (!token) {
        return new ClientError(401, 'Authentification failed');
    }

    try {
        const jwtKey = serverConfig.JWT_KEY;
        const decoded = await jwt.verify(token, jwtKey);
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            return new ClientError(401, 'Authentification failed');
        } else {
            return new ServerError(400, 'Bad request', error, 'FN-VT');
        }
    }
}

module.exports = {
    testInputIntegrity,
    createJsonMessage,
    createJsonResponse,
    // reportError,
    // makeErrorReport,
    errorNotice,
    randomMaxInt,
    randomMaxFloat,
    isPasswordValid,
    createToken,
    verifyToken,
};
