import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../data/constants';

export function CategoriesSection() {
    const navigate = useNavigate();

    return (
        <section id="categories" className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="text-xs tracking-[0.3em] text-brand-600 dark:text-brand-400 font-medium">BROWSE BY</span>
                    <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">Shop Categories</h2>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {CATEGORIES.map((cat, i) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="category-card relative rounded-2xl overflow-hidden cursor-pointer aspect-[3/4] group"
                            onClick={() => {
                                navigate(`/shop?category=${cat.name}`);
                            }}
                        >
                            <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
                                <h3 className="text-white font-semibold text-lg md:text-xl">{cat.name}</h3>
                                <p className="text-white/70 text-xs mt-1">{cat.count} Products</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
