import express from 'express';
import cors from 'cors';
import './db.js'


// Routers
import userRouter from "./routes/user.js";
import booksRouter from './routes/books.js';
import ordersRouter from "./routes/orders.js";
import libraryRouter from './routes/library.js';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import commentsRouter from './routes/comments.js';
import webhookRouter from './routes/webhookRouter.js';
import dotenv from 'dotenv';
dotenv.config();


// Create Express app
const app = express();


// Middlewares
app.use(cors());
app.use('/api/webhook', webhookRouter);
app.use(express.json());


// Routes
app.use('/book-Pages', express.static(path.join(process.cwd(), 'book-Pages')));
app.use('/book-images', express.static(path.join(process.cwd(), 'pictures_of_books')));
app.use("/api/users", userRouter);
app.use("/api/books", booksRouter);
app.use("/api/library", libraryRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/comments", commentsRouter);
app.use('/api/book-Pages', express.static(path.join(process.cwd(), 'book-Pages')));
console.log("📂 Serving book pages from:", path.join(process.cwd(), 'book-Pages'));
app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});
app.use((err, req, res, next) => {
  console.error("MULTER ERROR:", err);
  res.status(400).json({ err: err.message });
});




// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
console.log('Current working directory:', process.cwd());