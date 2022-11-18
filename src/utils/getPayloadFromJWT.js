const { jwt } = require('../../modules/jwt');

const getPayloadFromJWT = async (jwtToken) => {
    const payload = await jwt.getPayload(jwtToken);
    return payload;
};

module.exports = getPayloadFromJWT;
