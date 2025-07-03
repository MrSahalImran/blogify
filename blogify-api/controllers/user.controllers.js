import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";

export const register = async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    throw new ApiError(400, "All fields are required");
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }

    const newUser = await User.create({
      username,
      password,
      email,
    });

    if (!newUser) {
      throw new ApiError(500, "Failed to create user");
    }

    const userToSend = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };

    res
      .status(201)
      .json(new ApiResponse(201, userToSend, "User created successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};
