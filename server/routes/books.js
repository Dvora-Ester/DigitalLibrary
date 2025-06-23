import express from "express";
import books from "../controllers/Books.js";
import { isAdmin, verifyToken } from "../middleware/outh.js";
import upload from "../middleware/books_storage.js";
const booksRouter = express.Router();



booksRouter.post("/addBook",verifyToken, isAdmin,upload.single('bookFile'),books.add);

booksRouter.get("/getAllBooksByUserId",verifyToken, books.getAll);
booksRouter.get("/:bookId",verifyToken ,books.getById);
//booksRouter.get("/:book_name", books.getByName);
booksRouter.put("/updateOrder/:bookId",verifyToken ,books.update);
booksRouter.delete("/:bookId",verifyToken,books.delete);

export default booksRouter;