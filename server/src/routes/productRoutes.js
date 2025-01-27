import express from "express";
import {
  addProduct,
  editProduct,
  getProducts,
  getProductWithId,
} from "../controllers/productController.js";
import { upload } from "../config/cloudinary.js";
import {
  handleMulterError,
  generalErrorHandler,
} from "../middlewares/error/multerError.js";
import tryCatch from "../middlewares/try-catch/try-catch.js"


const productRoutes = express.Router();

productRoutes.get("/", tryCatch(getProducts));
productRoutes.get("/:id", tryCatch(getProductWithId));

productRoutes.post("/", upload.array("images", 5), handleMulterError, tryCatch(addProduct));
productRoutes.put("/:id", upload.array("images"), tryCatch(editProduct));

productRoutes.use(generalErrorHandler);

export default productRoutes;
