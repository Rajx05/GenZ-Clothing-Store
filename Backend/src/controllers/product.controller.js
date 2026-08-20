// backend/src/controllers/product.controller.js
import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
  try {
    // 1. Extract query params from URL with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const { category, search, sortBy, badge } = req.query;

    const skip = (page - 1) * limit;

    // 2. Build the MongoDB Filter Object dynamically
    const filterQuery = {};

    // Category / Sale Filter
    if (category && category !== "All") {
      if (category === "Sale") {
        // Item is on sale if originalPrice exists and is not null
        filterQuery.originalPrice = { $ne: null };
      } else {
        filterQuery.category = category;
      }
    }

    // Search Query Filter (Case-insensitive matching)
    if (search) {
      filterQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { badge: { $regex: search, $options: "i" } },
      ];
    }

    // Badge Filter
    if (badge) {
      filterQuery.badge = badge;
    }

    // 3. Build the MongoDB Sorting Logic
    let sortQuery = {};
    switch (sortBy) {
      case "price-low":
        sortQuery = { price: 1, _id: 1 };
        break;
      case "price-high":
        sortQuery = { price: -1, _id: 1 };
        break;
      case "rating":
        sortQuery = { rating: -1, _id: 1 };
        break;
      default:
        sortQuery = { createdAt: -1, _id: 1 };
        break;
    }

    // 4. Execute queries against MongoDB
    const products = await Product.find(filterQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(filterQuery);

    // Check if there are more items beyond the current page chunk
    const hasMore = skip + products.length < totalProducts;

    res.status(200).json({
      success: true,
      products,
      hasMore,
      totalProducts,
    });
  } catch (error) {
    console.error("Error inside getProducts controller:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error fetching products" });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true });

    res.status(200).json({
      success: true,
      products: featuredProducts,
    });
  } catch (error) {
    console.error("Error inside getFeaturedProducts controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching featured products",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
