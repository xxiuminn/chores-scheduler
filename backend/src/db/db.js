const { Pool } = require("pg");

const pool = new Pool({
  user: "db_user",
  password: "user123",
  host: "localhost",
  port: process.env.PORT,
  database: "choretrackr",
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
