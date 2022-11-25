const jwt = require('../../modules/jwt');

const issueNewJWT = async (user) => {
    const newJWT = await jwt.issue(user);
    return newJWT;
};

module.exports = issueNewJWT;
