import { Router } from "express";
import {
  createPost,
  deletePostById,
  getPostById,
  getPosts,
  updatePostById,
} from "../controllers/post.controllers.js";
import { isLoggedIn } from "../middlewares/user.middleware.js";

const postsRouter = Router();

postsRouter.post("/create-post", isLoggedIn, createPost);
postsRouter.get("/get-posts", getPosts);
postsRouter.get("/get-post/:id", getPostById);
postsRouter.put("/update-post/:id", isLoggedIn, updatePostById);
postsRouter.delete("/delete-post/:id", isLoggedIn, deletePostById);

export default postsRouter;
