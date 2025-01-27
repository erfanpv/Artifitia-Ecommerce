import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import CustomError from "../middlewares/error/CustomError.js";

dotenv.config();

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      CustomError("Access denied", 401);
    }

    const tokenValid = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!tokenValid) {
      CustomError("Token not valid", 498);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default checkAuth;
