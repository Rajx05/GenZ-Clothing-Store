import { createContext, useState, useCallback } from "react";
import axios from "../api/axios.js";
import axiosPrivate from "../api/axiosPrivate";
import heroImgDesktop from "../images/hero.webp";
import heroImgMobile from "../images/jonas-horsch.webp";
import { useNavigate } from "react-router-dom";

const AppContext = createContext({});

// ── Razorpay lazy-load / dispose (module scope — only touch window/document) ──

const RAZORPAY_SRC = "https://checkout.razorpay.com/v1/checkout.js";
let razorpayLoadPromise = null;

function ensureRazorpayLoaded() {
  if (window.Razorpay) return Promise.resolve(true);
  if (!razorpayLoadPromise) {
    razorpayLoadPromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = RAZORPAY_SRC;
      script.id = "razorpay-checkout-script";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        script.remove();
        razorpayLoadPromise = null;
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }
  return razorpayLoadPromise;
}

function disposeRazorpay() {
  razorpayLoadPromise = null;
  const script = document.getElementById("razorpay-checkout-script");
  if (script) script.remove();
  try {
    delete window.Razorpay;
  } catch {
    window.Razorpay = undefined;
  }
}

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  // Dark mode
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("abc-dark-mode");
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Toast
  const [toast, setToast] = useState(null);

  // Selected product (keeping legacy state to prevent context issues)
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter (keeping legacy context field to prevent warnings)
  const [activeFilter, setActiveFilter] = useState("All");

  // View (keeping legacy context field to prevent warnings)
  const [currentView, setCurrentView] = useState("home");

  // Wishlist
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("abc-wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Products
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  // Seller Products
  const [sellerProducts, setSellerProducts] = useState([]);

  // Seller Orders (orders containing seller's products)
  const [sellerOrders, setSellerOrders] = useState([]);

  // Cart
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("abc-cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  //  Order
  const [order, setOrder] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);

  //------------------------------ functions--------------------------//

  const toggleDark = () => setDarkMode((prev) => !prev);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchCartItems = useCallback(async () => {
    setCartLoading(true);
    try {
      const response = await axiosPrivate.get("/cart/get-cart/");
      setCartItems(response.data.items);
    } catch (error) {
      console.log("Error fetching cart items from the server: ", error);
    } finally {
      setCartLoading(false);
    }
  });

  //  fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      const response = await axiosPrivate.get("order/get-orders");
      setOrder(...[], response.data.order);
    } catch (error) {
      setToast({ message: `failed to get orders: ${error}`, type: "failure" });
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const addToCart = useCallback(
    async (productId, quantity = 1, size, color) => {
      // console.log("access token:", auth.accessToken);
      try {
        const response = await axiosPrivate.post("/cart/add-to-cart/", {
          productId,
          quantity,
          size,
          color,
        });
        // console.log("product:", response.data.product);
        const newProduct = response.data.product;

        setCartItems((prev) => {
          const existingIndex = prev.findIndex(
            (item) =>
              item?.product &&
              item.size === newProduct.size &&
              item.color === newProduct.color &&
              (item.product._id === newProduct.product._id ||
                item._id === newProduct._id ||
                item._id === newProduct._id),
          );

          if (existingIndex > -1) {
            return prev.map((item, index) =>
              index === existingIndex
                ? {
                    ...item,
                    quantity: (item.quantity || 0) + (newProduct.quantity || 1),
                  }
                : item,
            );
          }

          return [...prev, newProduct];
        });
        setToast({ message: `Item added to cart!`, type: "success" });
        setCartOpen(true);
      } catch (error) {
        console.log("failed to add item to cart", error);
      }
    },
  );

  const updateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    // Optimistic update for instant UI feedback
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, quantity: newQty } : item,
      ),
    );
    try {
      await axiosPrivate.put("/cart/update-quantity", {
        itemId,
        quantity: newQty,
      });
    } catch (error) {
      console.error("Failed to update quantity", error);
      fetchCartItems(); // roll back to the server's version
    }
  };

  const removeFromCart = useCallback(async (productId) => {
    // console.log(productId);
    // console.log(auth.accessToken);
    setCartItems((prev) => prev.filter((item) => item._id !== productId));

    await axiosPrivate.delete("/cart/remove-from-cart", {
      data: {
        productId,
      },
    });
    setToast({ message: "Item removed from bag", type: "success" });
  }, []);

  // Wishlist functions
  const toggleWishlist = useCallback((productId) => {
    setWishlist((prev) => {
      const itemIndex = prev.indexOf(productId);
      if (itemIndex > -1) {
        setToast({ message: "Removed from wishlist", type: "info" });
        return prev.filter((id) => id !== productId);
      }
      setToast({ message: "Added to wishlist!", type: "success" });
      return [...prev, productId];
    });
  }, []);

  // fetch all products
  const getProducts = useCallback(
    async ({ page = 1, limit = 20, filter = "All", badge, search, sortBy }) => {
      setProductsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page,
          limit,
          category: filter,
          badge: badge || "",
          search: search || "",
          sortBy: sortBy || "",
        });

        const response = await axios(
          `/products/get-all?${queryParams.toString()}`,
        );
        const data = await response.data;
        return data.products;
      } catch (error) {
        console.error("Error fetching products:", error);
        return [];
      } finally {
        setProductsLoading(false);
      }
    },
    [],
  );

  // fetch seller's listed products
  const getSellerProducts = useCallback(async () => {
    try {
      const response = await axiosPrivate.get("/seller-products");
      setSellerProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching seller products:", error);
    }
  }, []);

  // fetch orders containing this seller's products
  const getSellerOrders = useCallback(async () => {
    try {
      const response = await axiosPrivate.get("/seller-products/seller-orders");
      setSellerOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching seller orders:", error);
    }
  }, []);

  // update an existing seller product
  const updateSellerProduct = useCallback(async (productId, data) => {
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        if (key === "sizes" || key === "colors") {
          formData.append(key, JSON.stringify(value));
        } else if (key === "imageFile") {
          // skip — image updates not supported
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      }
      const response = await axiosPrivate.put(`/seller-products/${productId}`, formData);
      return response.data.product;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }, []);

  const paymentVerification = useCallback(async (order) => {
    try {
      const response = await axiosPrivate.post("/order/verify", {
        razorpay_order_id: order.razorpay_order_id,
        razorpay_payment_id: order.razorpay_payment_id,
        razorpay_signature: order.razorpay_signature,
      });

      if (response.data?.status === "ok") {
        // Payment succeeded — drop the script + global so memory is freed
        disposeRazorpay();
        setOrder([]);
        setToast({ message: "Payment successful!", type: "success" });
        navigate("/my-cart");
      } else {
        setToast({
          message: "Payment verification failed. Please try again.",
          type: "error",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setToast({
        message: "Payment could not be verified.",
        type: "error",
      });
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createOrder = useCallback(async (cartItems) => {
    setOrderLoading(true);
    try {
      const response = await axiosPrivate.post("/order/create", {
        cartItems,
      });
      setOrder(response.data.order);
      await displayRazorpay(response.data.order);
    } catch (error) {
      console.error("Error creating order:", error);
      setToast({
        message: "Could not start checkout. Please try again.",
        type: "error",
      });
      navigate("/my-cart");
    } finally {
      setOrderLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayRazorpay = useCallback(async (order) => {
    // Load the checkout script on demand (no longer preloaded in index.html)
    const loaded = await ensureRazorpayLoaded();
    if (!loaded || !window.Razorpay) {
      setToast({
        message: "Payment gateway failed to load. Please try again.",
        type: "error",
      });
      setOrder({});
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TM5m7ecG4OBS8H",
      amount: order.amount, // Amount is in currency subunits.
      currency: order.currency,
      name: "GenZ Fashion",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.id,
      handler: function (response) {
        paymentVerification(response);
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    try {
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Razorpay failed to open:", error);
      setToast({
        message: "Could not open the payment window.",
        type: "error",
      });
      setOrder({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContext.Provider
      value={{
        heroImgDesktop,
        heroImgMobile,
        darkMode,
        setDarkMode,
        toggleDark,
        toast,
        setToast,
        selectedProduct,
        setSelectedProduct,
        activeFilter,
        setActiveFilter,
        currentView,
        setCurrentView,
        wishlist,
        setWishlist,
        toggleWishlist,
        products,
        productsLoading,
        getProducts,
        setProducts,
        sellerProducts,
        setSellerProducts,
        getSellerProducts,
        sellerOrders,
        getSellerOrders,
        updateSellerProduct,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        setCart,
        cartOpen,
        setCartOpen,
        cartItems,
        cartLoading,
        setCartItems,
        fetchCartItems,
        createOrder,
        order,
        setOrder,
        orderLoading,
        fetchOrders,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
