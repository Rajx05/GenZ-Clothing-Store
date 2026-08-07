import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/public/auth.routes.js";
import productRouter from "./routes/public/product.routes.js";
import cartRouter from "./routes/private/cart.routes.js";
import orderRouter from "./routes/private/order.routes.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "credentials"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// public routes
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);

// private routes
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

export default app;
