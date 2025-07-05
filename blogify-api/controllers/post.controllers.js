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
