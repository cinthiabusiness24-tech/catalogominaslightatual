import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Product } from '../types';
import { usePublicProducts } from '../hooks/usePublicProducts';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/3] bg-beige-300 mb-4" />
      <div className="h-3 bg-beige-300 rounded w-1/3 mb-2" />
      <div className="h-4 bg-beige-300 rounded w-3/4 mb-2" />
      <div className="h-3 bg-beige-200 rounded w-full" />
    </div>
  );
}

export default function Catalog() {
  const { products, categories, loading } = usePublicProducts();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === 'Todos' || p.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.lightType.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [products, search, activeCategory]);

  return (
    <section id="catalogo" className="py-24 lg:py-32 bg-cream-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-body text-[10px] tracking-[0.35em] uppercase text-gold-400 mb-3">
            Catálogo de Produtos
          </p>
          <h2 className="font-display text-4xl lg:text-5xl text-stone-800 font-light">
            Iluminação de Alto Padrão
          </h2>
          <div className="divider-gold mt-5 max-w-32" />
        </motion.div>

        {/* Search & Filters */}
        {!loading && (
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative flex-1 max-w-md">
              <Search
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                strokeWidth={1.5}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar produto, categoria, tipo..."
                className="w-full pl-11 pr-10 py-3 bg-cream-200 border border-beige-300 text-stone-700 placeholder-stone-400 font-body text-sm focus:outline-none focus:border-gold-300 transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="sm:hidden flex items-center gap-2 px-4 py-3 border border-beige-300 text-stone-600 bg-cream-200 text-xs tracking-[0.15em] uppercase font-body"
            >
              <SlidersHorizontal size={14} strokeWidth={1.5} />
              Filtrar
            </button>

            <div className={`flex flex-wrap gap-2 ${filterOpen ? 'flex' : 'hidden sm:flex'}`}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-[10px] tracking-[0.18em] uppercase font-body transition-all duration-250 border ${
                    activeCategory === cat
                      ? 'bg-stone-800 text-cream-100 border-stone-800'
                      : 'bg-transparent text-stone-500 border-beige-300 hover:border-stone-400 hover:text-stone-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results count */}
        {!loading && (search || activeCategory !== 'Todos') && (
          <p className="font-body text-xs text-stone-400 mb-6">
            {filtered.length} produto{filtered.length !== 1 ? 's' : ''} encontrado
            {filtered.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="font-display text-2xl text-stone-400 font-light">
              Nenhum produto encontrado
            </p>
            <p className="font-body text-sm text-stone-400 mt-2">
              Tente outro termo ou categoria
            </p>
          </div>
        )}
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </section>
  );
}
