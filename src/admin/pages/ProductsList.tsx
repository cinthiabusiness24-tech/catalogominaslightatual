import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, CreditCard as Edit2, Trash2, X, Eye, EyeOff } from 'lucide-react';
import { supabase, DbProduct } from '../../lib/supabase';

interface ProductsListProps {
  navigate: (to: string) => void;
}

export default function ProductsList({ navigate }: ProductsListProps) {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (data) setProducts(data as DbProduct[]);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);

  const filtered = products.filter((p) => {
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchCat = !filterCategory || p.category === filterCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    return matchStatus && matchCat && matchSearch;
  });

  const toggleStatus = async (p: DbProduct) => {
    const newStatus = p.status === 'active' ? 'inactive' : 'active';
    await supabase.from('products').update({ status: newStatus }).eq('id', p.id);
    setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: newStatus } : x)));
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await supabase.from('products').delete().eq('id', id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
    setConfirmDelete(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <motion.h1
            className="font-display text-3xl text-stone-800 font-light"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Produtos
          </motion.h1>
          <p className="font-body text-xs text-stone-400 mt-1">
            {products.length} produto{products.length !== 1 ? 's' : ''} cadastrado{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="btn-luxury flex items-center gap-2 bg-stone-800 text-cream-100 px-5 py-2.5 hover:bg-stone-900 transition-colors self-start"
        >
          <Plus size={14} strokeWidth={1.5} />
          Novo Produto
        </button>
      </div>

      {/* Filters */}
      <div className="bg-cream-100 border border-beige-200 p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" strokeWidth={1.5} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou categoria..."
            className="w-full pl-9 pr-4 py-2.5 bg-cream-200 border border-beige-300 text-stone-700 placeholder-stone-300 font-body text-sm focus:outline-none focus:border-gold-300 transition-colors"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
          className="px-3 py-2.5 bg-cream-200 border border-beige-300 text-stone-600 font-body text-sm focus:outline-none focus:border-gold-300 transition-colors"
        >
          <option value="all">Todos status</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>
        {categories.length > 0 && (
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2.5 bg-cream-200 border border-beige-300 text-stone-600 font-body text-sm focus:outline-none focus:border-gold-300 transition-colors"
          >
            <option value="">Todas categorias</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}
        {(search || filterStatus !== 'all' || filterCategory) && (
          <button
            onClick={() => { setSearch(''); setFilterStatus('all'); setFilterCategory(''); }}
            className="flex items-center gap-1.5 px-3 py-2.5 text-stone-400 hover:text-stone-700 font-body text-xs border border-beige-300 transition-colors"
          >
            <X size={12} /> Limpar
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-cream-100 border border-beige-200 overflow-hidden">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-6 py-3 border-b border-beige-200 bg-beige-100">
          <span className="w-14" />
          <span className="font-body text-[10px] tracking-[0.2em] uppercase text-stone-500">Produto</span>
          <span className="font-body text-[10px] tracking-[0.2em] uppercase text-stone-500 text-center w-20">Status</span>
          <span className="font-body text-[10px] tracking-[0.2em] uppercase text-stone-500 text-center w-12">Ordem</span>
          <span className="w-20" />
        </div>

        {loading ? (
          <div className="divide-y divide-beige-100">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
                <div className="w-14 h-14 bg-beige-300 flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-beige-300 rounded w-2/5 mb-2" />
                  <div className="h-3 bg-beige-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-body text-sm text-stone-400">
              {search || filterStatus !== 'all' || filterCategory
                ? 'Nenhum produto encontrado com esses filtros.'
                : 'Nenhum produto cadastrado ainda.'}
            </p>
            {!search && filterStatus === 'all' && !filterCategory && (
              <button
                onClick={() => navigate('/admin/products/new')}
                className="btn-luxury mt-4 inline-flex items-center gap-2 border border-stone-700 text-stone-700 px-5 py-2 text-xs hover:bg-stone-800 hover:text-cream-100 transition-all"
              >
                <Plus size={12} /> Cadastrar produto
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-beige-100">
            {filtered.map((p, i) => {
              const img = (p.product_images as any[])?.find((x: any) => x.is_primary)?.url
                || (p.product_images as any[])?.[0]?.url;
              return (
                <motion.div
                  key={p.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-beige-100 transition-colors"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  {/* Image */}
                  <div className="w-14 h-14 flex-shrink-0 bg-beige-200 overflow-hidden">
                    {img ? (
                      <img src={img} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <Plus size={16} strokeWidth={1} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-stone-800 font-medium truncate">{p.name}</p>
                    <p className="font-body text-[10px] text-stone-400 mt-0.5">{p.category}</p>
                    {p.tag && (
                      <span className="font-body text-[9px] tracking-[0.1em] uppercase bg-gold-100 text-gold-500 px-2 py-0.5 mt-1 inline-block">
                        {p.tag}
                      </span>
                    )}
                  </div>

                  {/* Status */}
                  <button
                    onClick={() => toggleStatus(p)}
                    className={`flex items-center gap-1.5 font-body text-[10px] px-2.5 py-1.5 transition-colors ${
                      p.status === 'active'
                        ? 'bg-green-50 text-green-600 hover:bg-green-100'
                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                    }`}
                    title={p.status === 'active' ? 'Clique para desativar' : 'Clique para ativar'}
                  >
                    {p.status === 'active' ? (
                      <><Eye size={11} strokeWidth={1.5} /> Ativo</>
                    ) : (
                      <><EyeOff size={11} strokeWidth={1.5} /> Inativo</>
                    )}
                  </button>

                  {/* Order */}
                  <span className="font-body text-xs text-stone-400 w-8 text-center hidden sm:block">
                    {p.display_order}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => navigate(`/admin/products/${p.id}`)}
                      className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-800 hover:bg-beige-200 transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={14} strokeWidth={1.5} />
                    </button>
                    {confirmDelete === p.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deleting === p.id}
                          className="font-body text-[10px] bg-red-500 text-white px-2 py-1 hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          {deleting === p.id ? '...' : 'Confirmar'}
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="font-body text-[10px] bg-beige-200 text-stone-600 px-2 py-1 hover:bg-beige-300 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(p.id)}
                        className="w-8 h-8 flex items-center justify-center text-stone-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {filtered.length > 0 && (
        <p className="font-body text-[10px] text-stone-400 mt-3 text-right">
          Exibindo {filtered.length} de {products.length} produto{products.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
