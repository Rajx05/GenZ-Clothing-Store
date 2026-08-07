import React, { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Routes, Route } from "react-router-dom";

// Context
import useAuth from "./hooks/useAuth";
import useApp from "./hooks/useApp";

// Components
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CartSidebar } from "./components/CartSidebar";
import { BackToTop } from "./components/BackToTop";
import { Toast } from "./components/Toast";
import { ScrollToTop } from "./components/ScrollToTop";

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Wishlist from "./pages/Wishlist";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import MyCart from "./pages/Mycart";
import Checkout from "./pages/Checkout";
import Verify from "./pages/Verify";

function App() {
  const { loggedIn } = useAuth();
  const {
    darkMode,
    wishlist,
    toast,
    setToast,
    cartItems,
    fetchCartItems,
  } = useApp();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("abc-dark-mode", JSON.stringify(darkMode));
  }, [darkMode]);

  // fetch user cart items
  useEffect(() => {
    fetchCartItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // console.log("car items:", cartItems);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);
  // console.log("local storage cart:", localStorage.getItem("cart"));

  // update profile icon in navbar when user logs in or out
  useEffect(() => {}, [loggedIn.status]);

  useEffect(() => {
    localStorage.setItem("user-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  return (
    <>
      <ScrollToTop />
      <Navbar />

      <main className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-cart" element={<MyCart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/verify" element={<Verify />} />
        </Routes>
      </main>

      <Footer />
      <CartSidebar />
      <BackToTop />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
