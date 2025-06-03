import dotenv from 'dotenv';
dotenv.config({ path: path.resolve('./server/.env') });

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
