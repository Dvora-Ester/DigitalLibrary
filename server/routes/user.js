import express from "express";
import user from "../controllers/user.js";

const userRouter = express.Router();

userRouter.post("/register", user.register);
userRouter.post("/login", user.login);
userRouter.get("/login/:id", user.getById);

export default userRouter;