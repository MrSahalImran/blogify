import jwt from "jsonwebtoken";

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
