const express = require("express");
const User = require("../../models/user");

const router = express.Router();

router.get(
  "/",
  async (req, res, next) => {
    const user = await User.findAll();
    console.log(user);

    req.data = user;
    next(req.data);
  },
  (req, res) => {
    res.send(req.data);
  }
);

module.exports = router;
