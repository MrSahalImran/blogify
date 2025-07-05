import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import userRouter from "./routes/user.routes.js";
import categoryRouter from "./routes/category.routes.js";
import postsRouter from "./routes/posts.routes.js";

dotenv.config();
const PORT = process.env.PORT || 9080;

const app = express();

connectDB();

app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/posts", postsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
