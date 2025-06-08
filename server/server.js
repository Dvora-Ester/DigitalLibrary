// import promisePool from './db.js'; // ודא שהסיומת .js קיימת אם אתה ב־ESM

// try {
//   const [rows] = await promisePool.query('SELECT * FROM users');
//   console.log('✅ DB Connected! Result:',rows); // אמור להדפיס: 2
// } catch (err) {
//   console.error('❌ DB connection failed:', err.message,"rows",rows);
// }
// Imports and initial loading
import express from 'express';
import cors from 'cors';
import './db.js'


// Routers
import userRouter from "./routes/user.js";
import booksRouter from './routes/books.js';
import ordersRouter from "./routes/orders.js";
// Create Express app
const app = express();

// Middlewares
app.use(cors());

app.use(express.json());
console.log("ggggggg")
// Routes
app.use("/api/users", userRouter);
app.use("/api/books", booksRouter);
//app.use("/api/books", Library_Of_UserRouter);
app.use("/api/orders", ordersRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
console.log('Current working directory:', process.cwd());