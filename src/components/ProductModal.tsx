import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, MessageCircle, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setActiveImg(0);
    setAdded(false);
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  const handleAddCart = () => {
    if (!product) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!product) return;
    const msg = `Olá! Tenho interesse no produto *${product.name}* (${product.category}) da Minas Light.\n\nMaterial: ${product.material}\nTipo de Iluminação: ${product.lightType}\n\nPoderia me enviar mais informações sobre disponibilidade e valores?`;
    window.open(`https://wa.me/553534220999?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const nextImg = () => {
    if (!product) return;
    setActiveImg((i) => (i + 1) % product.gallery.length);
  };

  const prevImg = () => {
    if (!product) return;
    setActiveImg((i) => (i - 1 + product.gallery.length) % product.gallery.length);
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end lg:items-center justify-center p-0 lg:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-stone-900/70"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="relative z-10 w-full max-w-5xl max-h-[95vh] lg:max-h-[90vh] bg-cream-100 overflow-y-auto flex flex-col lg:flex-row"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center bg-cream-100 text-stone-600 hover:text-stone-900 transition-colors shadow-sm"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            {/* Gallery */}
            <div className="lg:w-1/2 flex-shrink-0">
              <div className="relative aspect-square lg:aspect-auto lg:h-full overflow-hidden bg-beige-200">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImg}
                    src={product.gallery[activeImg]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  />
                </AnimatePresence>

                {product.gallery.length > 1 && (
                  <>
                    <button
                      onClick={prevImg}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-cream-100/80 text-stone-700 hover:bg-cream-100 transition-colors"
                    >
                      <ChevronLeft size={18} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={nextImg}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-cream-100/80 text-stone-700 hover:bg-cream-100 transition-colors"
                    >
                      <ChevronRight size={18} strokeWidth={1.5} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {product.gallery.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImg(i)}
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            i === activeImg ? 'bg-gold-300' : 'bg-cream-200'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col">
              <span className="font-body text-[10px] tracking-[0.25em] uppercase text-gold-400">
                {product.category}
              </span>

              <h2 className="font-display text-3xl lg:text-4xl text-stone-800 font-light mt-2 leading-tight">
                {product.name}
              </h2>

              <div className="divider-gold my-5" />

              <p className="font-body text-sm text-stone-500 leading-relaxed">
                {product.fullDescription}
              </p>

              {/* Environments */}
              <div className="mt-5">
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-2.5">
                  Ambientes Ideais
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.idealEnvironments.map((env) => (
                    <span
                      key={env}
                      className="font-body text-[10px] tracking-[0.1em] px-2.5 py-1 bg-beige-200 text-stone-600"
                    >
                      {env}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-auto pt-8 flex flex-col gap-3">
                <button
                  onClick={handleWhatsApp}
                  className="btn-luxury flex items-center justify-center gap-2.5 bg-green-600 text-white py-4 hover:bg-green-700 transition-colors"
                >
                  <MessageCircle size={15} />
                  Solicitar via WhatsApp
                </button>
                <button
                  onClick={handleAddCart}
                  className={`btn-luxury flex items-center justify-center gap-2.5 border py-4 transition-all ${
                    added
                      ? 'border-green-600 text-green-700 bg-green-50'
                      : 'border-stone-700 text-stone-700 hover:bg-stone-800 hover:text-cream-100 hover:border-stone-800'
                  }`}
                >
                  {added ? (
                    <>
                      <Check size={15} />
                      Adicionado ao Carrinho
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={15} />
                      Adicionar ao Carrinho
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
