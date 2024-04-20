import {RequestValidationError} from '../errors/requestValidationError.js';
import {GuestAccessError} from '../errors/guestAccessError.js';
import {getOnestopUser} from './onestopUserHelper.js';
import {guestOutlookEmail} from '../shared/constants.js';

export const verifyAuthentication = async (req) => {
    const res = await getOnestopUser(req.headers.authorization, req.headers["security-key"]);
    const onestopUser = res.user;
    if (onestopUser !== undefined && !onestopUser.blocked) {
        // TODO: Test Guest Access
        if (onestopUser.outlookEmail === guestOutlookEmail) {
            throw new GuestAccessError("Guest User not allowed");
        }
        return true;
    } else throw new RequestValidationError("Invalid User ID found");
}