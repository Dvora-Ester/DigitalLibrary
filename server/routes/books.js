import express from "express";
import books from "../controllers/Books.js";
import { isAdmin, verifyToken } from "../middleware/outh.js";
import uploadBoth from "../middleware/books.js"; // Assuming this is the combined middleware for both PDF and image uploads
const booksRouter = express.Router();


booksRouter.post("/addBook",verifyToken,isAdmin,uploadBoth.fields([
    { name: "bookFile", maxCount: 1 },
    { name: "bookImage", maxCount: 1 }
  ]),
  books.add
);
booksRouter.get("/search/:filterBy/:value",verifyToken,books.filterBy)
booksRouter.get("/getByStatus/:Status",verifyToken, books.getByStatus);
booksRouter.get("/getAll",verifyToken, books.getAll);
booksRouter.get("/:bookId",verifyToken ,books.getById);
booksRouter.get("/getByStatusAndUserId/:Status",verifyToken ,books.getByStatusAndUserId);
booksRouter.put("/updateBook/:bookId",verifyToken ,books.update);
booksRouter.delete("/:bookId",verifyToken,books.delete);

export default booksRouter;