import { Router } from "express";
import * as cartController from "../../controllers/cart.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const cartRouter = Router();

// protect middleware to verify incoming requests
cartRouter.use(protect);

// Routes
cartRouter.get("/get-cart", cartController.getCart);
cartRouter.post("/add-to-cart", cartController.addToCart);
cartRouter.delete("/remove-from-cart", cartController.removeItemFromCart);
cartRouter.put("/update-quantity", cartController.updateItemQuantity);

export default cartRouter;
