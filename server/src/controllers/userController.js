import mongoose from "mongoose";
import userSchema from "../models/User.js";
import CustomError from "../middlewares/error/CustomError.js";
import sendResponse from "../utils/responseHandler.js";

// get all users
export const getUsers = async (req, res, next) => {
  const users = await userSchema.find();
  sendResponse(res, 200, true, "Users fetched successfully", users);
};

// get user by id
export const getUserById = async (req, res, next) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new CustomError("Invalid user ID", 400);
  }

  const userById = await userSchema.findById(userId);

  if (!userById) {
    throw new CustomError("No user found", 404);
  }

  sendResponse(res, 200, true, "User fetched successfully", userById);
};
