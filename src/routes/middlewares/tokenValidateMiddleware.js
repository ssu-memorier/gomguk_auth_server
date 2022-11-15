const jwt = require('../../../modules/jwt');
const {
    TOKEN_EXPIRED,
    TOKEN_INVALID,
    TOKEN_VERIFIED,
} = require('../../constants/tokenVerifyState');

exports.isTokenValid = async (req, res, next) => {
    const jwtToken = req.cookies.jwt.token;
    try {
        const verifyState = await jwt.verify(jwtToken);
        if (verifyState === TOKEN_VERIFIED) {
            next();
        } else {
            if (verifyState === TOKEN_EXPIRED) {
                //jwt 재발급
                res.cookie('jwt', null, { maxAge: 0 });
                const newJwtToken = await jwt.issue(payload);
                res.cookie('jwt', newJwtToken, {
                    httpOnly: true,
                    secure: true,
                });
                next();
            } else if (verifyState === TOKEN_INVALID)
                res.status(401).json({
                    code: 401,
                    msg: 'unauthorized',
                });
        }
    } catch (err) {
        console.log(err);
    }
};
