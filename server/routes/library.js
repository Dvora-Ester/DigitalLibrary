
import express from "express";
import library from "../controllers/library.js";
import { verifyToken } from "../middleware/outh.js";

const libraryRouter = express.Router();

libraryRouter.get("/", library.getAll);

libraryRouter.get("/getBook/:bookId",verifyToken ,library.getByUserIdAndBookId);
libraryRouter.get("/getAllBookByUserId",verifyToken ,library.getByUserId);
libraryRouter.get('/book/:bookId/page/:pageNum', verifyToken, library.getBookPageImage);
libraryRouter.post('/', verifyToken, library.add);
libraryRouter.delete("/deleteLibrary/:bookId",verifyToken,library.delete);

export default libraryRouter;


