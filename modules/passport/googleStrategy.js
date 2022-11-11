const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../../models/user');
const {
    GOOGLE_CALLBACK_URL,
} = require('../../src/constants/passportCallbackUrl');

module.exports = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_ID,
                clientSecret: process.env.GOOGLE_SECRET,
                callbackURL: GOOGLE_CALLBACK_URL,
            },
            async (accessToken, refreshToken, profile, done) => {
                const {
                    _json: { sub, name, email },
                } = profile;
                try {
                    const exUser = await User.findOne({
                        where: { snsId: sub, provider: 'google' },
                    });
                    if (exUser && exUser.accessToken !== null) {
                        done(null, exUser);
                    } else if (exUser && exUser.accessToken === null) {
                        await User.update(
                            { accessToken: accessToken },
                            { where: { snsId: sub } }
                        );
                        done(null, exUser);
                    } else {
                        const newUser = await User.create({
                            email: email,
                            name: name,
                            snsId: sub,
                            provider: 'google',
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                        });
                        done(null, newUser);
                    }
                } catch (error) {
                    console.error(error);
                    done(error);
                }
            }
        )
    );
};
