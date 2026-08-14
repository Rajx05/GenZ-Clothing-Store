import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { HeroSection } from "../components/HeroSection";
import { CategoriesSection } from "../components/CategoriesSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { InstagramSection } from "../components/InstagramSection";
import { NewsletterSection } from "../components/NewsletterSection";
import { ProductCard } from "../components/ProductCard";
import { ProductCardSkeleton } from "../components/Skeleton";
import useApp from "../hooks/useApp";

export default function Home() {
  const { getProducts } = useApp();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real products from the API so card links (/product/:id) resolve
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const products = await getProducts({ limit: 4, sortBy: "" });
        if (!cancelled) setFeaturedProducts(products || []);
      } catch {
        // ignore — the empty state below handles offline/unavailable backend
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [getProducts]);

  return (
    <div>
      <HeroSection />
      {/* <FeaturesBar /> */}
      {/* Featured Products Section */}
      <section className="py-16 md:py-20 bg-gray-100 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10">
            <div className="text-left">
              <span className="text-xs tracking-[0.3em] text-brand-600 dark:text-brand-400 font-medium uppercase">
                Curated Selection
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">
                Featured Products
              </h2>
            </div>
            <Link
              to="/shop"
              className="mt-4 sm:mt-0 px-6 py-3 border border-gray-900 dark:border-white rounded-xl text-xs font-semibold tracking-wider hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-colors"
            >
              VIEW ALL PRODUCTS
            </Link>
          </div>

          {loading ? (
            <div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              aria-busy="true"
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} index={i} />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <FontAwesomeIcon
                icon={faBoxOpen}
                className="text-4xl text-gray-300 dark:text-gray-600 mb-4"
              />
              <p className="text-gray-500 dark:text-gray-400">
                Couldn&apos;t load featured products right now.
              </p>
              <Link
                to="/shop"
                className="mt-6 inline-block px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-xs font-semibold tracking-wider transition hover:bg-gray-800 dark:hover:bg-gray-100"
              >
                BROWSE THE COLLECTION
              </Link>
            </div>
          )}
        </div>
      </section>
      <CategoriesSection />

      <TestimonialsSection />
      <InstagramSection />
      <NewsletterSection />
    </div>
  );
}
