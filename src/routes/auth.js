const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get("/kakao", passport.authenticate("kakao"));
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", { failureRedirect: "/" }),
  (req, res) => {
    try {
      res.redirect("/");
    } catch (err) {
      console.error(err);
    }
  }
);
router.get("/kakao/logout", (req, res) => {
  req.session.destroy();
  req.logout(() => {
    res.redirect("/");
  });
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);
router.get("/google/logout", (req, res) => {
  req.session.destroy();
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;
