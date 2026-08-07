import { Router } from "express";
import * as orderController from "../../controllers/order.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const orderRouter = Router();

// auth middleware
orderRouter.use(protect);

// Create a new order
orderRouter.post("/create", orderController.createOrder);

// verify order payment
orderRouter.post("/verify", orderController.verify);

// Get all orders for the authenticated user
orderRouter.get("/get-orders", orderController.getOrders);

export default orderRouter;
