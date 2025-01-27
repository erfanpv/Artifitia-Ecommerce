import mongoose from "mongoose";
import productSchema from "../models/Product.js";
import { Category } from "../models/Category.js";
import { cloudinary } from "../config/cloudinary.js";
import CustomError from "../middlewares/error/CustomError.js";
import sendResponse from "../utils/responseHandler.js";

export const addProduct = async (req, res) => {
  const variants = JSON.parse(req.body.variants || "[]");

  if (!req.body.name || !req.body.category || !variants.length) {
    throw new CustomError("Missing required fields", 400);
  }

  const images = req.files?.map((file) => file.path) || [];
  if (!images.length) {
    throw new CustomError("At least one image is required", 400);
  }

  const category = await Category.findOne({
    name: { $regex: new RegExp(`^${req.body.category}$`, "i") },
  });
  if (!category) {
    throw new CustomError(`Category ${req.body.category} not found`, 404);
  }

  const basePrice = Math.min(...variants.map((v) => parseFloat(v.price) || 0));
  if (isNaN(basePrice) || basePrice <= 0) {
    throw new CustomError("Invalid price in variants", 400);
  }

  const product = new productSchema({
    name: req.body.name,
    description: req.body.description,
    price: basePrice,
    category: category._id,
    images,
    variants: variants
      .map((variant) => ({
        ram: variant.ram,
        price: parseFloat(variant.price) || 0,
        qty: parseInt(variant.qty) || 0,
      }))
      .filter(
        (variant) =>
          !isNaN(variant.price) &&
          !isNaN(variant.qty) &&
          variant.price > 0 &&
          variant.qty >= 0
      ),
  });

  if (product.variants.length === 0) {
    throw new CustomError("At least one valid variant is required", 400);
  }

  const savedProduct = await product.save();
  await savedProduct.populate("category");

  sendResponse(res, 201, true, "Product added successfully", savedProduct);
};

export const getProducts = async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;

  let products;

  let totalItems;

  const skip = (page - 1) * limit;
  const query = category ? { category } : {};

  totalItems = await productSchema.countDocuments(query);

  products = await productSchema.find(query).skip(skip).limit(limit);

  sendResponse(
    res,
    200,
    true,
    "Products fetched successfully",
    { products, totalItems },
    null
  );
};

export const getProductWithId = async (req, res) => {
  const productId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new CustomError("Invalid product ID", 400);
  }

  const product = await productSchema.findById(productId);

  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  sendResponse(res, 200, true, "Product fetched successfully", product);
};

export const editProduct = async (req, res) => {
  const { id } = req.params;

  const variants = JSON.parse(req.body.variants || "[]");

  if (!req.body.name || !req.body.category || !variants.length) {
    throw new CustomError("Missing required fields", 400);
  }

  const category = await Category.findOne({
    name: { $regex: new RegExp(`^${req.body.category}$`, "i") },
  });
  if (!category) {
    throw new CustomError(`Category ${req.body.category} not found`, 404);
  }

  const product = await productSchema.findById(id);
  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  let images = req.files?.map((file) => file.path) || [];
  if (images.length > 0) {
    for (const oldImage of product.images) {
      await cloudinary.uploader.destroy(oldImage.public_id).catch(() => {});
    }
  } else {
    images = product.images;
  }

  const basePrice = Math.min(...variants.map((v) => parseFloat(v.price) || 0));
  if (isNaN(basePrice) || basePrice <= 0) {
    throw new CustomError("Invalid price in variants", 400);
  }

  product.name = req.body.name;
  product.description = req.body.description;
  product.price = basePrice;
  product.category = category._id;
  product.images = images;
  product.variants = variants
    .map((variant) => ({
      ram: variant.ram,
      price: parseFloat(variant.price) || 0,
      qty: parseInt(variant.qty) || 0,
    }))
    .filter(
      (variant) =>
        !isNaN(variant.price) &&
        !isNaN(variant.qty) &&
        variant.price > 0 &&
        variant.qty >= 0
    );

  if (product.variants.length === 0) {
    throw new CustomError("At least one valid variant is required", 400);
  }

  const updatedProduct = await product.save();
  await updatedProduct.populate("category");

  sendResponse(res, 200, true, "Product updated successfully", updatedProduct);
};
