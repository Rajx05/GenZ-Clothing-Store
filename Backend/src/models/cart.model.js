import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    // Reference to the user who owns the cart
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Typically one active cart per user
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Reference to the Product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1,
        },
        size: {
          type: String,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
); // Automatically manages createdAt and updatedAt

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
