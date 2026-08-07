import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  const shopLinks = [
    { label: "New Arrivals", path: "/shop?badge=New" },
    { label: "Best Sellers", path: "/shop?badge=Best+Seller" },
    { label: "Dresses", path: "/shop?category=Dresses" },
    { label: "Outerwear", path: "/shop?category=Outerwear" },
    { label: "Sale", path: "/shop?category=Sale" },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/">
              <h3 className="font-display text-2xl font-bold mb-1">GenZ</h3>
              <p className="text-[10px] tracking-[0.35em] text-gray-500 dark:text-gray-400 mb-4">
                Latest Trending Fashion
              </p>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
              Curating the finest in modern fashion since 2020.
            </p>
            <div className="flex gap-3">
              {[
                "fa-instagram",
                "fa-twitter",
                "fa-facebook-f",
                "fa-pinterest-p",
                "fa-tiktok",
              ].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition text-sm"
                >
                  <i className={`fab ${icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-700 dark:hover:text-brand-400 transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Help</h4>
            <ul className="space-y-2.5">
              {[
                "Contact Us",
                "FAQs",
                "Shipping Info",
                "Returns",
                "Size Guide",
              ].map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-700 dark:hover:text-brand-400 transition"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                "About Us",
                "Careers",
                "Sustainability",
                "Press",
                "Privacy Policy",
              ].map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-700 dark:hover:text-brand-400 transition"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © 2026 GenZ All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <i className="fab fa-cc-visa text-2xl text-gray-400"></i>
            <i className="fab fa-cc-mastercard text-2xl text-gray-400"></i>
            <i className="fab fa-cc-amex text-2xl text-gray-400"></i>
            <i className="fab fa-cc-apple-pay text-2xl text-gray-400"></i>
            <i className="fab fa-google-pay text-2xl text-gray-400"></i>
          </div>
        </div>
      </div>
    </footer>
  );
}
