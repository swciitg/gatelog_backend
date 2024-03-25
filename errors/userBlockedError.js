const { CustomError } = require("./customError");

exports.UserBlockedError = class UserBlockedError extends CustomError{
    constructor(message){
        super(message,418,"Blocked user request error");
    }
}