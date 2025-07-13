import { Router } from "express";
import {
  createPost,
  deletePostById,
  dislikePost,
  getPostById,
  getPosts,
  likePost,
  updatePostById,
} from "../controllers/post.controllers.js";
import {
  checkAccountVerification,
  isLoggedIn,
} from "../middlewares/user.middleware.js";

const postsRouter = Router();

postsRouter.post(
  "/create-post",
  isLoggedIn,
  checkAccountVerification,
  createPost
);
postsRouter.get("/get-posts", getPosts);
postsRouter.get("/get-post/:id", getPostById);
postsRouter.put("/update-post/:id", isLoggedIn, updatePostById);
postsRouter.delete("/delete-post/:id", isLoggedIn, deletePostById);
postsRouter.put("/likes/:id", isLoggedIn, likePost);
postsRouter.put("/dislikes/:id", isLoggedIn, dislikePost);

export default postsRouter;
