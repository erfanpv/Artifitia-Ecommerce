import { Category, Subcategory } from "../models/Category.js";
import sendResponse from "../utils/responseHandler.js";
import CustomError from "../middlewares/error/CustomError.js";

export const addSubcategory = async (req, res) => {
  const { category, subCategoryName } = req.body;

  if (!category || !subCategoryName || subCategoryName.trim() === "") {
    throw new CustomError("Category and subcategory name are required", 400);
  }

  const parentCategory = await Category.findOne({ name: category });
  if (!parentCategory) {
    throw new CustomError("Parent category not found", 404);
  }

  // Create new subcategory
  const newSubcategory = new Subcategory({
    name: subCategoryName.trim(),
    category: parentCategory._id,
  });

  const savedSubcategory = await newSubcategory.save();

  parentCategory.subcategories.push(savedSubcategory._id);
  await parentCategory.save();

  const populatedSubcategory = await savedSubcategory.populate("category");

  sendResponse(
    res,
    201,
    true,
    "Subcategory added successfully",
    populatedSubcategory
  );
};

// get all categories with their subcategories
export const getCategories = async (req, res) => {
  const categories = await Category.find().populate({
    path: "subcategories",
    select: "name",
  });
  sendResponse(res, 200, true, "Categories retrieved successfully", categories);
};

// add a new category
export const addCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new CustomError("Category name is required", 400);
  }

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw new CustomError("Category already exists", 400);
  }

  const newCategory = new Category({ name });
  const savedCategory = await newCategory.save();
  sendResponse(res, 201, true, "Category added successfully", savedCategory);
};

// Get a subcategory by its name
export const getSubcategoryWithName = async (req, res) => {
  const { name } = req.params;

  const category = await Category.findOne({ name }).populate("subcategories");
  if (!category) {
    throw new CustomError("Category not found", 404);
  }

  const subcategory = category.subcategories;

  sendResponse(
    res,
    200,
    true,
    "Subcategories retrieved successfully",
    subcategory
  );
};
