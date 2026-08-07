import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handler = () => setVisible(window.scrollY > 500);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-2xl flex items-center justify-center"
                    aria-label="Back to top"
                >
                    <i className="fas fa-arrow-up"></i>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
