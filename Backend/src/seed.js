// backend/seed.js
import mongoose from "mongoose";
import Product from "./models/product.model.js";
import { initialProducts } from "./utils/productsData.js";
import config from "./config/config.js";

const seedDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Connected to MongoDB...");

    await Product.deleteMany({});
    console.log("Cleared old products.");

    await Product.insertMany(initialProducts);
    console.log("Successfully seeded products! 🚀");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDatabase();
