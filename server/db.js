import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();


const pool = mysql.createPool({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


const promisePool = pool.promise();


promisePool.query('SELECT 1')
  .then(() => console.log('✅ Connected to the database.'))
  .catch(err => console.error('❌ Database connection failed:', err.message));

export default promisePool;
