const axios = require('axios');
const User = require('../../models/user');
const { KAKAO_LOGOUT_URL } = require('../../src/constants/kakaoLogoutUrl');

module.exports = {
    kakao: async (token) => {
        const url = KAKAO_LOGOUT_URL;
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        try {
            await axios({
                method: 'POST',
                url,
                headers,
            }).then(
                User.update(
                    { accessToken: null },
                    { where: { accessToken: token } }
                )
            );
        } catch (err) {
            console.error(err);
        }
    },
    google: async (token) => {
        try {
            User.update(
                { accessToken: null },
                { where: { accessToken: token } }
            );
        } catch (err) {
            console.error(err);
        }
    },
};
