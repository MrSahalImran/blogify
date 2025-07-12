import { Router } from "express";
import {
  blockUser,
  getProfile,
  login,
  profileViewers,
  register,
  unBlockUser,
} from "../controllers/user.controllers.js";
import { isLoggedIn } from "../middlewares/user.middleware.js";

const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/get-profile/:id", isLoggedIn, getProfile);
userRouter.put("/block/:userIdToBlock", isLoggedIn, blockUser);
userRouter.put("/unblock/:userIdToUnblock", isLoggedIn, unBlockUser);
userRouter.get("/profile-viewer/:userProfileId", isLoggedIn, profileViewers);

export default userRouter;
