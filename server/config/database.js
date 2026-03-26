const { Pool } = require('pg');
require('dotenv').config();

const ssl =
  process.env.DB_SSL === 'true'
    ? { rejectUnauthorized: false }
    : false;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl
});


pool.on('error', (err) => {
  console.error('[v0] Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
