import {getOnestopUser} from "../helpers/onestopUserHelper.js";
import {guestUserEmail} from "../shared/constants.js";
import {GuestAccessError} from "../errors/guestAccessError.js";
import {getAuthHeaders} from "../app.js";

export const getUserInfo = async (req, res, next) => {
    try {
        const {authorization, securityKey} = getAuthHeaders(req.body.connectionId);
        const user = await getOnestopUser(authorization, securityKey);
        if (user.outlookEmail === guestUserEmail) {
            next(new GuestAccessError("Can't Access this feature in Guest Mode"));
        } else {
            req.user = user;
            next();
        }
    } catch (e) {
        next(e);
    }
}