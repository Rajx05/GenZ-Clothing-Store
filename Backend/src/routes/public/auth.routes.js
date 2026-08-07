import { Router } from "express";
import * as authController from "../../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
authRouter.get("/logout-all", authController.logoutAllSessions);
authRouter.post("/verify-otp", authController.verifyOtp);
authRouter.get("/verify-token", authController.verifyToken);
authRouter.post("/get-new-access-token", authController.refreshToken);

export default authRouter;
