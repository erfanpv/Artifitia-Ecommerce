import mongoose from "mongoose";
import wishSchema from "../models/WishList.js";
import productSchema from "../models/Product.js";
import userSchema from "../models/User.js";
import CustomError from "../middlewares/error/CustomError.js";
import sendResponse from "../utils/responseHandler.js";

// add to wishlist
export const addToWishList = async (req, res, next) => {
  const userId = req.params.id;
  const { productId } = req.body;

  console.log(productId,"abcde")

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new CustomError("Invalid user ID", 400);
  }

  const productExists = await productSchema.findById(productId);
  if (!productExists) {
    throw new CustomError("Product not found", 404);
  }

  const user = await userSchema.findById(userId);
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  let wishList = await wishSchema.findOne({ userId });

  if (!wishList) {
    wishList = new wishSchema({
      userId,
      products: [{ productId }],
    });
    user.wishlist = wishList._id;
  } else {
    const existingProduct = wishList.products.some(
      (product) => product.productId.toString() === productId
    );

    if (existingProduct) {
      throw new CustomError("Product already in wishlist", 401);
    }

    wishList.products.push({ productId });
  }

  await wishList.save();
  await user.save();

  sendResponse(
    res,
    200,
    true,
    "Product added to wishlist successfully",
    wishList.products
  );
};

// get all wishlist
export const getWishList = async (req, res, next) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new CustomError("Invalid user ID", 400);
  }

  const wishlist = await wishSchema
    .findOne({ userId })
    .populate("products.productId");

  if (!wishlist) {
    throw new CustomError("Wishlist not found", 404);
  }

  sendResponse(
    res,
    200,
    true,
    "Wishlist fetched successfully",
    wishlist.products
  );
};

// Remove from wishlist
export const deleteWishList = async (req, res, next) => {
  const userId = req.params.id;
  const { productId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new CustomError("Invalid user ID", 400);
  }

  const productExists = await productSchema.findById(productId);
  if (!productExists) {
    throw new CustomError("Product not found", 404);
  }

  const user = await userSchema.findById(userId);
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const wishlist = await wishSchema.findOne({ userId });
  if (!wishlist) {
    throw new CustomError("Wishlist not found", 404);
  }

  const productIndex = wishlist.products.findIndex(
    (product) => product.productId.toString() === productId
  );

  if (productIndex === -1) {
    throw new CustomError("Product not found in wishlist", 404);
  }

  wishlist.products.splice(productIndex, 1);

  if (wishlist.products.length > 0) {
    await wishlist.save();
  } else {
    await wishSchema.deleteOne({ _id: wishlist._id });
    user.wishlist = undefined;
  }

  await user.save();

  sendResponse(res, 200, true, "Product removed from wishlist successfully");
};


export const toggleWishListItem = async (req, res) => {
  
    const userId = req.params.id;
    const { productId } = req.body;

    let wishList = await wishSchema.findOne({ userId });

    if (!wishList) {
      wishList = new wishSchema({
        userId,
        products: [{ productId }],
      });

      await wishList.save();
      return res.status(200).json({
        success:true,
        message: "Wishlist created and item added successfully",
        data:wishList
      });
    } else {
      const productIndex = wishList.products.findIndex(
        (product) => product.productId.toString() === productId
      );

      if (productIndex === -1) {
        wishList.products.push({ productId });
        await wishList.save();
        return res.status(200).json({
          success:true,
          message: "Item added to wishlist successfully",
          data:wishList
        });
      } else {
        wishList.products.splice(productIndex, 1);
        await wishList.save();
        return res.status(200).json({
          success:true,
          message: "Item removed from wishlist successfully",
          data:wishList
        });
      }
    }

};
