import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./Skeleton";
import useInfiniteProducts from "../hooks/useInfiniteProducts";

export function ProductGrid() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get("category") || "";
  const activeBadge = searchParams.get("badge") || "";
  const searchQuery = searchParams.get("search") || "";

  const [sortBy, setSortBy] = useState("featured");

  const {
    products,
    initialLoading,
    loadingMore,
    hasMore,
    error,
    loadMore,
    sentinelRef,
  } = useInfiniteProducts({
    category: activeFilter,
    badge: activeBadge,
    search: searchQuery,
    sortBy: sortBy === "featured" ? "" : sortBy,
  });

  const setActiveFilter = (filter) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("badge");
    newParams.delete("search");

    if (filter === "All") {
      newParams.delete("category");
    } else {
      newParams.set("category", filter);
    }
    setSearchParams(newParams);
  };

  const filters = ["All", "Dresses", "Outerwear", "Tops", "Bottoms", "Sale"];

  return (
    <section
      id="shop"
      className="py-12 md:py-6 bg-gray-50/50 dark:bg-gray-900/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-xs tracking-[0.3em] text-brand-600 dark:text-brand-400 font-medium">
            CURATED FOR YOU
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">
            Our Collection
          </h2>
        </motion.div> */}

        {/* Filters & Sort */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <motion.button
                key={f}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                  (activeFilter || "All") === f
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                }`}
              >
                {f}
              </motion.button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Grid */}
        {initialLoading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            aria-busy="true"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} index={i} />
            ))}
          </div>
        ) : products.length === 0 && !error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <FontAwesomeIcon
              icon={faBoxOpen}
              className="text-4xl text-gray-300 dark:text-gray-600 mb-4"
            />
            <p className="text-gray-500">No products found in this category.</p>
          </motion.div>
        ) : (
          <>
            {/* Product cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -80px 0px" }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </motion.div>

            {/* Loading-more skeletons */}
            {loadingMore && hasMore && (
              <div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-4"
                aria-hidden="true"
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={`loading-more-${i}`} index={i} />
                ))}
              </div>
            )}

            {/* End of collection */}
            {!hasMore && products.length > 0 && (
              <div className="pt-6 pb-2 text-center">
                <div className="border-t border-gray-200 dark:border-gray-700 mb-4" />
                <p className="text-[11px] tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase font-medium">
                  End of collection
                </p>
              </div>
            )}

            {/* Load-more error + retry */}
            {error && (
              <div className="pt-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Couldn&apos;t load more products.
                </p>
                <button
                  type="button"
                  onClick={loadMore}
                  className="px-5 py-2 text-xs font-semibold text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Sentinel — IntersectionObserver watches this */}
            <div ref={sentinelRef} className="h-px" />
          </>
        )}
      </div>
    </section>
  );
}
