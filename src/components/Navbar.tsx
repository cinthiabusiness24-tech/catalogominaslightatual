import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onCartOpen: () => void;
  activeSection: string;
}

const navLinks = [
  { id: 'catalogo', label: 'Catálogo' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'contato', label: 'Contato' },
];

export default function Navbar({ onCartOpen, activeSection }: NavbarProps) {
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'nav-blur bg-cream-100/90 border-b border-beige-200 shadow-sm'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 2.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* h-20 = 80px mobile, lg:h-[90px] = 90px desktop */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 lg:h-[90px] flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 group flex-shrink-0"
          >
            <div className="w-6 h-6 flex-shrink-0">
              <img src="https://i.imgur.com/OGNhHBK.png" alt="Minas Light logo" className="w-full h-full object-contain rounded-sm" />
            </div>
            <span
              className={`font-display text-base lg:text-lg tracking-[0.2em] font-medium transition-colors duration-300 ${
                scrolled ? 'text-stone-700' : 'text-cream-100'
              } group-hover:text-gold-300`}
            >
              MINAS LIGHT
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`relative text-xs tracking-[0.15em] uppercase font-body transition-colors duration-300 group ${
                  scrolled ? 'text-stone-500 hover:text-stone-800' : 'text-cream-300 hover:text-cream-100'
                } ${activeSection === link.id ? (scrolled ? 'text-stone-800' : 'text-cream-100') : ''}`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px bg-gold-300 transition-all duration-300 ${
                    activeSection === link.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={onCartOpen}
              className={`relative p-2 transition-colors duration-300 ${
                scrolled ? 'text-stone-600 hover:text-stone-900' : 'text-cream-200 hover:text-cream-100'
              }`}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {count > 0 && (
                <motion.span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gold-300 text-white text-[10px] flex items-center justify-center font-medium"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  {count}
                </motion.span>
              )}
            </button>

            <button
              onClick={() => scrollTo('contato')}
              className={`hidden lg:block btn-luxury px-6 py-2.5 border transition-all duration-300 ${
                scrolled
                  ? 'border-stone-700 text-stone-700 hover:bg-stone-800 hover:text-cream-100 hover:border-stone-800'
                  : 'border-cream-300 text-cream-100 hover:bg-cream-100 hover:text-stone-800'
              }`}
            >
              Solicitar Projeto
            </button>

            <button
              className={`lg:hidden p-2 transition-colors ${
                scrolled ? 'text-stone-700' : 'text-cream-100'
              }`}
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-stone-900/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-[70] w-72 bg-cream-100 flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: [0.25, 0.46, 0.45, 0.94], duration: 0.4 }}
            >
              <div className="flex items-center justify-between p-6 border-b border-beige-200">
                <span className="font-display text-base tracking-[0.2em] text-stone-700">
                  MINAS LIGHT
                </span>
                <button onClick={() => setMenuOpen(false)} className="text-stone-500">
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
              <nav className="flex flex-col gap-1 p-6">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className="text-left py-3 px-2 text-stone-600 hover:text-stone-900 hover:bg-beige-100 rounded text-sm tracking-[0.1em] uppercase transition-colors border-b border-beige-100"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    {link.label}
                  </motion.button>
                ))}
              </nav>
              <div className="p-6 mt-auto">
                <button
                  onClick={() => { scrollTo('contato'); setMenuOpen(false); }}
                  className="w-full btn-luxury py-3 border border-stone-700 text-stone-700 text-xs tracking-[0.15em]"
                >
                  Solicitar Projeto
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
