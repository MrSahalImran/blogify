import { User } from "../models/User/user.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { generatetoken } from "../utils/helpers.js";

export const register = asyncHandler(async function (req, res) {
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

  res.status(200).json(
    new ApiResponse(200, "user login", {
      userToSend,
      token: generatetoken(user),
    })
  );
});

export const getProfile = asyncHandler(async function (req, res) {
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  // const userToSend = {
  //   _id: user._id.toString(),
  //   email: user.email,
  //   username: user.username,
  //   role: user.role,
  // };

  res.status(200).json(new ApiResponse(200, "Profile Fetched", user));
});

export const blockUser = asyncHandler(async function (req, res) {
  const { userIdToBlock } = req.params;

  const userToBlock = await User.findById(userIdToBlock);

  if (!userToBlock) {
    throw new ApiError(404, "User to block not found");
  }

  const userId = req.user._id;

  if (userId.toString() === userIdToBlock.toString()) {
    throw new ApiError(400, "Cannot block yourself");
  }

  const currentUser = await User.findById(userId);

  if (!currentUser) {
    throw new ApiError(404, "User not found");
  }

  if (currentUser?.blockedUsers?.includes(userIdToBlock)) {
    throw new ApiError(400, "User already blocked");
  }

  await User.findByIdAndUpdate(
    userId,
    { $push: { blockedUsers: userIdToBlock } },
    { new: true }
  );

  res.status(200).json(new ApiResponse(200, "User blocked successfully"));
});

export const unBlockUser = asyncHandler(async function (req, res) {
  const { userIdToUnblock } = req.params;

  const userToUnBlock = await User.findById(userIdToUnblock);

  if (!userToUnBlock) {
    throw new ApiError(404, "User to unblock not found");
  }

  const userId = req.user._id;

  if (userId.toString() === userIdToUnblock.toString()) {
    throw new ApiError(400, "Cannot unblock yourself");
  }

  const currentUser = await User.findById(userId);

  if (!currentUser?.blockedUsers?.includes(userIdToUnblock)) {
    throw new ApiError(404, "User is not blocked");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $pull: {
        blockedUsers: userIdToUnblock,
      },
    },
    { new: true }
  );
  res
    .status(200)
    .json(new ApiResponse(200, "User unblock successfully", updatedUser));
});

export const profileViewers = asyncHandler(async function (req, res) {
  const { userProfileId } = req.params;

  const userProfile = await User.findById(userProfileId);

  if (!userProfile) {
    throw new ApiError(404, "User to view profile not found");
  }

  const userId = req.user._id;

  const currentUser = await User.findById(userId);

  if (!currentUser) {
    throw new ApiError(404, "User not found");
  }

  if (!currentUser?.profileviewer?.includes(userProfileId)) {
    throw new ApiError("You have already viewed this profile");
  }

  const updatedUser = await User.findByIdAndUpdate(userId, {
    $push: {
      profileviewer: userId,
    },
  });

  if (!updatedUser) {
    throw new ApiError(400, "Could not perform action");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "You have successfully viewed profile"));
});
