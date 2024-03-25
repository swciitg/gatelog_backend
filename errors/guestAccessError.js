const { CustomError } = require("./customError");

exports.GuestAccessError = class GuestAccessError extends CustomError{
    constructor(message){
        super(message,403,"Guest Access Error");
    }
}