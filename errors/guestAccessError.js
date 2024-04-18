// const { CustomError } = require("./customError");
import { CustomError } from "./customError.js";

export class GuestAccessError extends CustomError{
    constructor(message){
        super(message,403,"Guest Access Error");
    }
}