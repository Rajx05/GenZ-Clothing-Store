import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faCircleExclamation,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

export function Toast({ message, type, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className={`fixed top-24 right-4 z-[100] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 
                ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
        >
            <FontAwesomeIcon
              icon={type === 'success' ? faCircleCheck : faCircleExclamation}
            />
            <span className="font-medium text-sm">{message}</span>
            <button onClick={onClose} className="ml-2 hover:opacity-70">
              <FontAwesomeIcon icon={faXmark} />
            </button>
        </motion.div>
    );
}
