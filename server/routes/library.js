// import express from "express";
// import library from "../controllers/library.js";
// import { verifyToken } from "../middleware/outh.js";

// const libraryRouter = express.Router();

// // libraryRouter.post("/", library.Create);
// libraryRouter.get("/", library.getAll);
// libraryRouter.get("/:User_Id/:Book_Id", library.getByUserIdAndBookId);
// //libraryRouter.get("/:book_name", library.getByName);
// libraryRouter.put("/:User_Id/:Book_Id", library.update);
// libraryRouter.delete("/deleteLibrary/:bookId",verifyToken,library.delete);

// export default libraryRouter;
import express from "express";
import library from "../controllers/library.js";
import { verifyToken } from "../middleware/outh.js";

const libraryRouter = express.Router();


libraryRouter.get("/", library.getAll);

// 🔍 קבלת ספר לפי משתמש וספר (עבור סימניה וכו')
libraryRouter.get("/getBook/:bookId",verifyToken ,library.getByUserIdAndBookId);

// 📖 הזרמת ספר למשתמש שמורשה לכך (שימוש בקובץ PDF בלבד)
// libraryRouter.get("/stream/:bookId", verifyToken, library.streamBook);
libraryRouter.delete("/deleteLibrary/:bookId",verifyToken,library.delete);

export default libraryRouter;
