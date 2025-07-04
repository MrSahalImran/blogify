import { Category } from "../models/category.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";

export const createCategory = asyncHandler(async function (req, res) {
  const { name } = req.body;

  const categoryFound = await Category.findOne({ name });

  if (categoryFound) {
    throw new ApiError(400, "Category already exists");
  }

  const category = await Category.create({
    name: name,
    author: req.user._id,
  });

  if (!category) {
    throw new ApiError(500, "Internal Server Error cannot create category");
  }

  res.status(201).json(new ApiResponse(201, "Category created", category));
});

export const getCategories = asyncHandler(async function (req, res) {
  const categories = await Category.find().select(
    "name author _id shares createdAt"
  );

  if (categories.length === 0 || !categories) {
    throw new ApiError(400, "List Empty");
  }

  res
    .status(201)
    .json(new ApiResponse(201, "Categories successfully fetched", categories));
});

export const updateCategory = asyncHandler(async function (req, res) {
  const id = req.params.id;
  const { name } = req.body;
  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    { name },
    { new: true, runValidators: true }
  );

  if (!updatedCategory) {
    throw new ApiError(404, "Category not found");
  }

  res.status(201).json(new ApiResponse(201, "Categories successfully updated"));
});

export const deleteCatgory = asyncHandler(async function (req, res) {
  const id = req.params.id;

  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  await Category.findByIdAndDelete(id);

  res.status(200).json(new ApiResponse(200, "Category deleted successfully"));
});
