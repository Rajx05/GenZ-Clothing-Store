import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

export function InstagramSection() {
  const images = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=400&h=400&fit=crop&q=80",
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-xs tracking-[0.3em] text-brand-600 dark:text-brand-400 font-medium">
            FOLLOW US
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">
            @genzstore.official
          </h2>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.03 }}
              className="aspect-square rounded-xl overflow-hidden cursor-pointer relative group"
            >
              <img
                src={img}
                alt="Instagram"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faInstagram}
                  className="text-white text-2xl opacity-0 group-hover:opacity-100 transition"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
