import express from "express";
import {
  addToWishList,
  deleteWishList,
  getWishList,
} from "../controllers/wishListController.js";
import tryCatch from "../middlewares/try-catch/try-catch.js";

const wishlistRoutes = express.Router();

wishlistRoutes
  .route("/:id")
  .get(tryCatch(getWishList))
  .post(tryCatch(addToWishList))
  .delete(tryCatch(deleteWishList));

export default wishlistRoutes;
