const { jwt } = require('../../modules/jwt');

const getPayloadFromJWT = async (token) => {
    const payload = await jwt.getPayload(token);
    return payload;
};

module.exports = getPayloadFromJWT;
