// backend/src/routes/product.route.js
import { Router } from "express";
import * as productController from "../../controllers/product.controller.js";

const productRouter = Router();

// fetch all products
productRouter.get("/get-all", productController.getProducts);

// fetch featured products
productRouter.get("/featured", productController.getFeaturedProducts);

// fetch products by id
productRouter.get("/get-by-id/:id", productController.getProductById);

export default productRouter;
