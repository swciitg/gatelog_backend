import { NotAuthorizedError } from "../errors/notAuthorizedError.js";

export default (req, res, next) => {
    if (req.headers["khokha-security-key"] !== process.env.KHOKHA_SECURITY_KEY) {
        return next(new NotAuthorizedError("Unauthorized Request"));
    }
    next();
};
