const jwt = require('../../../modules/jwt');
const {
    TOKEN_EXPIRED,
    TOKEN_INVALID,
    TOKEN_VERIFIED,
} = require('../../constants/tokenVerifyState');

exports.isLoggedIn = async (req, res, next) => {
    const reqCookie = req.cookies;
    const token = reqCookie.jwt.token;

    const isValidToken = await jwt.verify(token);
    if (req.isAuthenticated() && isValidToken === TOKEN_VERIFIED) {
        next();
    } else {
        if (isValidToken === TOKEN_EXPIRED)
            res.status(401).send('expired token');
        else if (isValidToken === TOKEN_INVALID)
            res.status(401).send('invalid token');
    }
};
