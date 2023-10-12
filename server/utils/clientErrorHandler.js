class ClientError extends Error {
    constructor(statusCode, message) {
        console.log('clientError method activated: ');
        console.log('parameters for constructor function: ');
        console.log(statusCode, message);
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = ClientError;
