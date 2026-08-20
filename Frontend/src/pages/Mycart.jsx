import { useEffect, useState } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import { Link } from "react-router-dom";
import useApp from "../hooks/useApp";
import { CartItemSkeleton, Skeleton } from "../components/Skeleton";
import useAuth from "../hooks/useAuth";

const spring = { type: "spring", stiffness: 260, damping: 24 };

// Smoothly counts toward `value` whenever it changes
function AnimatedNumber({ value, className }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const controls = animate(display, value, {
      duration: 0.45,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className={className}>₹{display.toFixed(2)}</span>;
}

export default function MyCart() {
  const {
    removeFromCart,
    cartItems,
    cartLoading,
    fetchCartItems,
    updateQuantity,
  } = useApp();

  const { auth, loggedIn } = useAuth();

  // fetch user cart items
  useEffect(() => {
    if (loggedIn.status) {
      fetchCartItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  // Skeleton while the first cart fetch is in flight
  if (cartLoading && (!cartItems || cartItems.length === 0)) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
        aria-busy="true"
        aria-label="Loading cart"
      >
        <div className="text-center mb-10 md:mb-12 space-y-3">
          <Skeleton className="h-3 w-32 mx-auto rounded" />
          <Skeleton className="h-9 w-40 mx-auto rounded" />
          <Skeleton className="h-4 w-48 mx-auto rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-8 space-y-4">
            <CartItemSkeleton />
            <CartItemSkeleton />
            <CartItemSkeleton />
          </div>
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
              <Skeleton className="h-6 w-36 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-5 w-full rounded mt-2" />
              <Skeleton className="h-12 w-full rounded-xl mt-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart State (only after loading finishes)
  if (!cartItems || cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16"
      >
        <motion.div
          animate={{ scale: [1, 1.06, 1], rotate: [0, 6, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 mb-6 shadow-inner"
        >
          {/* Animated Shopping Bag SVG */}
          <svg
            className="w-12 h-12 stroke-current fill-none stroke-2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.1 }}
          className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2"
        >
          Your cart is empty
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.18 }}
          className="text-gray-500 dark:text-gray-400 mb-8 max-w-md leading-relaxed"
        >
          Looks like you haven&apos;t added anything to your cart yet. Explore
          our collection and find something you love!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, delay: 0.26 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 font-medium px-6 py-3.5 rounded-xl transition-colors shadow-sm"
          >
            <span>Start Shopping</span>
            <svg
              className="w-4 h-4 stroke-current fill-none stroke-2"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 12h14M12 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  // Calculations
  const validItems = (cartItems || []).filter((item) => item?.product);
  const subtotal = validItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );
  const shipping = subtotal > 150 ? 0 : 15;
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Title */}
      <div className="text-center mb-10 md:mb-12">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="text-xs tracking-[0.3em] text-brand-600 dark:text-brand-400 font-semibold uppercase"
        >
          YOUR SAVED PIECES
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.05 }}
          className="font-display text-3xl md:text-4xl font-bold mt-2 text-gray-900 dark:text-gray-100"
        >
          Your Cart
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-sm text-gray-500 dark:text-gray-400 mt-2"
        >
          {validItems.length} item{validItems.length !== 1 ? "s" : ""} in your bag
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Side: Cart Items List */}
        <div className="lg:col-span-8">
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {validItems.map((item, i) => {
                const lineTotal = item.product.price * item.quantity;
                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 24, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      x: -60,
                      scale: 0.94,
                      transition: { duration: 0.2, ease: "easeIn" },
                    }}
                    transition={{ ...spring, delay: Math.min(i * 0.05, 0.5) }}
                    className="flex gap-4 sm:gap-5 bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-24 sm:w-24 sm:h-32 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      {/* Name + Remove */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base sm:text-lg truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 capitalize">
                            {item.product.category}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromCart(item._id)}
                          className="shrink-0 text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1.5 -m-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                          aria-label={`Remove ${item.product.name} from cart`}
                        >
                          <svg
                            className="w-5 h-5 stroke-current fill-none stroke-2"
                            viewBox="0 0 24 24"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </motion.button>
                      </div>

                      {/* Variant Badges */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {item.size && (
                          <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium px-2.5 py-1 rounded-md text-xs">
                            Size: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium px-2.5 py-1 rounded-md text-xs">
                            Color:
                            <span
                              className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"
                              style={{ backgroundColor: item.color }}
                            />
                          </span>
                        )}
                      </div>

                      {/* Price + Quantity */}
                      <div className="mt-auto pt-3 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
                            Price
                          </p>
                          <AnimatedNumber
                            value={lineTotal}
                            className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100"
                          />
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50/50 dark:bg-gray-800/60">
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() =>
                              updateQuantity(item._id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="p-2 sm:p-2.5 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent transition-colors text-gray-600 dark:text-gray-300"
                            aria-label="Decrease quantity"
                          >
                            <svg
                              className="w-3.5 h-3.5 stroke-current fill-none stroke-2"
                              viewBox="0 0 24 24"
                            >
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          </motion.button>

                          <motion.span
                            key={item.quantity}
                            initial={{ opacity: 0.4, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="px-3 text-sm font-semibold text-gray-800 dark:text-gray-100"
                          >
                            {item.quantity}
                          </motion.span>

                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() =>
                              updateQuantity(item._id, item.quantity + 1)
                            }
                            className="p-2 sm:p-2.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
                            aria-label="Increase quantity"
                          >
                            <svg
                              className="w-3.5 h-3.5 stroke-current fill-none stroke-2"
                              viewBox="0 0 24 24"
                            >
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.1 }}
          className="lg:col-span-4"
        >
          <div className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 lg:sticky lg:top-24">
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-gray-100">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <AnimatedNumber
                  value={subtotal}
                  className="font-medium text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Estimated Shipping</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {shipping === 0 ? (
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      FREE
                    </span>
                  ) : (
                    <AnimatedNumber value={shipping} />
                  )}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Estimated Tax (8%)</span>
                <AnimatedNumber
                  value={tax}
                  className="font-medium text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100">
                <span>Total</span>
                <AnimatedNumber value={grandTotal} />
              </div>
            </div>

            {/* Free Shipping Progress Indicator */}
            {subtotal < 150 && (
              <div className="pt-1">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-amber-800 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-500/10 p-3 rounded-xl border border-amber-200 dark:border-amber-500/20 text-center mb-3"
                >
                  Add{" "}
                  <span className="font-semibold">
                    ₹{(150 - subtotal).toFixed(2)}
                  </span>{" "}
                  more to unlock <strong>Free Express Shipping</strong>!
                </motion.p>
                <div className="w-full h-1.5 bg-amber-200/60 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min((subtotal / 150) * 100, 100)}%`,
                    }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Checkout Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium py-3.5 rounded-xl transition-all shadow-md"
              >
                <span>Proceed to Checkout</span>
                <svg
                  className="w-4 h-4 stroke-current fill-none stroke-2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </motion.div>

            {/* Continue Shopping */}
            <Link
              to="/shop"
              className="block text-center text-xs text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors pt-1"
            >
              &larr; Continue shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
