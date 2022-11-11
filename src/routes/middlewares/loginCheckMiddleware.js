const jwt = require('../../../modules/jwt');
const {
    TOKEN_EXPIRED,
    TOKEN_INVALID,
    TOKEN_VERIFIED,
} = require('../../constants/tokenVerifyState');

exports.isLoggedIn = async (req, res, next) => {
    const jwtToken = req.cookies.jwt.token;

    const isValidToken = await jwt.verify(jwtToken);
    if (isValidToken[0] === TOKEN_VERIFIED) {
        next();
    } else {
        if (isValidToken[0] === TOKEN_EXPIRED)
            res.status(401).send('expired token');
        else if (isValidToken[0] === TOKEN_INVALID)
            res.status(401).send('invalid token');
    }
};
