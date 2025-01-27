import mongoose from "mongoose";
import cartSchema from "../models/Cart.js";
import productSchema from "../models/Product.js";
import userSchema from "../models/User.js";
import CustomError from "../middlewares/error/CustomError.js";
import sendResponse from "../utils/responseHandler.js";

// add product to cart
export const addToCart = async (req, res, next) => {
  const userId = req.params.id;
  let { productId, quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new CustomError("User not found", 400);
  }

  if (!productId) {
    throw new CustomError("Invalid product ID", 400);
  }

  quantity = isNaN(quantity) || quantity < 1 ? 1 : Number(quantity);

  const user = await userSchema.findById(userId);
  const product = await productSchema.findById(productId);

  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  let cart = await cartSchema.findOne({ userId });

  if (!cart) {
    cart = new cartSchema({
      userId,
      products: [{ productId, quantity }],
    });
  } else {
    const existingProduct = cart.products.find(
      (product) => product.productId.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }
  }

  await cart.save();
  sendResponse(res, 200, true, "Product added to cart successfully", cart);
};

// get all carts
export const getCart = async (req, res, next) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new CustomError("No user found", 400);
  }

  const cart = await cartSchema
    .findOne({ userId })
    .populate("products.productId");

  if (!cart) {
    sendResponse(res, 200, true, "Cart is empty", []);
  }

  sendResponse(res, 200, true, "Cart fetched successfully", cart);
};

// Remove product from cart
export const removeCart = async (req, res, next) => {
  const userId = req.params.id;
  const { productId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new CustomError("No user found", 400);
  }
  const cart = await cartSchema.findOne({ userId });
  const user = await userSchema.findById(userId);

  if (!cart) {
    throw new CustomError("Cart not found", 404);
  }

  const productExists = cart.products.findIndex(
    (product) => product.productId.toString() === productId
  );

  if (productExists === -1) {
    throw new CustomError("Product not found in cart", 404);
  }

  cart.products.splice(productExists, 1);

  if (cart.products.length === 0) {
    await userSchema.findByIdAndUpdate(userId, {
      $unset: { cart: "" },
    });
    await cartSchema.deleteOne({ _id: cart._id });
  } else {
    await cart.save();
  }

  await user.save();

  sendResponse(res, 200, true, "Product removed from cart successfully", cart);
};

// increment product quantity in cart
export const incrementProductFromCart = async (req, res, next) => {
  const userId = req.params.id;
  const { productId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new CustomError("No user found", 400);
  }
  const cart = await cartSchema.findOne({ userId });

  const productExists = cart.products.findIndex(
    (product) => product.productId.toString() === productId
  );

  if (productExists === -1) {
    throw new CustomError("Product not found in cart", 404);
  }

  const product = cart.products.findIndex(
    (product) => product.productId.toString() === productId
  );

  if (product >= 0) {
    cart.products[product].quantity += 1;
  }

  await cart.save();

  sendResponse(res, 200, true, "Product quantity increased successfully", cart);
};

// decrement product quantity in cart
export const decrementProductFromCart = async (req, res, next) => {
  const userId = req.params.id;
  const { productId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new CustomError("No user found", 400);
  }

  const cart = await cartSchema.findOne({ userId });

  const productExists = cart.products.findIndex(
    (product) => product.productId.toString() === productId
  );

  if (productExists === -1) {
    throw new CustomError("Product not found in cart", 404);
  }

  const product = cart.products.findIndex(
    (product) => product.productId.toString() === productId
  );

  if (product >= 0) {
    cart.products[product].quantity -= 1;
  }

  if (cart.products[product].quantity < 1) {
    cart.products[product].quantity = 1;
  }

  await cart.save();

  sendResponse(res, 200, true, "Product quantity decreased successfully", cart);
};
