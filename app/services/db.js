require('../../config');
const Knex = require('knex');

const knex = Knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DB,
    typeCast(field, next) {
      if (field.type === 'TINY') return (field.string() === '1');
      return next();
    }
  },
  pool: { min: 0, max: 7 }
});

module.exports = knex;
