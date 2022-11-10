const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const { kakaoCallbackUrl } = require('../src/constants/passportCallbackUrl');

const User = require('../models/user');

module.exports = () => {
    console.log(kakaoCallbackUrl);
    passport.use(
        new KakaoStrategy(
            {
                clientID: process.env.KAKAO_ID,
                callbackURL: kakaoCallbackUrl,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const exUser = await User.findOne({
                        where: { snsId: profile.id, provider: 'kakao' },
                    });
                    if (exUser) {
                        done(null, exUser);
                    } else {
                        const newUser = await User.create({
                            email: profile._json.kakao_account.email,
                            name: profile.displayName,
                            snsId: profile.id,
                            provider: 'kakao',
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
