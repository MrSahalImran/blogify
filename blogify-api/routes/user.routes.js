import { Router } from "express";
import {
  accountVerifcationEmail,
  blockUser,
  followingUser,
  forgotPassword,
  getProfile,
  login,
  profileViewers,
  register,
  resetPassword,
  unBlockUser,
  unFollowingUser,
  verifyAccount,
} from "../controllers/user.controllers.js";
import { isLoggedIn } from "../middlewares/user.middleware.js";

const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/get-profile/:id", isLoggedIn, getProfile);
userRouter.put("/block/:userIdToBlock", isLoggedIn, blockUser);
userRouter.put("/unblock/:userIdToUnblock", isLoggedIn, unBlockUser);
userRouter.get("/profile-viewer/:userProfileId", isLoggedIn, profileViewers);
userRouter.put("/following/:userToFollowId", isLoggedIn, followingUser);
userRouter.put("/unfollowing/:userToUnfollowId", isLoggedIn, unFollowingUser);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);
userRouter.put("/account-verification", isLoggedIn, accountVerifcationEmail);
userRouter.put("/account-verification/:token", isLoggedIn, verifyAccount);

export default userRouter;
