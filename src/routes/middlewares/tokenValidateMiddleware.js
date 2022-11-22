const jwt = require('../../../modules/jwt');
const {
    TOKEN_EXPIRED,
    TOKEN_INVALID,
    TOKEN_VERIFIED,
    ONE_HOUR,
    JWT,
} = require('../../constants/token');

exports.isTokenValid = async (req, res, next) => {
    try {
        const jwtToken = req.query.jwt;
        const verifyState = await jwt.verify(jwtToken);
        switch (verifyState) {
            case TOKEN_VERIFIED:
                res.status(200).json({
                    code: 200,
                    msg: 'token verified',
                });
                break;
            case TOKEN_EXPIRED:
                res.cookie(JWT, null, { maxAge: 0 });
                req.logout(() => {
                    res.redirect('/');
                });
                res.status(401).json({
                    code: 401,
                    msg: 'token expired',
                });
                break;
            case TOKEN_INVALID:
                res.status(401).json({
                    code: 401,
                    msg: 'unauthorized token',
                });
        }
    } catch (err) {
        console.error(err);
    }
};
