import { Category } from "../models/category.models.js";
import { Post } from "../models/post.models.js";
import { User } from "../models/User/user.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { findIfPostExists, findOrCreateCategory } from "../utils/helpers.js";

export const createPost = asyncHandler(async function (req, res) {
  const { title, content, category } = req.body;

  if (!title?.trim() || !content?.trim() || !category?.trim()) {
    throw new ApiError(400, "Title and content are required");
  }

  const isPostExists = await findIfPostExists(title);

  if (isPostExists) {
    throw new ApiError(400, "Post already exists with this title");
  }

  const authorId = req.user._id;

  const existingCategory = await findOrCreateCategory(category, authorId);

  const categoryId = existingCategory._id;

  const post = await Post.create({
    title,
    content,
    category: categoryId,
    author: authorId,
  });

  await User.findByIdAndUpdate(
    authorId,
    {
      $push: {
        posts: post._id,
      },
    },
    { new: true }
  );

  await Category.findByIdAndUpdate(
    categoryId,
    {
      $push: {
        posts: post._id,
      },
    },
    { new: true }
  );

  res.status(201).json(new ApiResponse(201, "Post created successfully", post));
});

export const getPosts = asyncHandler(async function (req, res) {
  const posts = await Post.find({}).populate("comments");

  if (!posts || posts.length === 0) {
    throw new ApiError(404, "Cannot find any posts");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Posts fetched successfully", posts));
});

export const getPostById = asyncHandler(async function (req, res) {
  const { id } = req.params;

  const post = await Post.findById(id).populate("comments");

  if (!post) {
    throw new ApiError(404, "Cannot find post");
  }

  res.status(200).json(new ApiResponse(200, "Post fetched successfully", post));
});

export const deletePostById = asyncHandler(async function (req, res) {
  const { id } = req.params;

  const post = await Post.findByIdAndDelete(id);

  if (!post) {
    throw new ApiError(404, "Cannot find post");
  }

  res.status(200).json(new ApiResponse(200, "Post deleted successfully"));
});

export const updatePostById = asyncHandler(async function (req, res) {
  const { id } = req.params;

  const post = await Post.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    throw new ApiError(404, "Cannot find post");
  }

  res.status(200).json(new ApiResponse(200, "Post updated successfully", post));
});

export const likePost = asyncHandler(async function (req, res) {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    throw new ApiError(404, "Cannot find post");
  }

  const userId = req.user._id;

  await Post.findByIdAndUpdate(
    id,
    { $addToSet: { likes: userId } },
    { new: true }
  );

  post.dislikes = post.dislikes.filter(
    (dislike) => dislike.toString() !== userId.toString()
  );

  await post.save();

  res.status(200).json(new ApiResponse(200, "Post liked successfully", post));
});

export const dislikePost = asyncHandler(async function (req, res) {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    throw new ApiError(404, "Cannot find post");
  }

  const userId = req.user._id;

  await Post.findByIdAndUpdate(
    id,
    { $addToSet: { dislikes: userId } },
    { new: true }
  );

  post.likes = post.likes.filter(
    (like) => like.toString() !== userId.toString()
  );

  await post.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Post disliked successfully", post));
});
