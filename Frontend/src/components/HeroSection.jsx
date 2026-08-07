import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useApp from "../hooks/useApp";

export function HeroSection() {
  const { heroImgDesktop, heroImgMobile } = useApp();

  return (
    <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
      <picture>
        <source media="(max-width: 768px)" srcSet={heroImgMobile} />

        <img
          src={heroImgDesktop}
          alt="Hero fashion"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </picture>
      <div className="hero-overlay absolute inset-0"></div>

      <div className="relative z-10 h-full flex items-start ">
        <div className="max-w-7xl mx-auto my-3 absolute bottom-0 px-4 sm:px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl"
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="font-display text-4xl sm:text-5xl md:text-7xl text-white font-bold leading-tight mb-6"
            >
              Elevate Your
              <br />
              <span className="italic font-normal">Everyday</span> Style
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-white/75 text-sm sm:text-base mb-8 max-w-md leading-relaxed"
            >
              Discover our curated collection of premium essentials crafted from
              the finest materials for the modern wardrobe.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/shop"
                className="btn-ripple px-8 py-3.5 bg-white text-gray-900 rounded-full text-sm font-semibold tracking-wide hover:bg-gray-100 transition shadow-xl"
              >
                SHOP COLLECTION
              </Link>
              <motion.a
                href="#categories"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 border-2 border-white/50 text-white rounded-full text-sm font-semibold tracking-wide hover:bg-white/10 transition"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("categories")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                EXPLORE
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/60 rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
}
