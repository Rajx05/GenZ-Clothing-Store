import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import useApp from "../hooks/useApp";
import { ProductCard } from "../components/ProductCard";

export default function Wishlist() {
  const { wishlist, getProducts } = useApp();
  const [wishedProducts, setWishedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wishlist || wishlist.length === 0) {
      setWishedProducts([]);
      setLoading(false);
      return;
    }

    const fetchWished = async () => {
      setLoading(true);
      try {
        const allProducts = await getProducts({ limit: 100 });
        const matched = (allProducts || []).filter(
          (p) => wishlist.includes(p._id),
        );
        setWishedProducts(matched);
      } catch {
        setWishedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWished();
  }, [wishlist, getProducts]);

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
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse aspect-[3/4]"
                />
              ))}
            </div>
          ) : wishedProducts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {wishedProducts.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
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
                <FontAwesomeIcon icon={faHeartRegular} className="text-3xl" />
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
