import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faChevronRight,
  faArrowLeft,
  faMinus,
  faPlus,
  faBagShopping,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import useApp from "../hooks/useApp";
import { StarRating } from "../components/StarRating";
import { Skeleton } from "../components/Skeleton";
import axios from "../api/axios";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useApp();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError(true);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(false);
      setProduct(null);
      try {
        const res = await axios.get(`/products/get-by-id/${id}`);

        const data = await res.data;
        setProduct(data);
      } catch (err) {
        console.log("error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setSelectedSize(product.sizes[1] || product.sizes[0]);
      setSelectedColor(0);
      setQuantity(1);
    }
  }, [id, product]);

  if (loading) {
    return (
      <div
        className="py-4 md:py-6"
        aria-busy="true"
        aria-label="Loading product"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-3 w-12 rounded" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-28 rounded" />
          </div>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            <Skeleton className="w-full max-w-md mx-auto lg:max-w-none lg:w-[400px] xl:w-[440px] aspect-[3/4] rounded-3xl shrink-0" />
            <div className="w-full lg:flex-1 space-y-4 pt-2">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-9 w-3/4 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-8 w-28 rounded mt-2" />
              <Skeleton className="h-16 w-full rounded mt-4" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-10 w-12 rounded-xl" />
                <Skeleton className="h-10 w-12 rounded-xl" />
                <Skeleton className="h-10 w-12 rounded-xl" />
                <Skeleton className="h-10 w-12 rounded-xl" />
              </div>
              <Skeleton className="h-12 w-full rounded-xl mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <FontAwesomeIcon
          icon={faCircleExclamation}
          className="text-5xl text-red-500 mb-4 animate-bounce"
        />
        <h2 className="text-2xl font-bold font-display mb-4">
          Product Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/shop"
          className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const isWished = wishlist && wishlist.includes(product._id);

  // Get related products from same category
  // const relatedProducts = product
  //   .filter((p) => p.category === p.category && p._id !== p._id)
  //   .slice(0, 4);

  return (
    <div className="py-4 md:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4 overflow-x-auto whitespace-nowrap pb-1">
          <Link
            to="/"
            className="hover:text-brand-600 dark:hover:text-brand-400 transition"
          >
            Home
          </Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[9px]" />
          <Link
            to="/shop"
            className="hover:text-brand-600 dark:hover:text-brand-400 transition"
          >
            Shop
          </Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[9px]" />
          <Link
            to={`/shop?category=${product.category}`}
            className="hover:text-brand-600 dark:hover:text-brand-400 transition"
          >
            {product.category}
          </Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[9px]" />
          <span className="font-medium text-gray-900 dark:text-white truncate">
            {product.name}
          </span>
        </nav>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-semibold mb-4 hover:text-brand-600 dark:hover:text-brand-400 transition group"
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back
        </button>

        {/* Product Section */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-center">
          {/* Left Column: Image */}
          <div className="w-full max-w-md mx-auto lg:max-w-none lg:w-[400px] xl:w-[440px] shrink-0 relative rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-xl group aspect-[3/4] lg:h-[500px] xl:h-[540px] lg:aspect-auto">
            <img
              src={product.image[0].url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {product.badge && (
              <span
                className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-lg ${
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
          </div>

          {/* Right Column: Info */}
          <div className="w-full lg:flex-1 flex flex-col justify-start lg:max-h-[500px] xl:max-h-[540px] lg:overflow-y-auto pr-2 custom-scrollbar">
            <span className="text-[10px] tracking-[0.2em] text-brand-600 dark:text-brand-400 font-semibold uppercase">
              {product.category}
            </span>

            <h1 className="font-display text-2xl md:text-3xl font-bold mt-1 mb-2 tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-3">
              <StarRating rating={product.rating} />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl md:text-3xl font-bold">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg price-original text-gray-400">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-xs text-red-500 font-semibold bg-red-50 dark:bg-red-500/10 px-2.5 py-0.5 rounded-full">
                    Save ₹{product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2 border-b border-gray-100 dark:border-gray-800 pb-4">
              {product.description || "No description available."}
            </p>
            <div className="text-sm text-gray-600 dark:text-gray-400 gap-2 flex flex-col p-2 mb-4 border-b border-gray-100 dark:border-gray-800">
              <div>Seller: {product.user.name}</div>

              <div>email: {product.user.email}</div>
            </div>
            {/* Color Selector */}
            <div className="mb-4">
              <p className="text-xs font-semibold mb-2">Color</p>
              <div className="flex gap-2">
                {product.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      selectedColor === i
                        ? "border-brand-600 scale-110 shadow-md ring-2 ring-brand-500/10"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${i + 1}`}
                  ></button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold">Size</p>
                <button className="text-[10px] text-brand-600 dark:text-brand-400 underline">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 rounded-lg text-xs font-medium border-2 transition-all ${
                      selectedSize === size
                        ? "border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-5">
              <p className="text-xs font-semibold mb-2">Quantity</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <FontAwesomeIcon icon={faMinus} className="text-[9px]" />
                </button>
                <span className="w-8 text-center text-sm font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <FontAwesomeIcon icon={faPlus} className="text-[9px]" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  addToCart(
                    id,
                    quantity,
                    selectedSize,
                    product.colors[selectedColor],
                  )
                }
                className="flex-1 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold text-xs tracking-wide hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-lg flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faBagShopping} className="text-xs" />
                ADD TO BAG — ₹{(product.price * quantity).toFixed(2)}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleWishlist(product._id)}
                className={`py-3 px-4 rounded-xl border-2 flex items-center justify-center transition ${
                  isWished
                    ? "border-red-500 bg-red-50 dark:bg-red-500/10"
                    : "border-gray-200 dark:border-gray-700"
                }`}
                aria-label="Add to Wishlist"
              >
                <FontAwesomeIcon
                  icon={isWished ? faHeart : faHeartRegular}
                  className={`${isWished ? "text-red-500" : ""} text-sm`}
                />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {/* {relatedProducts.length > 0 && (
          <div className="mt-20 pt-16 border-t border-gray-100 dark:border-gray-800">
            <div className="mb-10 text-center">
              <span className="text-xs tracking-[0.3em] text-brand-600 dark:text-brand-400 font-semibold uppercase">
                Customers Also Liked
              </span>
              <h2 className="font-display text-3xl font-bold mt-2">
                Related Products
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
