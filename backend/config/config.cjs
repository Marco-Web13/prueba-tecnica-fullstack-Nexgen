require('dotenv').config();

module.exports = {
    development: {
        url: process.env.DATABASE_URL,
        dialect: process.env.DB_DIALECT || "postgres"
    },
    production: {
        url: process.env.DATABASE_URL,
        dialect: process.env.DB_DIALECT || "postgres"
    }
};