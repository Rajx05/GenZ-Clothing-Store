import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faMinus,
  faPlus,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useApp } from "../context/AppContext";
import { StarRating } from "./StarRating";

export function ProductDetailModal() {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    toggleWishlist,
    wishlist,
  } = useApp();
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = selectedProduct;
  if (!product) return null;

  const isWished = wishlist && wishlist.includes(product.id);

  const handleAddToBag = (product, selectedSize, color, quantity) => {
    addToCart(product, selectedSize, color, quantity);
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-4 md:inset-12 lg:inset-20 z-[85] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            {/* Image */}
            <div className="md:w-1/2 h-64 md:h-full relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span
                  className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-bold text-white ${
                    product.badge === "Sale"
                      ? "bg-red-500"
                      : product.badge === "New"
                        ? "bg-emerald-500"
                        : product.badge === "Premium"
                          ? "bg-purple-600"
                          : "bg-gray-900"
                  }`}
                >
                  {product.badge}
                </span>
              )}
            </div>

            {/* Details */}
            <div className="md:w-1/2 p-6 md:p-10 overflow-y-auto">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition z-10"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>

              <span className="text-xs tracking-[0.2em] text-brand-600 dark:text-brand-400 font-medium">
                {product.category.toUpperCase()}
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold mt-2 mb-3">
                {product.name}
              </h2>

              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={product.rating} />
                <span className="text-sm text-gray-500">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg price-original text-gray-400">
                      ${product.originalPrice}
                    </span>
                    <span className="text-sm text-red-500 font-semibold bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full">
                      Save ${product.originalPrice - product.price}
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Crafted with meticulous attention to detail, this piece embodies
                our commitment to quality and timeless design. Made from premium
                materials for lasting comfort and style.
              </p>

              {/* Color */}
              <div className="mb-6">
                <p className="text-sm font-semibold mb-3">Color</p>
                <div className="flex gap-3">
                  {product.colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(i)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === i
                          ? "border-brand-600 scale-110 shadow-lg"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      style={{ backgroundColor: color }}
                    ></button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-semibold">Size</p>
                  <button className="text-xs text-brand-600 dark:text-brand-400 underline">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`size-btn w-12 h-12 rounded-xl text-sm font-medium border-2 transition-all ${
                        selectedSize === size
                          ? "border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <p className="text-sm font-semibold mb-3">Quantity</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <FontAwesomeIcon icon={faMinus} className="text-xs" />
                  </button>
                  <span className="w-10 text-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <FontAwesomeIcon icon={faPlus} className="text-xs" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToBag(
                    product,
                    selectedSize || product.sizes[1],
                    product.colors[selectedColor],
                    quantity,
                  )}
                  className="flex-1 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold text-sm tracking-wide hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-lg"
                >
                  ADD TO BAG — ${product.price * quantity}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition ${
                    isWished
                      ? "border-red-500 bg-red-50 dark:bg-red-500/10"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={isWished ? faHeart : faHeartRegular}
                    className={`${isWished ? "text-red-500" : ""} text-lg`}
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
