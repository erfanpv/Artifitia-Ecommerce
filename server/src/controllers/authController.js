import userSchema from "../models/User.js";
import CustomError from "../middlewares/error/CustomError.js";
import sendResponse from "../utils/responseHandler.js";
import dotenv from "dotenv";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import generateToken from "../utils/token.js";
dotenv.config();

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await userSchema.findOne({ email });
  if (existingUser) {
    throw new CustomError("Email already exists...", 400);
  }

  const hashedPassword = await hashPassword(password);

  const newUser = new userSchema({
    email,
    name,
    password: hashedPassword,
  });
  await newUser.save();

  sendResponse(res, 201, true, "User Registered Successfully");
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userSchema.findOne({ email });
  if (!user) {
    throw new CustomError("No user found. Please create an account.", 400);
  }

  const validUser = await comparePassword(password, user.password);

  if (!validUser) {
    throw new CustomError("Invalid credentials", 401);
  }

  const token = generateToken(user._id);

  sendResponse(
    res,
    200,
    true,
    "Login successful",
    {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token
  );
};

export const logout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  sendResponse(res, 200, true, "Logged out successfully");
};
