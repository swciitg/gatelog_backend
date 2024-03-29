const { NotAuthorizedError } = require("../errors/notAuthorizedError");

module.exports = (req, res, next) => {
    if (req.headers["khokha-security-key"] !== process.env.KHOKHA_SECURITY_KEY) {
        next(new NotAuthorizedError("Unauthorized Request"));
    }
    next();
}