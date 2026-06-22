import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, MessageCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartProps {
  open: boolean;
  onClose: () => void;
}

export default function Cart({ open, onClose }: CartProps) {
  const { items, count, removeItem, updateQuantity, openWhatsApp, clearCart } = useCart();

  const handleFinalize = () => {
    openWhatsApp();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90]">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-stone-900/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-cream-100 flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.25, 0.46, 0.45, 0.94], duration: 0.4 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-beige-200">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} strokeWidth={1.5} className="text-stone-600" />
                <h2 className="font-display text-xl text-stone-800 font-light">
                  Seleção
                </h2>
                {count > 0 && (
                  <span className="font-body text-[10px] w-5 h-5 flex items-center justify-center bg-gold-300 text-stone-900 rounded-full">
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-stone-500 hover:text-stone-800 transition-colors"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-8">
                  <div className="w-16 h-16 rounded-full bg-beige-200 flex items-center justify-center">
                    <ShoppingBag size={24} strokeWidth={1} className="text-stone-400" />
                  </div>
                  <p className="font-display text-lg text-stone-500 font-light text-center">
                    Sua seleção está vazia
                  </p>
                  <p className="font-body text-xs text-stone-400 text-center leading-relaxed">
                    Adicione produtos ao carrinho para solicitar um orçamento via WhatsApp.
                  </p>
                  <button
                    onClick={onClose}
                    className="btn-luxury mt-2 border border-stone-700 text-stone-700 px-8 py-3 text-xs hover:bg-stone-800 hover:text-cream-100 transition-all"
                  >
                    Ver Catálogo
                  </button>
                </div>
              ) : (
                <div className="px-8 space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      className="flex gap-4"
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      {/* Image */}
                      <div className="w-20 h-20 flex-shrink-0 overflow-hidden bg-beige-200">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <span className="font-body text-[9px] tracking-[0.2em] uppercase text-gold-400">
                          {item.product.category}
                        </span>
                        <p className="font-display text-sm text-stone-700 font-light leading-snug mt-0.5">
                          {item.product.name}
                        </p>

                        <div className="flex items-center gap-3 mt-2.5">
                          <div className="flex items-center gap-2 border border-beige-300">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-stone-500 hover:text-stone-800 hover:bg-beige-200 transition-colors"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="font-body text-xs w-6 text-center text-stone-700">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-stone-500 hover:text-stone-800 hover:bg-beige-200 transition-colors"
                            >
                              <Plus size={10} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-stone-300 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={13} strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-8 pb-8 pt-4 border-t border-beige-200">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-body text-xs tracking-[0.1em] text-stone-500 uppercase">
                    {count} produto{count !== 1 ? 's' : ''} selecionado{count !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={clearCart}
                    className="font-body text-[10px] text-stone-400 hover:text-red-400 tracking-[0.1em] uppercase transition-colors"
                  >
                    Limpar
                  </button>
                </div>

                <button
                  onClick={handleFinalize}
                  className="btn-luxury w-full flex items-center justify-center gap-3 bg-green-600 text-white py-4 hover:bg-green-700 transition-colors"
                >
                  <MessageCircle size={16} />
                  Finalizar pelo WhatsApp
                </button>

                <p className="font-body text-[10px] text-stone-400 text-center mt-3 leading-relaxed">
                  Você será redirecionado ao WhatsApp com sua seleção formatada
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
