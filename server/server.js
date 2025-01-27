import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./src/config/db.js";
import errorHandler from "./src/middlewares/error/errorHandler.js";
import CustomError from "./src/middlewares/error/CustomError.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import productRoutes from "./src/routes/productRoutes.js"
import categoryRoutes from "./src/routes/categoryRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import wishlistRoutes from "./src/routes/wishListRoutes.js";

const app = express();
dotenv.config();

connectDb();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.use(errorHandler);

app.use("*", () => {
  throw new CustomError("This route is not available.", 404);
});

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Server Listening on port http://localhost:${PORT}`)
);
