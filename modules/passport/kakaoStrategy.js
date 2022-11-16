const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const {
    KAKAO_CALLBACK_URL,
} = require('../../src/constants/passportCallbackUrl');

const User = require('../../models/user');

module.exports = () => {
    passport.use(
        new KakaoStrategy(
            {
                clientID: process.env.KAKAO_ID,
                callbackURL: KAKAO_CALLBACK_URL,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let exUser = await User.findOne({
                        where: {
                            snsId: profile.id,
                            provider: 'kakao',
                        },
                    });
                    if (exUser) {
                        await User.update(
                            { accessToken: accessToken },
                            { where: { snsId: profile.id } }
                        );
                        exUser = await User.findOne({
                            where: {
                                snsId: profile.id,
                                provider: 'kakao',
                            },
                        });
                        done(null, exUser);
                    } else {
                        const newUser = await User.create({
                            email: profile._json.kakao_account.email,
                            name: profile.displayName,
                            snsId: profile.id,
                            provider: 'kakao',
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                        });
                        done(null, newUser);
                    }
                } catch (err) {
                    console.error(err);
                    done(err);
                }
            }
        )
    );
};
