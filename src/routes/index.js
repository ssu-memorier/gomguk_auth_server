const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../routes/middlewares/loginCheckMiddleware');
router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

router.get('/', isLoggedIn);

module.exports = router;
