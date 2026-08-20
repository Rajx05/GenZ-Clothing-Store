import Product from "../models/product.model.js";
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

const createImageUrl = async (publicId) => {
  let imageUrl = cloudinary.url(publicId, {
    transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
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
      image: url,
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
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or not owned by you" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "internal server error, please try again later" });
  }
};
