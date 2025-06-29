import express from "express";
import comments from "../controllers/comments.js";
import { verifyToken } from "../middleware/outh.js";
const commentsRouter = express.Router();

commentsRouter.post("/addComment/:bookId",verifyToken,comments.add);
commentsRouter.get("/getAll",verifyToken, comments.getAll);
commentsRouter.get("/getAllByBookId/:bookId",verifyToken, comments.getAllByBookId);
commentsRouter.get("/:commentId",verifyToken ,comments.getById);
commentsRouter.put("/updateOrder/:commentId",verifyToken ,comments.update);
commentsRouter.delete("/:commentId",verifyToken,comments.delete);

export default commentsRouter;