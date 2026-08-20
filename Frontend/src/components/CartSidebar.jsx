import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faBagShopping,
  faMinus,
  faPlus,
  faTrashCan,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import useApp from "../hooks/useApp";
import { useNavigate } from "react-router-dom";
import { CartItemSkeleton } from "./Skeleton";

export function CartSidebar() {
  const navigate = useNavigate();
  const {
    cartOpen,
    setCartOpen,
    cartItems,
    cartLoading,
    updateQuantity,
    removeFromCart,
  } = useApp();

  const validItems = (cartItems || []).filter((item) => item?.product);

  const subtotal = validItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shipping = subtotal >= 150 ? 0 : 12;
  const total = subtotal + shipping;
  // console.log("total:", total);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
            className="fixed top-0 right-0 z-[70] w-full max-w-md h-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h2 className="font-display text-xl font-bold">Shopping Bag</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {validItems.length} item{validItems.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Free shipping bar */}
            {subtotal < 150 && subtotal > 0 && (
              <div className="px-6 py-3 bg-brand-50 dark:bg-brand-900/20">
                <p className="text-xs text-center mb-1.5">
                  <span className="font-semibold">
                    ₹{(150 - subtotal).toFixed(0)}
                  </span>{" "}
                  away from free shipping!
                </p>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min((subtotal / 150) * 100, 100)}%`,
                    }}
                    className="h-full bg-brand-600 rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartLoading && validItems.length === 0 ? (
                <div className="space-y-4" aria-busy="true" aria-label="Loading bag">
                  <CartItemSkeleton slim />
                  <CartItemSkeleton slim />
                  <CartItemSkeleton slim />
                </div>
              ) : validItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <FontAwesomeIcon
                    icon={faBagShopping}
                    className="text-5xl text-gray-200 dark:text-gray-700 mb-4"
                  />
                  <p className="font-semibold text-lg mb-1">
                    Your bag is empty
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Looks like you haven&apos;t added anything yet.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCartOpen(false)}
                    className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-semibold"
                  >
                    CONTINUE SHOPPING
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {validItems.map((item) => (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{
                          opacity: 0,
                          x: -30,
                          height: 0,
                          marginBottom: 0,
                        }}
                        className="flex gap-4 pb-4 border-b border-gray-100 dark:border-gray-800"
                      >
                        <div className="w-20 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Size: {item.size} &bull;{" "}
                            <span
                              className="inline-block w-2.5 h-2.5 rounded-full align-middle"
                              style={{ backgroundColor: item.product.color }}
                            ></span>
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updateQuantity(item._id, item.quantity - 1)
                                }
                                className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                              >
                                <FontAwesomeIcon icon={faMinus} className="text-[10px]" />
                              </button>
                              <span className="text-sm font-medium w-6 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item._id, item.quantity + 1)
                                }
                                className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                              >
                                <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                              </button>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-sm">
                                ₹{item.product.price * item.quantity}
                              </span>
                              <button
                                onClick={() => removeFromCart(item._id)}
                                className="text-gray-400 hover:text-red-500 transition"
                              >
                                <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {validItems.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-800/50">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-500 font-medium">FREE</span>
                      ) : (
                        `₹${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold text-sm tracking-wide hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-lg"
                  onClick={() => {
                    setCartOpen(false);
                    navigate("/checkout");
                  }}
                >
                  CHECKOUT — ₹{total.toFixed(2)}
                </motion.button>
                <p className="text-[10px] text-center text-gray-400 mt-3">
                  <FontAwesomeIcon icon={faLock} className="mr-1" /> Secure
                  checkout powered by Razorpay
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
