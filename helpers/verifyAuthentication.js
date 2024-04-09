const { RequestValidationError } = require("../errors/requestValidationError");
const { GuestAccessError } = require("../errors/guestAccessError");
const { getOnestopUser } = require("./onestopUserHelper");
const { guestOutlookEmail } = require("../shared/constants");

exports.verifyAuthentication = async (req) => {
    const res = await getOnestopUser(req.headers.authorization, req.headers["security-key"]);
    const onestopUser = res.user;
    if (onestopUser !== undefined && !onestopUser.blocked) {
        // TODO: Test Guest Access
        if(onestopUser.outlookEmail === guestOutlookEmail){
            throw new GuestAccessError("Guest User not allowed");
        }
        return true;
    }
    else throw new RequestValidationError("Invalid User ID found");
}