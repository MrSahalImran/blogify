import { Router } from "express";
import { createPost } from "../controllers/post.controllers.js";
import { isLoggedIn } from "../middlewares/user.middleware.js";

const postsRouter = Router();

postsRouter.post("/create-post", isLoggedIn, createPost);

export default postsRouter;
