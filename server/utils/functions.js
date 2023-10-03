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

function reportError(location, errorInfo) {
    const errorRef = `ErrorRef: ${location}${new Date().getTime()}`;
    console.error(errorRef, errorInfo);
    return errorRef;
}

function randomMaxInt(maxNumber) {
    return 1 + Math.floor(Math.random() * maxNumber);
}

function randomMaxFloat(maxNumber) {
    return Number((Math.random() * maxNumber).toFixed(2));
}

function createNewToken(jwt, username) {
    const jwtKey = process.env.JWT_KEY;
    const jwtExpirySeconds = process.env.JWT_EXPIRY_SECONDS;

    const token = jwt.sign({ username }, jwtKey, {
        algorithm: 'HS256',
        expiresIn: jwtExpirySeconds,
    });
    return token;
}

module.exports = {
    testInputIntegrity,
    createJsonMessage,
    createJsonResponse,
    reportError,
    randomMaxInt,
    randomMaxFloat,
    createNewToken,
};
