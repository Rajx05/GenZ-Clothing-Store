import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  addProduct,
  getSellerProducts,
  deleteProduct,
} from "../../controllers/sellerProducts.controller.js";
import multer from "multer";

const sellerProductsRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

sellerProductsRouter.use(protect);

sellerProductsRouter.post("/add", upload.single("image"), addProduct);
sellerProductsRouter.get("/", getSellerProducts);
sellerProductsRouter.delete("/:id", deleteProduct);

export default sellerProductsRouter;
