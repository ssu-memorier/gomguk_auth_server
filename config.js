require('dotenv').config();
const env = process.env;
const production = {
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: 'mariadb',
};

module.exports = production;
