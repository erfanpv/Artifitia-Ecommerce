import {
  addToCart,
  decrementProductFromCart,
  incrementProductFromCart,
} from "../controllers/cartController.js";
import tryCatch from "./try-catch/try-catch.js";
import CustomError from "./error/CustomError.js";

const handleCartAction = (req, res, next) => {
  const { action } = req.body;

  if (action === "increment") {
    req.controller = tryCatch(incrementProductFromCart);
  } else if (action === "decrement") {
    req.controller = tryCatch(decrementProductFromCart);
  } else {
    req.controller = tryCatch(addToCart);
  }

  next();
};

const handleController = (req, res, next) => {
  try {
    req.controller(req, res, next);
  } catch (error) {
    throw new CustomError(`Bad request: ${error.message}`, 500);
  }
};

export { handleCartAction, handleController };
