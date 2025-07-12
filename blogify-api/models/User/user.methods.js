import { userSchema } from "./user.models.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = async function () {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const tokenExpiry = Date.now() + 1000 * 60 * 15;

  return { token, hashedToken, tokenExpiry };
};
