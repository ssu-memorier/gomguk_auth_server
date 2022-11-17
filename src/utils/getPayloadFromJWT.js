const { jwt } = require('../../modules/jwt');

const getPayloadFromJWT = async (jwt) => {
    const payload = await jwt.getPayload(jwt);
    return payload;
};

module.exports = getPayloadFromJWT;
