import pkg from "pg";
import dotenv from "dotenv";

dotenv.config(); // <-- This loads your .env before connecting

const { Pool } = pkg;

console.log("Using DATABASE_URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
