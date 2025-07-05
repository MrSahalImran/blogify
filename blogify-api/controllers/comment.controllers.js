import { Comment } from "../models/comment.models.js";
import { Post } from "../models/post.models.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const createComment = asyncHandler(async function (req, res) {
  const { text } = req.body;

  if (!text) {
    throw new ApiError(400, "Invalid Inputs");
  }

  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const comment = await Comment.create({
    text,
    author: req.user._id,
    postId,
  });

  await Post.findByIdAndUpdate(
    postId,
    {
      $push: {
        comments: comment._id,
      },
    },
    { new: true }
  );

  res
    .status(201)
    .json(new ApiResponse(201, "Comment Added Successfully", comment));
});

export const deleteComment = asyncHandler(async function (req, res) {
  const { id } = req.params;

  const comment = await Comment.findById(id);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  await Comment.findByIdAndDelete(id);

  res.status(200).json(new ApiResponse(200, "Comment deleted"));
});

export const updateComment = asyncHandler(async function (req, res) {
  const { id } = req.params;

  const { text } = req.body;

  if (!text?.trim()) {
    throw new ApiError(400, "Comment text cannot be empty");
  }

  const comment = await Comment.findById(id);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    id,
    { text },
    { new: true, runValidators: true }
  );

  res
    .status(201)
    .json(new ApiResponse(201, "comment successfully updated", updatedComment));
});
