const jwt = require('jsonwebtoken');
const {
    TOKEN_EXPIRED,
    TOKEN_INVALID,
} = require('../src/constants/tokenErrorType');

module.exports = {
    issue: async (user) => {
        const payload = {
            email: user.email,
            provider: user.provider,
        };
        const result = {
            token: jwt.sign(payload, process.env.JWT_SECRET),
            refreshToken: user.refreshToken,
        };
        return result;
    },
    verify: async (token) => {
        let decoded = '';
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.message === 'jwt expired') {
                return TOKEN_EXPIRED;
            } else {
                return TOKEN_INVALID;
            }
        }
        return decoded;
    },
};
