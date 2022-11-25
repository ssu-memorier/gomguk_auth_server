const axios = require('axios');
const { GOOGLE_REFRESH_URL } = require('../constants/googleUrl');
const { KAKAO_REFRESH_URL } = require('../constants/kakaoUrl');

const getNewTokenFromKakao = async (refreshToken) => {
    const url = KAKAO_REFRESH_URL;
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const data = new URLSearchParams();
    data.append('grant_type', 'refresh_token');
    data.append('client_id', process.env.KAKAO_ADMIN_KEY);
    data.append('refresh_token', refreshToken);

    const response = await axios({
        method: 'POST',
        url,
        headers,
        data,
    });
    return response.data;
};

const getNewTokenFromGoogle = async (refreshToken) => {
    const url = GOOGLE_REFRESH_URL;
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const data = new URLSearchParams();
    data.append('client_id', process.env.GOOGLE_ID);
    data.append('client_secret', process.env.GOOGLE_SECRET);
    data.append('grant_type', 'refresh_token');
    data.append('refresh_token', refreshToken);

    const response = await axios({
        method: 'POST',
        url,
        headers,
        data,
    });
    return response.data;
};

module.exports = { getNewTokenFromKakao, getNewTokenFromGoogle };
