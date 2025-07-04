import { Router } from "express";
import {
  getProfile,
  login,
  register,
} from "../controllers/user.controllers.js";
import { isLoggedIn } from "../middlewares/user.middleware.js";

const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/get-profile/:id", isLoggedIn, getProfile);

export default userRouter;
