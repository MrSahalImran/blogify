import mongoose from "mongoose";
import {
  AccountLevelEnum,
  AvailableAccountLevel,
  AvailableGender,
  AvailableUserRole,
  UserGenderEnum,
  UserRoleEnum,
} from "../utils/helpers.js";
import bcrypt from "bcryptjs";

export const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: AvailableUserRole,
      default: UserRoleEnum.USER,
    },
    password: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now(),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    accountLevel: {
      type: String,
      enum: AvailableAccountLevel,
      default: AccountLevelEnum.BRONZE,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    notificationPerferences: {
      email: { type: String, default: true },
    },
    gender: {
      type: String,
      enum: AvailableGender,
    },
    profileviewer: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    passwordResetToken: {
      type: String,
    },
    passwordResetExpiry: {
      type: Date,
    },
    accountVerificationToken: {
      type: String,
    },
    accountVerifcationExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
});

export const User = mongoose.model("User", userSchema);
