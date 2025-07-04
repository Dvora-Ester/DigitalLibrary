import express from "express";
import user from "../controllers/user.js";
import { generateToken, isAdmin, verifyToken } from "../middleware/outh.js";

const userRouter = express.Router();

userRouter.post("/register",user.register);
userRouter.post("/login", user.login);
userRouter.get("/:user_Id",verifyToken, user.getById);
userRouter.delete("/deleteUser",verifyToken,isAdmin, user.delete);
userRouter.put("",verifyToken,isAdmin, user.update);


export default userRouter;