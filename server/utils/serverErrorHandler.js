class ServerError extends Error {
    constructor(statusCode, message, fullErrorData, location) {
        console.log('serverError method activated: ');
        console.log('paramters for constructor function: ');
        console.log(statusCode, message, fullErrorData, location);
        super(message);
        this.statusCode = statusCode;
        if (fullErrorData) {
            const errorRef = `ErrorRef: ${
                location || 'X'
            }${new Date().getTime()}`;
            console.error(errorRef, fullErrorData);
            this.reference = errorRef;
        }
    }
}

module.exports = ServerError;
