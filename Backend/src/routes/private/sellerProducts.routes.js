import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  addProduct,
  getSellerProducts,
  deleteProduct,
  updateProduct,
  getSellerOrders,
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
sellerProductsRouter.get("/seller-orders", getSellerOrders);
sellerProductsRouter.put("/:id", updateProduct);
sellerProductsRouter.delete("/:id", deleteProduct);

export default sellerProductsRouter;
