import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";

dotenv.config();
const PORT = process.env.PORT || 9080;

const app = express();

connectDB();

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
