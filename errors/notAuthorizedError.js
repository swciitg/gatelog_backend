const { CustomError } = require("./customError");


exports.NotAuthorizedError = class NotAuthorizedError extends CustomError{
    constructor(message){
        super(message, 403, 'Forbidden');
    }
}