require('dotenv').config();

const { DATABASE_URL, NODE_ENV } = process.env;

module.exports = {
  development: {
    url: DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      // IMPORTANT: SSL OFF for Docker/local Postgres
      ssl: false,
    },
  },

  production: {
    url: DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      // SSL ON for Neon / cloud Postgres
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};