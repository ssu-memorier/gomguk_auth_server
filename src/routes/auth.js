const express = require('express');
const passport = require('passport');
const jwt = require('../../modules/jwt');
const logoutModules = require('../../modules/oauth/logout');
const { isLoggedIn } = require('../routes/middlewares/loginCheckMiddleware');

const router = express.Router();

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
router.get('/kakao/logout', isLoggedIn, async (req, res) => {
    const jwtPayload = await getPayload(req);
    logoutModules.kakao(jwtPayload.accessToken);
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
router.get('/google/logout', isLoggedIn, async (req, res) => {
    const jwtPayload = await getPayload(req);
    logoutModules.google(jwtPayload.accessToken);
    res.cookie('jwt', null, { maxAge: 0 });
    req.logout(() => {
        res.redirect('/');
    });
});

const getPayload = async (req) => {
    const [_, payload] = await jwt.verify(req.cookies.jwt.token);
    return payload;
};

module.exports = router;
