import mongoose from "mongoose";
import config from "./config.js";
import Product from "../models/product.model.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI);
    await Product.syncIndexes();
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
