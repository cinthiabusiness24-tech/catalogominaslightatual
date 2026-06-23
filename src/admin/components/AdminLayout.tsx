import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, LogOut, Menu, X, ChevronRight, Settings
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  navigate: (to: string) => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Package, label: 'Produtos', path: '/admin/products' },
];

export default function AdminLayout({ children, currentPath, navigate }: AdminLayoutProps) {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') return currentPath === '/admin';
    return currentPath.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-beige-200">
        <button
          onClick={() => { navigate('/admin'); setSidebarOpen(false); }}
          className="flex items-center gap-3 group"
        >
          <div className="w-7 h-7 flex-shrink-0">
            <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="14" cy="14" r="12" stroke="#B8945A" strokeWidth="1" />
              <circle cx="14" cy="14" r="4.5" fill="#B8945A" opacity="0.3" />
              <circle cx="14" cy="14" r="1.8" fill="#B8945A" />
            </svg>
          </div>
          <div>
            <span className="font-display text-base tracking-[0.18em] text-stone-700">
              MINAS LIGHT
            </span>
            <p className="font-body text-[9px] tracking-[0.2em] uppercase text-stone-400 -mt-0.5">
              Admin
            </p>
          </div>
        </button>
      </div>

      <nav className="flex-1 px-3 py-4">
        <p className="font-body text-[9px] tracking-[0.25em] uppercase text-stone-400 px-3 mb-2">
          Menu
        </p>
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => { navigate(item.path); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded mb-0.5 transition-all group ${
              isActive(item.path)
                ? 'bg-stone-800 text-cream-100'
                : 'text-stone-500 hover:bg-beige-200 hover:text-stone-800'
            }`}
          >
            <item.icon
              size={16}
              strokeWidth={1.5}
              className={isActive(item.path) ? 'text-gold-300' : ''}
            />
            <span className="font-body text-sm flex-1 text-left">{item.label}</span>
            {isActive(item.path) && (
              <ChevronRight size={13} className="text-gold-300" />
            )}
          </button>
        ))}
      </nav>

      <div className="px-3 pb-4 border-t border-beige-200 pt-4">
        <div className="px-3 py-3 bg-beige-100 rounded mb-2">
          <p className="font-body text-[10px] tracking-[0.1em] uppercase text-stone-400">
            Sessão ativa
          </p>
          <p className="font-body text-xs text-stone-700 truncate mt-0.5">
            {user?.email}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-stone-500 hover:text-red-500 hover:bg-red-50 rounded transition-all"
        >
          <LogOut size={14} strokeWidth={1.5} />
          <span className="font-body text-sm">Sair</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-200 flex">
      <aside className="hidden lg:flex w-60 flex-shrink-0 flex-col bg-cream-100 border-r border-beige-200 fixed top-0 left-0 bottom-0 z-30">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-stone-900/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              className="fixed top-0 left-0 bottom-0 z-50 w-64 bg-cream-100 shadow-xl lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', ease: [0.25, 0.46, 0.45, 0.94], duration: 0.35 }}
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-stone-500"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-cream-100 border-b border-beige-200 px-6 lg:px-8 h-14 flex items-center justify-between">
          <button
            className="lg:hidden text-stone-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
          <div className="hidden lg:flex items-center gap-1.5 text-stone-400">
            <span className="font-body text-xs">Painel</span>
            <ChevronRight size={12} />
            <span className="font-body text-xs text-stone-600 capitalize">
              {currentPath === '/admin' ? 'Dashboard' : currentPath.split('/').pop()}
            </span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => window.open('https://catalogo.minaslight.com.br', '_blank')}
              className="font-body text-xs text-stone-400 hover:text-stone-700 transition-colors flex items-center gap-1.5"
            >
              <Settings size={13} strokeWidth={1.5} />
              <span className="hidden sm:inline">Ver site</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
