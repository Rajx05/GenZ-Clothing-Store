import React, { useState, forwardRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import useApp from "../hooks/useApp";
import { StarRating } from "./StarRating";

export const ProductCard = React.memo(
  forwardRef(function ProductCard({ product }, ref) {
    const { addToCart, toggleWishlist, wishlist } = useApp();
    const navigate = useNavigate();
    const [selectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);
    const isWished = wishlist && wishlist.includes(product._id);

    return (
      <div ref={ref} className="group">
        {/* Image */}
        <div
          className="product-image-wrapper relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-[3/4] mb-4 cursor-pointer"
          onClick={() => navigate(`/product/${product._id}`)}
        >
          {!imageLoaded && <div className="absolute inset-0 skeleton"></div>}
          <img
            src={product.image[0].url}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />

          {/* Badge */}
          {product.badge && (
            <span
              className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide text-white ${
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

          {/* Wishlist */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product._id);
            }}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 dark:bg-gray-900/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <FontAwesomeIcon
              icon={isWished ? faHeart : faHeartRegular}
              className={`${isWished ? "text-red-500" : "text-gray-600 dark:text-gray-300"} text-sm`}
            />
          </motion.button>

          {/* Quick Add */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(
                  product,
                  selectedSize || product.sizes[1],
                  product.colors[selectedColor],
                );
              }}
              className="w-full py-2.5 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl text-xs font-semibold tracking-wider hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-xl"
            >
              QUICK ADD
            </motion.button>
          </motion.div>
        </div>

        {/* Info */}
        <div className="px-1">
          {/* Colors */}
          <div className="flex gap-1.5 mb-2">
            {product.colors.map((color, i) => (
              <button
                key={i}
                onClick={() => setSelectedColor(i)}
                className={`w-4 h-4 rounded-full border-2 transition ${
                  selectedColor === i
                    ? "border-brand-600 scale-110"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Color ${i + 1}`}
              ></button>
            ))}
          </div>

          <h3
            className="font-medium text-sm md:text-base cursor-pointer hover:text-brand-700 dark:hover:text-brand-400 transition"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mt-1">
            <span className="font-bold text-base">₹{product.price}</span>
            {product.originalPrice && (
              <span className="price-original text-sm text-gray-400">
                ₹{product.originalPrice}
              </span>
            )}
            {product.originalPrice && (
              <span className="text-xs text-red-500 font-semibold">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1.5">
            <StarRating rating={product.rating} size="text-xs" />
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>
        </div>
      </div>
    );
  }),
);
