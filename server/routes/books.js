import express from "express";
import books from "../controllers/Books.js";

const booksRouter = express.Router();

booksRouter.post("/", books.Create);
booksRouter.get("/", books.getAll);
booksRouter.get("/:id", books.getById);
//booksRouter.get("/:book_name", books.getByName);
booksRouter.put("/:id", books.update);
booksRouter.delete("/:id", books.delete);

export default booksRouter;