const express = require('express');
const passport = require('passport');
const jwt = require('../../modules/jwt');
const User = require('../../models/user');
const logoutModules = require('../../modules/oauth/logout');

const router = express.Router();

router.get('/profile', async (req, res) => {
    try {
        const payload = await jwt.getPayload(req.cookies.jwt.token);
        const user = await User.findOne({
            where: {
                email: payload.email,
                provider: payload.provider,
            },
        });
        res.status(200).json({
            code: 200,
            name: user.name,
        });
    } catch (err) {
        return res.status(401).json({
            code: 401,
            msg: '401 unauthorized',
        });
    }
});

router.get('/kakao', passport.authenticate('kakao'));
router.get(
    '/kakao/callback',
    passport.authenticate('kakao', { session: false, failureRedirect: '/' }),
    async (req, res) => {
        try {
            const jwtToken = await jwt.issue(req.user);
            res.cookie('jwt', jwtToken, {
                httpOnly: true,
                secure: true,
            }).redirect('/');
        } catch (err) {
            console.error(err);
        }
    }
);

router.get('/logout', async (req, res) => {
    const jwtPayload = await getPayload(req);
    if (jwtPayload.provider === 'kakao') {
        logoutModules.kakao(jwtPayload.accessToken);
    } else {
        logoutModules.google(jwtPayload.accessToken);
    }
    res.cookie('jwt', null, { maxAge: 0 });
    req.logout(() => {
        res.redirect('/');
    });
});

router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        accessType: 'offline',
        prompt: 'consent',
    })
);
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/' }),
    async (req, res) => {
        const jwtToken = await jwt.issue(req.user);
        res.cookie('jwt', jwtToken, {
            httpOnly: true,
            secure: true,
        }).redirect('/');
    }
);

const getPayload = async (req) => {
    console.log(req.cookies.jwt.token);
    const payload = await jwt.getPayload(req.cookies.jwt.token);
    return payload;
};

module.exports = router;
