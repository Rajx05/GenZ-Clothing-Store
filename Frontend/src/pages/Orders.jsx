import { useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import useApp from "../hooks/useApp";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../components/Skeleton";

const spring = { type: "spring", stiffness: 260, damping: 24 };

const STATUS_BADGE = {
  Paid: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  Pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  Failed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

function StatusPill({ status }) {
  const mapped =
    status === "Paid" ? "Paid" : status === "Failed" ? "Refunded" : "Pending";
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
        STATUS_BADGE[mapped] || STATUS_BADGE.Pending
      }`}
    >
      {mapped}
    </span>
  );
}

export default function Orders() {
  const { order, orderLoading, fetchOrders } = useApp();
  const { loggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn.status) {
      fetchOrders();
    } else {
      navigate("/profile");
    }
  }, [loggedIn.status]);

  const validOrders = (order || [])
    .filter((o) => o?.items?.some((item) => item?.product))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Loading state
  if (orderLoading && validOrders.length === 0) {
    return (
      <div
        className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12"
        aria-busy="true"
        aria-label="Loading orders"
      >
        <div className="text-center mb-10 space-y-3">
          <Skeleton className="h-3 w-28 mx-auto rounded" />
          <Skeleton className="h-9 w-40 mx-auto rounded" />
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-sm"
            >
              <div className="flex justify-between mb-4">
                <Skeleton className="h-5 w-24 rounded" />
                <Skeleton className="h-5 w-20 rounded" />
              </div>
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (validOrders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="mb-10"
        >
          <span className="text-xs tracking-[0.3em] text-brand-600 dark:text-brand-400 font-semibold uppercase">
            ORDER HISTORY
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            Your Orders
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.05 }}
          className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 py-20 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600">
            <FontAwesomeIcon icon={faBoxOpen} className="text-2xl" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            No orders yet
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
            Once you place an order, it will show up here.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="mb-10"
      >
        <span className="text-xs tracking-[0.3em] text-brand-600 dark:text-brand-400 font-semibold uppercase">
          ORDER HISTORY
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
          Your Orders
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
          {validOrders.length} order{validOrders.length !== 1 ? "s" : ""} placed
        </p>
      </motion.div>

      {/* Order cards */}
      <div className="space-y-4">
        {validOrders.map((o, i) => {
          const items = o.items.filter((item) => item?.product);
          return (
            <motion.div
              key={o._id || i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: Math.min(i * 0.05, 0.3) }}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden"
            >
              {/* Order header */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    Order #{i + 1}
                  </span>
                  <span className="text-gray-400 dark:text-gray-500">
                    {new Date(o.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <StatusPill status={o.paymentStatus} />
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {items.map((item, j) => (
                  <div
                    key={item._id || j}
                    className="flex items-center gap-4 px-5 sm:px-6 py-4"
                  >
                    {/* Image */}
                    <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                        {item.product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {item.size && (
                          <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium px-2 py-0.5 rounded-md">
                            {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium px-2 py-0.5 rounded-md">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-gray-300 dark:border-gray-600"
                              style={{ backgroundColor: item.color }}
                            />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Qty × Price */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order total */}
              <div className="flex items-center justify-between px-5 sm:px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order Total
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  ₹{o.totalAmount?.toFixed(2) ?? "0.00"}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
