import express from "express";
import library from "../controllers/library.js";

const libraryRouter = express.Router();

libraryRouter.post("/", library.Create);
libraryRouter.get("/", library.getAll);
libraryRouter.get("/:User_Id/:Book_Id", library.getByUserIdAndBookId);
//libraryRouter.get("/:book_name", library.getByName);
libraryRouter.put("/:User_Id/:Book_Id", library.update);
libraryRouter.delete("/:User_Id/:Book_Id", library.delete);

export default libraryRouter;