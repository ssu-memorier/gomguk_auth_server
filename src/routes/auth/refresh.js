const express = require('express');

const User = require('../../../models/user');
const getNewTokenFromKakao = require('../../utils/getNewTokenFromKakao');
const issueNewJWT = require('../../utils/issueNewJWT');
const { JWT } = require('../../constants/token');

const router = express.Router();

router.get('/', async (req, res) => {
    const extractTokenReg = new RegExp(/^Bearer\s+/);
    const reqAccessToken = req.headers['authorization'].replace(
        extractTokenReg,
        ''
    );
    const user = await User.findOne({
        where: { accessToken: reqAccessToken },
    });
    const refreshToken = user.refreshToken;
    const newTokenData = await getNewTokenFromKakao(refreshToken);
    const [newAT, newRT] = [
        newTokenData.access_token,
        newTokenData.refresh_token,
    ];

    try {
        await user.update({ accessToken: newAT, refreshToken: newRT });
        const newJWT = await issueNewJWT(user);
        res.cookie(JWT, null, { maxAge: 0 });
        res.cookie(JWT, newJWT, {
            httpOnly: true,
            secure: true,
        });
        res.status(200).json({
            code: 200,
            msg: 'token refresh success',
        });
    } catch (err) {
        res.status(500).json({
            code: 500,
            msg: 'token refresh failed',
        });
    }
});

module.exports = router;
