const { Client } = require("pg");
require("dotenv").config();

const db = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const connectDb = async () => {
  try {
    await db.connect();
    console.log("Connected to the database");
    await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id BIGSERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE,
                password VARCHAR(100),
                role VARCHAR(50) NOT NULL
            )
        `);
    await db.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id BIGSERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                assignee_id BIGINT REFERENCES users(id),
                priority  varchar(50) NOT NULL DEFAULT 'low',
                status  varchar(50) NOT NULL DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
  } catch (err) {
    console.error("Error connecting to the database", err);
    await db.end();
  }
};

module.exports = { db, connectDb };
