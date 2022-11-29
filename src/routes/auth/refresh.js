const express = require('express');

const User = require('../../../models/user');
const {
    getNewTokenFromKakao,
    getNewTokenFromGoogle,
} = require('../../utils/getNewToken');
const issueNewJWT = require('../../utils/issueNewJWT');
const { JWT } = require('../../constants/token');
const { EXTRACT_TOKEN_REG } = require('../../constants/regularExpression');

const router = express.Router();

router.get('/', async (req, res) => {
    const extractTokenReg = new RegExp(EXTRACT_TOKEN_REG);
    const reqAccessToken =
        req.headers['authorization'].match(extractTokenReg)[1];
    const user = await User.findOne({
        where: { accessToken: reqAccessToken },
    });
    const refreshToken = user.refreshToken;
    const provider = user.provider;
    if (provider === 'kakao') {
        try {
            const newTokenData = await getNewTokenFromKakao(refreshToken);
            const [newAT, newRT] = [
                newTokenData.access_token,
                newTokenData.refresh_token,
            ];
            await user.update({ accessToken: newAT, refreshToken: newRT });
        } catch (err) {
            res.status(401).json({
                code: 401,
                message: 'REFRESH_LOGIN',
            });
            return;
        }
    } else {
        try {
            const newTokenData = await getNewTokenFromGoogle(refreshToken);
            const newAT = newTokenData.access_token;
            await user.update({ accessToken: newAT });
        } catch (err) {
            res.status(401).json({
                code: 401,
                message: 'REFRESH_LOGIN',
            });
            return;
        }
    }

    const newJWT = await issueNewJWT(user);
    res.cookie(JWT, null, { domain: '.paas-ta.org', maxAge: 0 });
    res.cookie(JWT, newJWT, {
        domain: '.paas-ta.org',
        httpOnly: true,
        secure: true,
    });
    res.status(200).json({
        code: 200,
        msg: 'token refresh success',
    });
});

module.exports = router;
