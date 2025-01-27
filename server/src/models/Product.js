import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    minlength: [3, "Product name must be at least 3 characters long"],
    maxlength: [100, "Product name must not exceed 100 characters"],
  },
  description: {
    type: String,
    maxlength: [500, "Description must not exceed 500 characters"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be a positive value"],
  },
  images: {
    type: [String],
    required: [true, "At least one image is required"],
  },
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
  ],
  variants: [
    {
      ram: { type: String, required: [true, "RAM configuration is required"] },
      price: { type: Number, required: [true, "Price is required"] },
      qty: { type: Number, required: [true, "Quantity is required"] },
    },
  ],
});

const Product = mongoose.model("Product", productSchema);
export default Product;