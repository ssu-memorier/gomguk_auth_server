const jwt = require('../../../modules/jwt');
const {
    TOKEN_EXPIRED,
    TOKEN_INVALID,
    TOKEN_VERIFIED,
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
                res.status(401).json({
                    code: 401,
                    msg: 'REFRESH_LOGIN',
                });
                break;
            case TOKEN_INVALID:
                res.status(401).json({
                    code: 401,
                    msg: 'INVALID_TOKEN',
                });
        }
    } catch (err) {
        console.error(err);
    }
};
