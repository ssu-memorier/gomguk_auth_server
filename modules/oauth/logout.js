const axios = require('axios');
const User = require('../../models/user');

module.exports = {
    kakao: async (user) => {
        const url = 'https://kapi.kakao.com/v1/user/logout';
        const headers = {
            Authorization: `Bearer ${user.accessToken}`,
        };
        try {
            await axios({
                method: 'POST',
                url,
                headers,
            });
            User.update(
                { accessToken: null },
                { where: { snsId: user.dataValues.snsId } }
            );
        } catch (err) {
            console.error(err);
        }
    },
    google: async (user) => {
        try {
            User.update(
                { accessToken: null },
                { where: { snsId: user.dataValues.snsId } }
            );
        } catch (err) {
            console.error(err.response);
        }
    },
};
