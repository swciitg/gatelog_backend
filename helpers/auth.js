const jwt = require("jsonwebtoken");
const accessjwtsecret = process.env.ACCESS_JWT_SECRET;
const { RequestValidationError } = require("../errors/requestValidationError");
const { AccessTokenError } = require("../errors/jwtAuthError");
const { GuestAccessError } = require("../errors/guestAccessError");
const { UserBlockedError } = require("../errors/userBlockedError");

exports.isValidJWT = async (req) => {
    let authorization = req.headers.authorization;
    if (!authorization) throw new RequestValidationError("Access token not passed");
    let accessToken = authorization.split(' ').slice(-1)[0];
    if (!accessToken) throw new RequestValidationError("Access token not passed");
    let decoded;
    jwt.verify(accessToken, accessjwtsecret, (err, dec) => {
        if (err) {
            throw new AccessTokenError(err.message);
        }
        decoded = dec;
    });
    console.log(decoded);

    // TODO: Add Token Auth
    // let onestopUser = await onestopUserModel.findById(decoded.userid);
    // if (onestopUser !== undefined && !onestopUser.blocked) {
    //     console.log(decoded);
    //     req.userid = decoded.userid;
    //     console.log(req.userid);
    //     console.log("Token Verified");
    //     return true;
    // }
    // else if (onestopUser !== undefined && onestopUser.blocked) {
    //     throw new UserBlockedError("User has been blocked due to spamming");
    // }
    // else throw new RequestValidationError("Invalid User ID found");
}

exports.isGuestUser = async (req) => {
    return false;
    // since, verify user request will be checked before this so, token would always be present
    // let accessToken = req.headers.authorization.split(' ').slice(-1)[0];
    // let decoded;
    // jwt.verify(accessToken, accessjwtsecret,(err,dec) => {
    //     if(err){
    //         throw new AccessTokenError(err.message);
    //     }
    //     decoded=dec;
    // });
    // if(decoded.userid === await getGuestUserID()){
    //     console.log("Guest User not allowed");
    //     throw new GuestAccessError("Guest Access not allowed");
    // }
    // else return false;
}