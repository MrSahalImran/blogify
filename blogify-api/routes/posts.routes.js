import { Router } from "express";
import {
  claps,
  createPost,
  deletePostById,
  dislikePost,
  getPostById,
  getPosts,
  likePost,
  schedulePost,
  updatePostById,
} from "../controllers/post.controllers.js";
import {
  checkAccountVerification,
  filterBlockedUsers,
  isLoggedIn,
} from "../middlewares/user.middleware.js";

const postsRouter = Router();

postsRouter.post(
  "/create-post",
  isLoggedIn,
  checkAccountVerification,
  createPost
);
postsRouter.get("/get-posts", isLoggedIn, filterBlockedUsers, getPosts);
postsRouter.get("/get-post/:id", filterBlockedUsers, getPostById);
postsRouter.put("/update-post/:id", isLoggedIn, updatePostById);
postsRouter.delete("/delete-post/:id", isLoggedIn, deletePostById);
postsRouter.put("/likes/:id", isLoggedIn, filterBlockedUsers, likePost);
postsRouter.put("/dislikes/:id", isLoggedIn, filterBlockedUsers, dislikePost);
postsRouter.put("/claps/:id", isLoggedIn, filterBlockedUsers, claps);
postsRouter.put("/schedule/:id", isLoggedIn, schedulePost);

export default postsRouter;
