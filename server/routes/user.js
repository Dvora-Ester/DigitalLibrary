import express from "express";
import user from "../controllers/user.js";
import { generateToken, verifyToken } from "../middleware/outh.js";

const userRouter = express.Router();

userRouter.post("/register",user.register);
userRouter.post("/login", user.login);


export default userRouter;