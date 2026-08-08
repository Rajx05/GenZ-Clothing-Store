import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faBars,
  faMagnifyingGlass,
  faSun,
  faMoon,
  faUser,
  faBagShopping,
} from "@fortawesome/free-solid-svg-icons";
import {
  faUser as faUserRegular,
  faHeart as faHeartRegular,
} from "@fortawesome/free-regular-svg-icons";
import useApp from "../hooks/useApp";
import useAuth from "../hooks/useAuth";

const MotionIcon = motion(FontAwesomeIcon);

export function Navbar() {
  // contexts
  const { darkMode, toggleDark, cart, wishlist } = useApp();
  const { loggedIn } = useAuth();

  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const totalItems = (cart || []).reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = ["New In", "Women", "Men", "Sale"];

  const getNavLinkPath = (link) => {
    if (link === "New In") return "/shop?badge=New";
    if (link === "Sale") return "/shop?category=Sale";
    return "/shop";
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
    console.log("e: ", e.target.value);

    console.log("searchQuery: ", searchQuery);

    navigate(`/shop?search=${encodeURIComponent(e.target.value.trim())}`);
  };

  return (
    <>
      <motion.header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "glass shadow-lg" : "bg-white/95 dark:bg-gray-950/95"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 -ml-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon
                icon={mobileMenuOpen ? faXmark : faBars}
                className="text-lg"
              />
            </button>

            {/* Logo */}
            <Link to="/">
              <motion.div
                className="flex-shrink-0 cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <h1 className="font-display font text-2xl md:text-3xl font-bold tracking-wider">
                  GenZ
                </h1>
                <p className="text-[9px] tracking-[0.35em] text-gray-500 dark:text-gray-400 -mt-1 hidden sm:block">
                  PREMIUM & TRENDY
                </p>
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link}
                  to={getNavLinkPath(link)}
                  className="text-sm font-medium tracking-wide hover:text-brand-700 dark:hover:text-brand-400 transition-colors relative group"
                >
                  {link}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-700 dark:bg-brand-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-lg" />
              </motion.button>

              {/* Dark mode toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                onClick={toggleDark}
                aria-label="Toggle dark mode"
              >
                <MotionIcon
                  key={darkMode ? "sun" : "moon"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  icon={darkMode ? faSun : faMoon}
                  className={`${darkMode ? "text-yellow-400" : ""} text-lg`}
                />
              </motion.button>

              {/* User Account / Profile */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition relative"
                onClick={() =>
                  navigate(loggedIn.status ? "/profile" : "/login")
                }
                aria-label="User Account"
              >
                <FontAwesomeIcon
                  icon={loggedIn.status ? faUser : faUserRegular}
                  className={`${loggedIn.status ? "text-brand-600 dark:text-brand-400" : ""} text-lg`}
                />
                {loggedIn.status && (
                  <span className="absolute bottom-1 right-1 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-gray-950"></span>
                )}
              </motion.button>

              {/* Wishlist */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition relative"
                onClick={() => navigate("/wishlist")}
                aria-label="Wishlist"
              >
                <FontAwesomeIcon icon={faHeartRegular} className="text-lg" />
                {wishlist && wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </motion.button>

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition relative"
                onClick={() => navigate("/my-cart")}
                aria-label="Shopping cart"
              >
                <FontAwesomeIcon icon={faBagShopping} className="text-lg" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key={totalItems}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-700 text-white rounded-full text-[10px] flex items-center justify-center font-bold"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              <div className="max-w-2xl mx-auto px-4 py-4">
                <div className="flex items-center gap-3">
                  <form onSubmit={handleSearch} className="relative flex-1">
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearch}
                      placeholder="Search for products..."
                      className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-brand-500 outline-none text-sm text-gray-900 dark:text-white"
                      autoFocus
                    />
                  </form>

                  <button
                    className="px-4 py-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={() => setSearchOpen(false)}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 mobile-menu-overlay md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 z-50 w-72 h-full bg-white dark:bg-gray-900 shadow-2xl md:hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-display text-xl font-bold">Menu</h2>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <FontAwesomeIcon icon={faXmark} className="text-lg" />
                  </button>
                </div>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link}
                      to={getNavLinkPath(link)}
                      className="text-lg font-medium py-2 border-b border-gray-100 dark:border-gray-800 hover:text-brand-700 dark:hover:text-brand-400 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link}
                    </Link>
                  ))}
                  <Link
                    to="/wishlist"
                    className="text-lg font-medium py-2 border-b border-gray-100 dark:border-gray-800 hover:text-brand-700 dark:hover:text-brand-400 transition flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faHeartRegular} /> Wishlist
                  </Link>
                  <Link
                    to={loggedIn ? "/profile" : "/login"}
                    className="text-lg font-medium py-2 border-b border-gray-100 dark:border-gray-800 hover:text-brand-700 dark:hover:text-brand-400 transition flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faUserRegular} />{" "}
                    {loggedIn ? "My Profile" : "Login / Register"}
                  </Link>
                </nav>
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      toggleDark();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-sm font-medium"
                  >
                    <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
