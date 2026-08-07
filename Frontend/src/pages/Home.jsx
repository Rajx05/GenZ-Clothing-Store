import React from "react";
import { Link } from "react-router-dom";
import { HeroSection } from "../components/HeroSection";
import { CategoriesSection } from "../components/CategoriesSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { InstagramSection } from "../components/InstagramSection";
import { NewsletterSection } from "../components/NewsletterSection";
import { ProductCard } from "../components/ProductCard";
import { PRODUCTS } from "../data/constants";

export default function Home() {
  // Show top 4 products as featured
  const featuredProducts = PRODUCTS.slice(0, 4);

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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>
      <CategoriesSection />

      <TestimonialsSection />
      <InstagramSection />
      <NewsletterSection />
    </div>
  );
}
