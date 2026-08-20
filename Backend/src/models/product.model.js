// models/productModel.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: null },
    category: { type: String, required: true },
    sizes: [{ type: String }],
    colors: [{ type: String }],

    // Seller
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    badge: { type: String, default: null },
    image: { type: String, required: true },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
