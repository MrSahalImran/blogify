import { User } from "../models/User/user.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { generatetoken } from "../utils/helpers.js";

export const register = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    throw new ApiError(400, "All fields are required");
  }
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
    .json(new ApiResponse(201, "User created successfully", userToSend));
});

export const login = asyncHandler(async function (req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(400, "Invalid login credentials");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(400, "Invalid login credentials");
  }

  user.lastLogin = new Date();
  await user.save();

  const userToSend = {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  res
    .status(200)
    .json(
      new ApiResponse(200, "user login", {
        userToSend,
        token: generatetoken(user),
      })
    );
});
