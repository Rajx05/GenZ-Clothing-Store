import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruckFast,
  faRotateLeft,
  faShieldHalved,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";

export function FeaturesBar() {
  const features = [
    { icon: faTruckFast, title: "Free Shipping", desc: "On orders over ₹150" },
    { icon: faRotateLeft, title: "Easy Returns", desc: "30-day return policy" },
    {
      icon: faShieldHalved,
      title: "Secure Payment",
      desc: "100% protected",
    },
    { icon: faHeadset, title: "24/7 Support", desc: "Always here to help" },
  ];

  return (
    <section className="py-8 md:py-4 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 md:justify-center"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon
                  icon={f.icon}
                  className="text-brand-700 dark:text-brand-400"
                />
              </div>
              <div>
                <p className="font-semibold text-sm">{f.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
