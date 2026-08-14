import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Razorpay from "razorpay";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import config from "../config/config.js";

export const createOrder = async (req, res) => {
  try {
    // razorpay instance
    const razorpay = new Razorpay({
      key_id: config.RAZORPAY_KEY_ID,
      key_secret: config.RAZORPAY_KEY_SECRET,
    });

    // find user cart and compare its cartItems with client cartItems
    const cart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.product");

    if (!cart) {
      res.status(401).json({
        message: "cart not found",
      });
    }

    // calculate total price
    const subtotal = cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    console.log("subtotal: ", subtotal);
    const shipping = subtotal > 150 ? 0 : 15;

    const tax = subtotal * 0.08;
    const grandTotal = subtotal + shipping + tax;

    // create an order with razorpay api
    const razorpayOrder = await razorpay.orders.create({
      amount: grandTotal * 100,
      currency: "INR",
      receipt: "shopping cart order",
      notes: {},
    });

    // save the order in DB
    const order = new Order({
      razorpayOrderId: razorpayOrder.id,
      user: req.user.id,
      items: cart.items,
      totalAmount: grandTotal,
    });
    await order.save();

    res.status(200).json({
      message: "Order created successfully",
      order: razorpayOrder,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating order", error: error.error });
  }
};

export const verify = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const secret = config.RAZORPAY_KEY_SECRET;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const isValidSignature = validateWebhookSignature(
      body,
      razorpay_signature,
      secret,
    );
    console.log("user id:", req.user.id);
    if (isValidSignature) {
      // Update the order with payment details
      const order = await Order.findOne({
        razorpayOrderId: razorpay_order_id,
        paymentStatus: "Unpaid",
      });

      // delete cart
      const cart = await Cart.findOneAndDelete({
        user: req.user.id,
      });

      if (!cart) {
        res.status(404).json({ message: "cart not found" });
      }
      if (!order) {
        res.status(401).json({ message: "invalid order" });
      } else {
        // update order status
        order.paymentStatus = "Paid";
        await order.save();

        res.status(200).json({ status: "ok" });
        console.log("Payment verification successful");
      }
    } else {
      res.status(400).json({ status: "verification_failed" });
      console.log("Payment verification failed");
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "error verifying payment", error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const order = await Order.find({ user: req.user.id }).populate(
      "items.product",
    );
    res.status(200).json({ order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};
