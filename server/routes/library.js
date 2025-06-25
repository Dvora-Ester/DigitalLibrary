
import express from "express";
import library from "../controllers/library.js";
// import auth from "../middleware/auth.js";
import { verifyToken } from "../middleware/outh.js";

const libraryRouter = express.Router();

libraryRouter.get("/", library.getAll);

// 🔍 קבלת ספר לפי משתמש וספר (עבור סימניה וכו')
libraryRouter.get("/getBook/:bookId",verifyToken ,library.getByUserIdAndBookId);
libraryRouter.get("/getAllBookByUserId",verifyToken ,library.getByUserId);

// 📖 הזרמת ספר למשתמש שמורשה לכך (שימוש בקובץ PDF בלבד)
// libraryRouter.get("/stream/:bookId", verifyToken, library.streamBook);
libraryRouter.delete("/deleteLibrary/:bookId",verifyToken,library.delete);

export default libraryRouter;
