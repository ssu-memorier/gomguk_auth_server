const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user");

module.exports = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const {
          _json: { sub, name, email },
        } = profile;
        try {
          const exUser = await User.findOne({
            where: { snsId: sub, provider: "google" },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.create({
              email: email,
              name: name,
              snsId: sub,
              provider: "google",
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
