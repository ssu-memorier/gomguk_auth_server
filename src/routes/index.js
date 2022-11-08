const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("main", { title: "홈" });
});

module.exports = router;
