import React, { useState } from "react";
import { motion } from "framer-motion";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gray-300 dark:bg-gray-800 text-black dark:text-white  relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs tracking-[0.3em] dark:text-brand-400 font-medium">
            JOIN THE CLUB
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">
            Stay in the Loop
          </h2>
          <p className="dark:text-gray-400 text-sm mb-8">
            Subscribe for exclusive access to new arrivals, special offers, and
            style inspiration.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="newsletter-input flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-gray-900/20 dark:border-white/20 dark:text-white placeholder-gray-400 text-sm"
              required
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="px-8 py-3.5  bg-white dark:text-gray-900 rounded-xl font-semibold text-sm tracking-wide hover:bg-gray-400 transition"
            >
              {subscribed ? (
                <>
                  <i className="fas fa-check mr-2"></i>SUBSCRIBED!
                </>
              ) : (
                "SUBSCRIBE"
              )}
            </motion.button>
          </form>

          <p className="text-[11px] text-gray-500 mt-4">
            No spam, ever. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
