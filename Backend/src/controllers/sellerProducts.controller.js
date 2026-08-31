import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import { v2 as cloudinary } from "cloudinary";

// cloudinary config
cloudinary.config({
  secure: true,
});

const uploadImage = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    stream.end(buffer);
  });
};

const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    console.log(result);
    // { result: 'ok' }

    return result;
  } catch (error) {
    console.error("Cloudinary deletion failed:", error);
    throw error;
  }
};

const createImageUrl = async (publicId) => {
  let imageUrl = cloudinary.url(publicId, {
    transformation: [{ quality: "auto" }, { fetch_format: "webp" }],
  });

  return imageUrl;
};

export const addProduct = async (req, res) => {
  const { id, role } = req.user;

  const image = req.file.buffer;
  const data = req.body;
  data.sizes = JSON.parse(data.sizes || "[]");
  data.colors = JSON.parse(data.colors || "[]");

  try {
    if (role !== "seller")
      return res
        .status(401)
        .json({ message: "only sellers are allowed to add products" });

    const public_id = await uploadImage(image);
    const url = await createImageUrl(public_id.public_id);

    const product = await Product.create({
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      sizes: data.sizes,
      colors: data.colors,
      user: id,
      image: [
        {
          url: url,
          public_id: public_id.public_id,
        },
      ],
      originalPrice: data.originalPrice,
      badge: data.badge,
      stock: data.stock,
    });

    return res.status(201).json({ product });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "internal server error, please try again later" });
  }
};

export const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "internal server error, please try again later" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.find({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or not owned by you" });
    }
    deleteImage(product[0].image[0].public_id);
    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "internal server error, please try again later" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const data = req.body;

    if (data.sizes) data.sizes = JSON.parse(data.sizes);
    if (data.colors) data.colors = JSON.parse(data.colors);

    const product = await Product.findOne({ _id: req.params.id, user: userId });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or not owned by you" });
    }

    const updatable = [
      "name",
      "description",
      "price",
      "originalPrice",
      "category",
      "sizes",
      "colors",
      "stock",
      "badge",
    ];
    for (const field of updatable) {
      if (data[field] !== undefined) {
        product[field] = data[field];
      }
    }

    await product.save();
    return res.status(200).json({ product });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "internal server error, please try again later" });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const sellerProductIds = await Product.find({ user: userId }).select("_id");

    const productIds = sellerProductIds.map((p) => p._id);

    const orders = await Order.find({
      "items.product": { $in: productIds },
    })
      .populate("items.product")
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ orders });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "internal server error, please try again later" });
  }
};
