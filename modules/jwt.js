const jwt = require('jsonwebtoken');
const {
    TOKEN_EXPIRED,
    TOKEN_INVALID,
    TOKEN_VERIFIED,
} = require('../src/constants/tokenVerifyState');

module.exports = {
    issue: async (user) => {
        const payload = {
            email: user.email,
            provider: user.provider,
            accessToken: user.accessToken,
        };
        const result = {
            token: jwt.sign(payload, process.env.JWT_SECRET),
        };
        return result;
    },
    verify: async (token) => {
        let payload = '';
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.message === 'jwt expired') {
                return [TOKEN_EXPIRED, _];
            } else {
                return [TOKEN_INVALID, _];
            }
        }
        return [TOKEN_VERIFIED, payload];
    },
};
