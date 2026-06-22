import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-stone-800"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.div
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="w-8 h-8"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="14" stroke="#B8945A" strokeWidth="1" strokeDasharray="4 2" />
                  <circle cx="16" cy="16" r="6" fill="#B8945A" opacity="0.3" />
                  <circle cx="16" cy="16" r="2" fill="#B8945A" />
                </svg>
              </motion.div>
              <div className="font-display text-3xl font-light tracking-[0.25em] text-cream-100">
                MINAS LIGHT
              </div>
            </div>

            <div className="w-48 h-px bg-stone-600 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-transparent via-gold-300 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.4, delay: 0.5, ease: 'easeInOut' }}
              />
            </div>

            <p className="font-body text-xs tracking-[0.3em] text-stone-400 uppercase">
              Iluminação Premium
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
