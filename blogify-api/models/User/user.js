import mongoose from "mongoose";
import { userSchema } from "./user.models.js";
import "./user.methods.js"; // attach methods to the schema

export const User = mongoose.model("User", userSchema);
