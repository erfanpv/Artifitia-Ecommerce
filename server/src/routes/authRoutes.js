import express from "express";
import { signUp, login, logout } from "../controllers/authController.js";
import tryCatch from "../middlewares/try-catch/try-catch.js"

const authRoutes = express.Router();

authRoutes.post("/signup", tryCatch(signUp));
authRoutes.post("/login", tryCatch(login));
authRoutes.get("/logout", tryCatch(logout));

export default authRoutes;
