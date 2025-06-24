import express from "express";
import books from "../controllers/Books.js";
import { isAdmin, verifyToken } from "../middleware/outh.js";
//import upload from "../middleware/books_storage.js";
// import uploadPdf from "../middleware/books_storage.js";
// import uploadImage from "../middleware/pictures_of_books.js";
import uploadBoth from "../middleware/books.js"; // Assuming this is the combined middleware for both PDF and image uploads
const booksRouter = express.Router();



//booksRouter.post("/addBook",verifyToken, isAdmin,upload.single('bookFile'),books.add);
// booksRouter.post("/addBook",verifyToken,isAdmin,uploadPdf.single("bookFile"),  uploadImage.single("bookImage"),books.add);


booksRouter.post("/addBook",verifyToken,isAdmin,uploadBoth.fields([
    { name: "bookFile", maxCount: 1 },
    { name: "bookImage", maxCount: 1 }
  ]),
  books.add
);


booksRouter.get("/getAll",verifyToken, books.getAll);
booksRouter.get("/:bookId",verifyToken ,books.getById);
//booksRouter.get("/:book_name", books.getByName);
booksRouter.put("/updateOrder/:bookId",verifyToken ,books.update);
booksRouter.delete("/:bookId",verifyToken,books.delete);

export default booksRouter;