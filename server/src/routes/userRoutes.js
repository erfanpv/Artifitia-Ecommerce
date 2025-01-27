import express from "express";
import { getUserById, getUsers } from "../controllers/userController.js";
import tryCatch from "../middlewares/try-catch/try-catch.js";

const userRoutes = express.Router();

userRoutes.get("/", tryCatch(getUsers));
userRoutes.get("/:id", tryCatch(getUserById));

export default userRoutes;
