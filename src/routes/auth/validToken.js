const express = require('express');
const { isTokenValid } = require('../middlewares/tokenValidateMiddleware');
const router = express.Router();

router.get('/', isTokenValid);

module.exports = router;
