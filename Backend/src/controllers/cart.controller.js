import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const getCart = async (req, res) => {
  // get user cart
  try {
    // Finds or creates a cart matching req.user.id
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
    );

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }
    cart.items = cart.items.filter((item) => item.product);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addToCart = async (req, res) => {
  const { productId, size, color, quantity = 1 } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        (item.size || null) === (size || null) &&
        (item.color || null) === (color || null),
    );

    let cartItem;
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += Number(quantity);
      cartItem = cart.items[existingItemIndex];
    } else {
      cartItem = cart.items.push({
        product: productId,
        quantity: Number(quantity),
        size: String(size),
        color: String(color),
      });
      cartItem = cart.items[cart.items.length - 1];
    }

    await cart.save();

    await cart.populate("items.product");

    const populatedItem = cart.items.find(
      (item) => item._id.toString() === cartItem._id.toString(),
    );

    res.status(200).json({
      message: "Item added to cart",
      product: populatedItem,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateItemQuantity = async (req, res) => {
  const { itemId, quantity } = req.body;

  if (!itemId || !Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
    return res.status(400).json({
      message: "itemId and a positive integer quantity are required",
    });
  }

  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id, "items._id": itemId },
      { $set: { "items.$.quantity": Number(quantity) } },
      { new: true },
    ).populate("items.product");

    if (!cart) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    res.status(200).json({ message: "Quantity updated", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const removeItemFromCart = async (req, res) => {
  const { productId } = req.body;

  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { items: { _id: productId } } },
      { new: true },
    ).populate("items.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user" });
    }

    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
