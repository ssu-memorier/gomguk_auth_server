const jwt = require('../../../modules/jwt');
const {
    TOKEN_EXPIRED,
    TOKEN_INVALID,
    TOKEN_VERIFIED,
    ONE_HOUR,
    JWT,
} = require('../../constants/token');

const checkExpired = async (res, payload) => {
    const currentTime = Math.floor(new Date().getTime() / 1000);
    const leftTime = payload.exp - currentTime;

    if (leftTime < ONE_HOUR) {
        res.cookie(JWT, null, { maxAge: 0 });
        const newJwtToken = await jwt.issue(payload);
        res.cookie(JWT, newJwtToken, {
            httpOnly: true,
            secure: true,
        });
        return;
    }
    return;
};

exports.isTokenValid = async (req, res, next) => {
    try {
        const jwtToken = req.cookies.jwt.token;
        const verifyState = await jwt.verify(jwtToken);
        switch (verifyState) {
            case TOKEN_VERIFIED:
                const payload = await jwt.getPayload(jwtToken);
                await checkExpired(res, payload);
                next();
                break;
            case TOKEN_EXPIRED:
                res.cookie(JWT, null, { maxAge: 0 });
                req.logout(() => {
                    res.redirect('/');
                });
                break;
            case TOKEN_INVALID:
                res.status(401).json({
                    code: 401,
                    msg: 'unauthorized',
                });
        }
    } catch (err) {
        console.error(err);
    }
};
