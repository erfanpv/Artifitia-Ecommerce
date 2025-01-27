import express from "express";
import {
  addCategory,
  addSubcategory,
  getCategories,
  getSubcategoryWithName,
} from "../controllers/categoryController.js";
import tryCatch from "../middlewares/try-catch/try-catch.js";

const categoryRoutes = express.Router();

categoryRoutes
  .route("/")
  .post(tryCatch(addCategory))
  .get(tryCatch(getCategories));
categoryRoutes.route("/subcategory").post(tryCatch(addSubcategory));
categoryRoutes
  .route("/subcategories/:name")
  .get(tryCatch(getSubcategoryWithName));

export default categoryRoutes;
