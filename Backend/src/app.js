import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/public/auth.routes.js";
import productRouter from "./routes/public/product.routes.js";
import cartRouter from "./routes/private/cart.routes.js";
import orderRouter from "./routes/private/order.routes.js";
import sellerProductsRouter from "./routes/private/sellerProducts.routes.js";

const app = express();

// Comma-separated list of allowed frontend origins.
// Defaults to local dev; set CORS_ORIGIN on Render to your Vercel URL(s),
// e.g. CORS_ORIGIN=https://my-store.vercel.app
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173", "http://localhost:4173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin / non-browser requests (curl, health checks)
      if (!origin || corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
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
app.use("/api/seller-products", sellerProductsRouter);

export default app;
