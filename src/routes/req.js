const express = require('express');
const { isTokenValid } = require('./middlewares/tokenValidateMiddleware');

const router = express.Router();

router.get('/', isTokenValid, (req, res) => {
    res.send('로그인 상태입니다.'); //유저 요청 전송할 부분
});

module.exports = router;
