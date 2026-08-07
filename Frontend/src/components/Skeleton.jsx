import { motion } from "framer-motion";

/**
 * Base skeleton block. Reuses the `.skeleton` utility from index.css
 * (bg-gray-200 dark:bg-gray-800 animate-pulse). Decorative — hidden from AT.
 */
export function Skeleton({ className = "" }) {
  return <div className={`skeleton rounded-xl ${className}`} aria-hidden="true" />;
}

/** Placeholder that mirrors a ProductCard (image tile + swatches + name + price). */
export function ProductCardSkeleton({ index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
      className="group"
      aria-hidden="true"
    >
      <div className="skeleton aspect-[3/4] rounded-2xl mb-4"></div>
      <div className="px-1 space-y-2">
        <div className="flex gap-1.5">
          <div className="skeleton w-4 h-4 rounded-full"></div>
          <div className="skeleton w-4 h-4 rounded-full"></div>
          <div className="skeleton w-4 h-4 rounded-full"></div>
        </div>
        <div className="skeleton h-4 w-3/4 rounded"></div>
        <div className="skeleton h-4 w-1/3 rounded"></div>
      </div>
    </motion.div>
  );
}

/** Placeholder that mirrors a Profile Overview StatCard. */
export function StatCardSkeleton({ index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
      className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6 shadow-sm"
      aria-hidden="true"
    >
      <div className="skeleton w-11 h-11 rounded-xl"></div>
      <div className="skeleton h-7 w-20 rounded mt-4"></div>
      <div className="skeleton h-3 w-24 rounded mt-2"></div>
    </motion.div>
  );
}

/** Placeholder that mirrors a cart line-item card. `slim` for the narrow sidebar. */
export function CartItemSkeleton({ slim = false }) {
  if (slim) {
    return (
      <div className="flex gap-4 pb-4" aria-hidden="true">
        <div className="skeleton w-20 h-24 rounded-xl shrink-0"></div>
        <div className="flex-1 space-y-2 pt-1">
          <div className="skeleton h-4 w-3/4 rounded"></div>
          <div className="skeleton h-3 w-1/2 rounded"></div>
          <div className="skeleton h-4 w-1/4 rounded mt-4"></div>
        </div>
      </div>
    );
  }
  return (
    <div
      className="flex gap-4 sm:gap-5 bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
      aria-hidden="true"
    >
      <div className="skeleton w-20 h-24 sm:w-24 sm:h-32 rounded-xl shrink-0"></div>
      <div className="flex-1 space-y-2 pt-1">
        <div className="skeleton h-4 w-2/3 rounded"></div>
        <div className="skeleton h-3 w-1/3 rounded"></div>
        <div className="skeleton h-8 w-28 rounded-full mt-4"></div>
      </div>
      <div className="skeleton h-5 w-16 rounded self-start"></div>
    </div>
  );
}
