const jwt = require('../../../modules/jwt');
const {
    TOKEN_EXPIRED,
    TOKEN_INVALID,
    TOKEN_VERIFIED,
} = require('../../constants/tokenVerifyState');
const { ONE_HOUR } = require('../../constants/tokenTime');

const checkExpired = async (res, payload) => {
    const currentTime = Math.floor(new Date().getTime() / 1000);
    const leftTime = payload.exp - currentTime;

    if (leftTime < ONE_HOUR) {
        console.log('재발급');
        res.cookie('jwt', null, { maxAge: 0 });
        const newJwtToken = await jwt.issue(payload);
        res.cookie('jwt', newJwtToken, {
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
        if (verifyState === TOKEN_VERIFIED) {
            const payload = await jwt.getPayload(jwtToken);
            await checkExpired(res, payload);
            next();
        } else {
            if (verifyState === TOKEN_EXPIRED) {
                res.cookie('jwt', null, { maxAge: 0 });
                req.logout(() => {
                    res.redirect('/');
                });
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
