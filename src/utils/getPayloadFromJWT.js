const { jwt } = require('../../modules/jwt');

const getPayloadFromJWT = async (req) => {
    const payload = await jwt.getPayload(req.cookies.jwt.token);
    return payload;
};

module.exports = getPayloadFromJWT;
