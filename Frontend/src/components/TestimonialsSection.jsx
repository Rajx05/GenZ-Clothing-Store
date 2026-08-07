import React from 'react';
import { motion } from 'framer-motion';
import { TESTIMONIALS } from '../data/constants';
import { StarRating } from './StarRating';

export function TestimonialsSection() {
    return (
        <section className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="text-xs tracking-[0.3em] text-brand-600 dark:text-brand-400 font-medium">WHAT PEOPLE SAY</span>
                    <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">Customer Love</h2>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            whileHover={{ y: -5 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-700"
                        >
                            <StarRating rating={t.rating} />
                            <p className="text-sm leading-relaxed mt-4 mb-6 text-gray-600 dark:text-gray-300">&ldquo;{t.text}&rdquo;</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-200 dark:bg-brand-800 flex items-center justify-center text-sm font-bold text-brand-800 dark:text-brand-200">
                                    {t.avatar}
                                </div>
                                <span className="font-medium text-sm">{t.name}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
