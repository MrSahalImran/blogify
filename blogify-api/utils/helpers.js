import jwt from "jsonwebtoken";
import { Category } from "../models/category.models.js";
import { ApiError } from "./api-errors.js";
import { Post } from "../models/post.models.js";

export const UserRoleEnum = {
  ADMIN: "admin",
  USER: "user",
};

export const AvailableUserRole = Object.values(UserRoleEnum);

export const AccountLevelEnum = {
  BRONZE: "bronze",
  SILVER: "silver",
  GOLD: "gold",
};

export const AvailableAccountLevel = Object.values(AccountLevelEnum);

export const UserGenderEnum = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
};

export const AvailableGender = Object.values(UserGenderEnum);

export const generatetoken = (user) => {
  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

export const findOrCreateCategory = async function (name, userId) {
  const trimName = name.trim();
  let category = await Category.findOne({
    name: new RegExp(`^${trimName}$`, "i"),
  });

  if (!category) {
    category = await Category.create({ name: trimName, author: userId });

    if (!category) {
      throw new ApiError(500, "Failed to create new category");
    }
  }

  return category;
};

export const findIfPostExists = async function (title) {
  const trimTitle = title.trim();

  const post = await Post.findOne({
    title: new RegExp(`^${trimTitle}$`, "i"),
  });

  return !!post;
};
