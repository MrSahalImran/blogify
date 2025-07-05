import { Router } from "express";
import { isLoggedIn } from "../middlewares/user.middleware.js";
import {
  createComment,
  deleteComment,
  updateComment,
} from "../controllers/comment.controllers.js";

const commentRouter = Router();

commentRouter.post("/add-comment/:postId", isLoggedIn, createComment);
commentRouter.put("/update-comment/:id", isLoggedIn, updateComment);
commentRouter.delete("/delete-comment/:id", isLoggedIn, deleteComment);

export default commentRouter;
