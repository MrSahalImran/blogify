import { Router } from "express";
import {
  createCategory,
  deleteCatgory,
  getCategories,
  updateCategory,
} from "../controllers/category.controllers.js";
import { isLoggedIn } from "../middlewares/user.middleware.js";

const categoryRouter = Router();

categoryRouter.post("/create-category", isLoggedIn, createCategory);
categoryRouter.get("/all-categories", getCategories);
categoryRouter.put("/update-category/:id", updateCategory);
categoryRouter.delete("/delete-category/:id", deleteCatgory);
export default categoryRouter;
