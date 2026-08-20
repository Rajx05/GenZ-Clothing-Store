import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faHeart,
  faUserCog,
  faCircleCheck,
  faCircleQuestion,
  faRightFromBracket,
  faBagShopping,
  faDollarSign,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import useApp from "../hooks/useApp";
import useAuth from "../hooks/useAuth";
import { PRODUCTS } from "../data/constants";
import { StatCardSkeleton } from "../components/Skeleton";
import Avatar from "../components/profile/Avatar";
import SettingsPanel from "../components/profile/SettingsPanel";

const spring = { type: "spring", stiffness: 260, damping: 24 };

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: faChartPie },
  { id: "wishlist", label: "Wishlist", icon: faHeart },
  { id: "settings", label: "Settings", icon: faUserCog },
];

// ----------------------------- sub-components -----------------------------//

function Sidebar({ user, active, onSelect, onLogout }) {
  const isVerified = Boolean(user?.verified);
  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
      {/* Identity */}
      <div className="flex items-center gap-4">
        <Avatar user={user} size="lg" />
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
            {user?.username || "Member"}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {user?.email || "—"}
          </p>
          <p
            className={`flex items-center gap-1.5 text-xs font-medium mt-1 ${
              isVerified
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-amber-600 dark:text-amber-400"
            }`}
          >
            <FontAwesomeIcon
              icon={isVerified ? faCircleCheck : faCircleQuestion}
            />
            {isVerified ? "Email Verified" : "Email Not Verified"}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800 my-5"></div>

      {/* Nav */}
      <nav aria-label="Account sections" className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm transition-colors ${
                isActive
                  ? "bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-semibold"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              <FontAwesomeIcon icon={item.icon} className="w-4 text-center" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 dark:border-gray-800 my-5"></div>

      {/* Logout */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-500/40 text-red-500 text-xs font-semibold tracking-wider hover:bg-red-500 hover:text-white transition-colors duration-300"
      >
        <FontAwesomeIcon icon={faRightFromBracket} />
        LOGOUT ACCOUNT
      </motion.button>
    </div>
  );
}

function MobileTabBar({ active, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 -mx-4 sm:-mx-6 px-4 sm:px-6">
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center gap-2 whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-colors ${
              isActive
                ? "bg-brand-600 text-white shadow-md"
                : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400"
            }`}
          >
            <FontAwesomeIcon icon={item.icon} />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function StatCard({ icon, iconCls, value, label, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: index * 0.05 }}
      className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6 shadow-sm"
    >
      <div
        className={`w-11 h-11 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 ${
          iconCls || ""
        }`}
      >
        <FontAwesomeIcon icon={icon} />
      </div>
      <p className="mt-4 text-2xl font-display font-bold text-gray-900 dark:text-gray-100">
        {value}
      </p>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">
        {label}
      </p>
    </motion.div>
  );
}

function OverviewPanel({ user, stats, onSelect, cartLoading }) {
  const isVerified = Boolean(user?.verified);
  const cards = [
    {
      icon: faBagShopping,
      value: stats.cartCount,
      label: "Cart Items",
      iconCls: "",
    },
    {
      icon: faDollarSign,
      value: `₹${stats.cartSubtotal.toFixed(2)}`,
      label: "Cart Subtotal",
      iconCls: "",
    },
    {
      icon: faHeart,
      value: stats.wishlistCount,
      label: "Wishlist Items",
      iconCls: "",
    },
    {
      icon: isVerified ? faCircleCheck : faCircleQuestion,
      value: isVerified ? "Verified" : "Pending",
      label: "Email Status",
      iconCls: isVerified
        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
        : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
      >
        <span className="text-xs tracking-[0.3em] text-brand-600 dark:text-brand-400 font-semibold uppercase">
          ACCOUNT OVERVIEW
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
          Welcome back, {user?.username || "Member"}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
          Here&apos;s a snapshot of your shopping activity at a glance.
        </p>
      </motion.div>

      {/* Stat cards */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        aria-busy={cartLoading || undefined}
      >
        {cartLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} index={i} />
            ))
          : cards.map((card, i) => (
              <StatCard key={card.label} {...card} index={i} />
            ))}
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.2 }}
        className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6 shadow-sm"
      >
        <h2 className="font-display text-lg font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/my-cart"
            className="px-6 py-3 border border-gray-900 dark:border-white rounded-xl text-xs font-semibold tracking-wider hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-colors"
          >
            VIEW CART
          </Link>
          <Link
            to="/wishlist"
            className="px-6 py-3 border border-gray-900 dark:border-white rounded-xl text-xs font-semibold tracking-wider hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-colors"
          >
            VIEW WISHLIST
          </Link>
          <button
            type="button"
            onClick={() => onSelect("settings")}
            className="px-6 py-3 border border-gray-900 dark:border-white rounded-xl text-xs font-semibold tracking-wider hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-colors"
          >
            EDIT PROFILE
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function WishlistPanel({ wishedProducts, wishlistCount }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="text-xs tracking-[0.3em] text-brand-600 dark:text-brand-400 font-semibold uppercase">
              YOUR SAVED PIECES
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              My Wishlist
            </h1>
          </div>
          {wishlistCount > 0 && (
            <span className="bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs font-semibold px-2.5 py-1 rounded-full">
              {wishlistCount} item{wishlistCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </motion.div>

      {/* Wishlist card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.05 }}
        className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6 shadow-sm"
      >
        {wishedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {wishedProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: i * 0.05 }}
              >
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="text-sm font-semibold truncate mt-2">
                  {product.name}
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                  ₹{product.price}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 max-w-md mx-auto">
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
          </div>
        )}
      </motion.div>

      {/* View full wishlist */}
      {wishedProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.1 }}
          className="flex justify-end"
        >
          <Link
            to="/wishlist"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
          >
            View full wishlist{" "}
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </Link>
        </motion.div>
      )}
    </div>
  );
}

// ------------------------------- main page -------------------------------//

export default function CustomerDashboard() {
  const { setToast, wishlist, cartItems, cartLoading, fetchCartItems } =
    useApp();
  const { loggedIn, setLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const [active, setActive] = useState("overview");
  const loggedOutRef = useRef(false);

  // Redirect to login if not authenticated (skip once user logs out on purpose)
  useEffect(() => {
    if (!loggedIn.status && !loggedOutRef.current) {
      navigate("/login");
    }
  }, [loggedIn.status, navigate]);

  // Refresh cart for this session — the App-level fetch runs before login and 401s
  useEffect(() => {
    if (loggedIn.status) fetchCartItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn.status]);

  if (!loggedIn.status) return null;

  const user = loggedIn.user || {};
  const wishedProducts = PRODUCTS.filter((p) => wishlist?.includes(p.id)).slice(
    0,
    6,
  );
  const cartCount = (cartItems || []).reduce(
    (sum, item) => sum + (item.quantity || 1),
    0,
  );
  const cartSubtotal = (cartItems || []).reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
    0,
  );

  const stats = {
    cartCount,
    cartSubtotal,
    wishlistCount: wishlist?.length || 0,
  };

  const handleLogout = () => {
    loggedOutRef.current = true;
    logout();
    navigate("/");
  };

  const handleSaved = (updatedUser) => {
    if (!updatedUser) {
      setToast?.({
        message: "Could not save settings. Please try again.",
        type: "error",
      });
      return;
    }
    setLoggedIn({ status: true, user: { ...user, ...updatedUser } });
    setToast?.({ message: "Profile updated successfully!", type: "success" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-10 items-start">
        {/* Mobile tab bar */}
        <div className="lg:hidden">
          <MobileTabBar active={active} onSelect={setActive} />
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden lg:block sticky top-24">
          <Sidebar
            user={user}
            active={active}
            onSelect={setActive}
            onLogout={handleLogout}
          />
        </aside>

        {/* Main panels */}
        <main className="min-w-0">
          <AnimatePresence mode="wait">
            {active === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={spring}
              >
                <OverviewPanel
                  user={user}
                  stats={stats}
                  onSelect={setActive}
                  cartLoading={cartLoading}
                />
              </motion.div>
            )}
            {active === "wishlist" && (
              <motion.div
                key="wishlist"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={spring}
              >
                <WishlistPanel
                  wishedProducts={wishedProducts}
                  wishlistCount={wishlist?.length || 0}
                />
              </motion.div>
            )}
            {active === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={spring}
              >
                <SettingsPanel user={user} onSaved={handleSaved} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
