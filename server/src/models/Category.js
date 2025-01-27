import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Subcategory name is required"],
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    unique: true,
    trim: true,
  },
  subcategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
    },
  ],
});

const Subcategory = mongoose.model("Subcategory", subcategorySchema);
const Category = mongoose.model("Category", categorySchema);

export { Category, Subcategory };
