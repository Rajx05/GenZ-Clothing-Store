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
    // console.log("cart:", cart);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addToCart = async (req, res) => {
  const { productId, size, color, quantity = 1 } = req.body;

  try {
    // 1. Verify the product actually exists and is in stock
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
    }

    // Optional: Check stock availability
    // if (product.stock < quantity) {
    //   return res.status(400).json({ message: "Insufficient stock available" });
    // }

    // 2. Find the user's cart (or create a new one if it doesn't exist)
    let cart = await Cart.findOne({ user: req.user.id });
    const newItem = cart.items.create({
      product: productId,
      quantity: Number(quantity),
      size: String(size),
      color: String(color),
    });

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [],
        size: "",
      });
      cart.items.push(newItem);

      await cart.save();
      res.status(200).json({
        message: "item added to cart",
        product: {
          _id: newItem._id,
          size: size,
          color: color,
          product: product,
          quantity: quantity,
        },
      });
    } else {
      // 3. Check if the product is already in the cart with SAME SIZE and COLOR
      const existingItemIndex = cart.items.findIndex(
        (item) =>
          item.product.toString() === productId &&
          (item.size || null) === (size || null) &&
          (item.color || null) === (color || null),
      );

      if (existingItemIndex > -1) {
        // Product exists -> update quantity
        cart.items[existingItemIndex].quantity += Number(quantity);
      } else {
        // Product is new -> add to items array
        cart.items.push(newItem);
      }
      await cart.save();
      res.status(200).json({
        message: "Item added to cart",
        product: {
          _id: newItem._id,
          size: size,
          color: color,
          product: product,
          quantity: quantity,
        },
      });
    }
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
  console.log(productId);
  // const userId = req.user.id;

  try {
    // find user cart
    // const userCart = await Cart.findOne({user:req.user.id});

    //  delete the item
    const updatedCart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { items: { _id: productId } } },
    );

    if (!updatedCart) {
      res.status(404).json({
        message: "Cart not found for this user",
      });
    }
    await updatedCart.save();
    res.status(200).json({
      message: "item removed",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
  }
};
