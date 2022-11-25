const express = require('express');
const passport = require('passport');
const jwt = require('../../../modules/jwt');
const { JWT } = require('../../constants/token');
const router = express.Router();

router.get(
    '/',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        accessType: 'offline',
        prompt: 'consent',
    })
);
router.get(
    '/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/' }),
    async (req, res) => {
        const jwtToken = await jwt.issue(req.user);
        res.cookie(JWT, jwtToken, {
            domain: '.paas-ta.org',
            httpOnly: true,
            secure: true,
        }).redirect('/');
    }
);
module.exports = router;
