import { User } from "../models/User/user.js";
import { ApiError } from "../utils/api-errors.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";

export const isLoggedIn = asyncHandler(async function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authorization token missing or invalid");
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select(
      "username email role _id"
    );

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }
});
