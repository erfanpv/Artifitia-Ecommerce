import express from "express";
import { getCart, removeCart } from "../controllers/cartController.js";
import {
  handleController,
  handleCartAction,
} from "../middlewares/handleCart.js";
import tryCatch from "../middlewares/try-catch/try-catch.js";

const cartRoutes = express.Router();

cartRoutes
  .route("/:id")
  .post(handleCartAction, handleController)
  .get(tryCatch(getCart))
  .delete(tryCatch(removeCart));

export default cartRoutes;
