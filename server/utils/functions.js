function testInputIntegrity (receivedInputs, requiredInputKeys) {
    if (Object.entries(receivedInputs).length > requiredInputKeys.length) {
        return "Too much input entries";
    }
    const missingInputKeys = [];
    requiredInputKeys.forEach( key => {
        if ( key in receivedInputs ) return
        else missingInputKeys.push(key);
    });
    if (missingInputKeys.length) return missingInputKeys.join(", ");    
    return null;
};

function createJsonMessage (messageText) {
    return { "Server message" : messageText };
};

function randomMaxInt (maxNumber) {
    return (1+Math.floor(Math.random() * maxNumber));
};

function randomMaxFloat (maxNumber) {
    return (Number((Math.random() * maxNumber).toFixed(2)));
};

module.exports = { testInputIntegrity, createJsonMessage, randomMaxInt, randomMaxFloat };