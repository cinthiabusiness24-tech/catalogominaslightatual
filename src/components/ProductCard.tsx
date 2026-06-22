import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, MessageCircle } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  index: number;
}

export default function ProductCard({ product, onClick, index }: ProductCardProps) {
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = `Olá! Tenho interesse no produto *${product.name}* (${product.category}) da Minas Light. Poderia me passar mais informações?`;
    window.open(`https://wa.me/553534220999?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleAddCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
  };

  return (
    <motion.div
      className="group cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Image container */}
      <div className="relative overflow-hidden aspect-[4/3] bg-beige-200 mb-4">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          loading="lazy"
        />

        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-stone-900/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Tag */}
        {product.tag && (
          <div className="absolute top-3 left-3">
            <span className="font-body text-[10px] tracking-[0.2em] uppercase bg-gold-300 text-stone-900 px-2.5 py-1">
              {product.tag}
            </span>
          </div>
        )}

        {/* Actions overlay */}
        <motion.div
          className="absolute bottom-3 left-3 right-3 flex gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={handleWhatsApp}
            className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white py-2.5 text-[10px] tracking-[0.15em] uppercase font-body hover:bg-green-700 transition-colors"
          >
            <MessageCircle size={12} />
            WhatsApp
          </button>
          <button
            onClick={handleAddCart}
            className="flex-1 flex items-center justify-center gap-1.5 bg-gold-300 text-stone-900 py-2.5 text-[10px] tracking-[0.15em] uppercase font-body hover:bg-gold-400 transition-colors"
          >
            <ShoppingBag size={12} />
            Carrinho
          </button>
        </motion.div>

        {/* View icon */}
        <motion.div
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-cream-100/90 text-stone-700"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
          transition={{ duration: 0.25 }}
        >
          <Eye size={14} strokeWidth={1.5} />
        </motion.div>
      </div>

      {/* Info */}
      <div className="px-0.5">
        <span className="font-body text-[10px] tracking-[0.2em] uppercase text-gold-400">
          {product.category}
        </span>
        <h3 className="font-display text-lg text-stone-700 font-light mt-0.5 group-hover:text-stone-900 transition-colors leading-tight">
          {product.name}
        </h3>
        <p className="font-body text-xs text-stone-400 leading-relaxed mt-1.5 line-clamp-2">
          {product.shortDescription}
        </p>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="font-body text-[10px] tracking-[0.15em] uppercase text-stone-400">
            {product.lightType}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
