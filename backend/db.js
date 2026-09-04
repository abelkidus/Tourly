const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

pool.on("error", (err) => {
  console.error("Unexpected idle database client error:", err);
});

async function testConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Database connected successfully at:", res.rows[0].now);
    return true;
  } catch (err) {
    console.error("Database connection failed on startup:", err.message);
    return false;
  }
}

pool.testConnection = testConnection;

module.exports = pool;

