import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useApp from "../hooks/useApp";
import { PRODUCTS } from "../data/constants";
import { ProductCard } from "../components/ProductCard";

export default function Wishlist() {
  const { wishlist } = useApp();

  // Find favorited products
  const wishedProducts = PRODUCTS.filter(
    (p) => wishlist && wishlist.includes(p.id),
  );

  return (
    <div className="py-12 md:py-20 min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div className="text-center mb-12">
          <span className="text-xs tracking-[0.3em] text-brand-600 dark:text-brand-400 font-semibold uppercase">
            YOUR SAVED PIECES
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-2">
            My Wishlist
          </h1>
        </div>

        {/* Grid or Empty State */}
        <AnimatePresence mode="wait">
          {wishedProducts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {wishedProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-20 max-w-md mx-auto"
            >
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400 dark:text-gray-600 shadow-inner">
                <i className="far fa-heart text-3xl"></i>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
                Explore our collections and add items you love to your personal
                wishlist to keep track of them here.
              </p>
              <Link
                to="/shop"
                className="inline-block px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-semibold tracking-wider hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-lg"
              >
                START SHOPPING
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
