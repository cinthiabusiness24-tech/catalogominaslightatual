import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Tag, TrendingUp, Plus, CreditCard as Edit2, Eye } from 'lucide-react';
import { supabase, DbProduct } from '../../lib/supabase';

interface DashboardProps {
  navigate: (to: string) => void;
}

interface Stats {
  total: number;
  active: number;
  inactive: number;
  featured: number;
  categories: number;
}

function StatCard({
  icon: Icon, label, value, sub, color, delay,
}: {
  icon: React.ElementType; label: string; value: number | string;
  sub?: string; color: string; delay: number;
}) {
  return (
    <motion.div
      className="bg-cream-100 border border-beige-200 p-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 flex items-center justify-center ${color}`}>
          <Icon size={18} strokeWidth={1.5} />
        </div>
      </div>
      <p className="font-display text-3xl text-stone-800 font-light">{value}</p>
      <p className="font-body text-xs text-stone-500 mt-1">{label}</p>
      {sub && <p className="font-body text-[10px] text-stone-400 mt-0.5">{sub}</p>}
    </motion.div>
  );
}

function SkeletonStat() {
  return (
    <div className="bg-cream-100 border border-beige-200 p-6 animate-pulse">
      <div className="w-10 h-10 bg-beige-300 rounded mb-4" />
      <div className="h-8 w-16 bg-beige-300 rounded mb-2" />
      <div className="h-3 w-24 bg-beige-200 rounded" />
    </div>
  );
}

export default function Dashboard({ navigate }: DashboardProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [{ data: products }, { data: recent }] = await Promise.all([
        supabase.from('products').select('id, status, is_featured, category'),
        supabase
          .from('products')
          .select('id, name, category, status, created_at, product_images(*)')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      if (products) {
        const cats = new Set(products.map((p: DbProduct) => p.category));
        setStats({
          total: products.length,
          active: products.filter((p: DbProduct) => p.status === 'active').length,
          inactive: products.filter((p: DbProduct) => p.status === 'inactive').length,
          featured: products.filter((p: DbProduct) => p.is_featured).length,
          categories: cats.size,
        });
      }
      if (recent) setRecent(recent as DbProduct[]);
      setLoading(false);
    }

    fetchData();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.h1
            className="font-display text-3xl text-stone-800 font-light"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Dashboard
          </motion.h1>
          <motion.p
            className="font-body text-xs text-stone-400 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Visão geral da plataforma Minas Light
          </motion.p>
        </div>
        <motion.button
          onClick={() => navigate('/admin/products/new')}
          className="btn-luxury flex items-center gap-2 bg-stone-800 text-cream-100 px-5 py-2.5 hover:bg-stone-900 transition-colors"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Plus size={14} strokeWidth={1.5} />
          <span className="hidden sm:inline">Novo Produto</span>
        </motion.button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonStat key={i} />)
        ) : (
          <>
            <StatCard
              icon={Package}
              label="Total de produtos"
              value={stats?.total ?? 0}
              sub={`${stats?.active} ativos, ${stats?.inactive} inativos`}
              color="bg-stone-100 text-stone-600"
              delay={0.1}
            />
            <StatCard
              icon={Eye}
              label="Produtos ativos"
              value={stats?.active ?? 0}
              sub="Visíveis no catálogo"
              color="bg-green-50 text-green-600"
              delay={0.15}
            />
            <StatCard
              icon={Tag}
              label="Categorias"
              value={stats?.categories ?? 0}
              sub="Tipos de produto"
              color="bg-amber-50 text-amber-600"
              delay={0.2}
            />
            <StatCard
              icon={TrendingUp}
              label="Em destaque"
              value={stats?.featured ?? 0}
              sub="No topo do catálogo"
              color="bg-blue-50 text-blue-500"
              delay={0.25}
            />
          </>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <motion.button
          onClick={() => navigate('/admin/products/new')}
          className="flex items-center gap-4 p-5 bg-stone-800 text-cream-100 hover:bg-stone-900 transition-colors group text-left"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-12 h-12 border border-stone-600 flex items-center justify-center group-hover:border-gold-400 transition-colors">
            <Plus size={20} strokeWidth={1} className="text-gold-300" />
          </div>
          <div>
            <p className="font-display text-xl font-light">Cadastrar Produto</p>
            <p className="font-body text-xs text-stone-400 mt-0.5">
              Adicionar novo produto ao catálogo
            </p>
          </div>
        </motion.button>

        <motion.button
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-4 p-5 bg-cream-100 border border-beige-200 hover:border-stone-300 transition-colors group text-left"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="w-12 h-12 border border-beige-300 flex items-center justify-center group-hover:border-gold-400 transition-colors">
            <Edit2 size={18} strokeWidth={1} className="text-gold-400" />
          </div>
          <div>
            <p className="font-display text-xl text-stone-800 font-light">Gerenciar Produtos</p>
            <p className="font-body text-xs text-stone-400 mt-0.5">
              Editar, ativar ou remover produtos
            </p>
          </div>
        </motion.button>
      </div>

      {/* Recent products */}
      <motion.div
        className="bg-cream-100 border border-beige-200"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-beige-200">
          <h2 className="font-display text-xl text-stone-800 font-light">
            Produtos Recentes
          </h2>
          <button
            onClick={() => navigate('/admin/products')}
            className="font-body text-xs text-stone-400 hover:text-stone-700 transition-colors"
          >
            Ver todos
          </button>
        </div>

        {loading ? (
          <div className="divide-y divide-beige-100">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-6 py-4 animate-pulse flex items-center gap-4">
                <div className="w-12 h-12 bg-beige-300 rounded flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-beige-300 rounded w-2/5 mb-2" />
                  <div className="h-3 bg-beige-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-body text-sm text-stone-400">Nenhum produto cadastrado ainda.</p>
            <button
              onClick={() => navigate('/admin/products/new')}
              className="btn-luxury mt-4 inline-flex items-center gap-2 border border-stone-700 text-stone-700 px-5 py-2 text-xs hover:bg-stone-800 hover:text-cream-100 transition-all"
            >
              <Plus size={12} /> Cadastrar primeiro produto
            </button>
          </div>
        ) : (
          <div className="divide-y divide-beige-100">
            {recent.map((p) => {
              const img = (p.product_images as any[])?.find((i: any) => i.is_primary)?.url
                || (p.product_images as any[])?.[0]?.url;
              return (
                <div key={p.id} className="px-6 py-4 flex items-center gap-4 hover:bg-beige-100 transition-colors">
                  <div className="w-12 h-12 flex-shrink-0 bg-beige-200 overflow-hidden">
                    {img ? (
                      <img src={img} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={16} className="text-stone-400" strokeWidth={1} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-stone-700 truncate">{p.name}</p>
                    <p className="font-body text-[10px] text-stone-400 mt-0.5">{p.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-body text-[9px] tracking-[0.15em] uppercase px-2 py-1 ${
                        p.status === 'active'
                          ? 'bg-green-50 text-green-600'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {p.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                    <button
                      onClick={() => navigate(`/admin/products/${p.id}`)}
                      className="font-body text-[10px] text-stone-400 hover:text-stone-700 transition-colors flex items-center gap-1"
                    >
                      <Edit2 size={12} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
