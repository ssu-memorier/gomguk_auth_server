const express = require('express');
const passport = require('passport');
const jwt = require('../../modules/jwt');
const logoutModules = require('../../modules/oauth/logout');

const router = express.Router();

router.get('/kakao', passport.authenticate('kakao', { session: false }));
router.get(
    '/kakao/callback',
    passport.authenticate('kakao', { failureRedirect: '/' }),
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
router.get('/kakao/logout', (req, res) => {
    logoutModules.kakao(req.user);
    res.cookie('jwt', null, { maxAge: 0 });
    req.logout(() => {
        res.redirect('/');
    });
});

router.get(
    '/google',
    passport.authenticate('google', {
        session: false,
        scope: ['profile', 'email'],
        accessType: 'offline',
        prompt: 'consent',
    })
);
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    async (req, res) => {
        const jwtToken = await jwt.issue(req.user);
        res.cookie('jwt', jwtToken, {
            httpOnly: true,
            secure: true,
        }).redirect('/');
    }
);
router.get('/google/logout', (req, res) => {
    logoutModules.google(req.user);
    res.cookie('jwt', null, { maxAge: 0 });
    req.logout(() => {
        res.redirect('/');
    });
});

module.exports = router;
