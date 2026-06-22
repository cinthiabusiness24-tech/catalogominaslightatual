import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter, matchRoute } from '../lib/router';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductsList from './pages/ProductsList';
import ProductForm from './pages/ProductForm';

function Spinner() {
  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-beige-300 border-t-gold-300 rounded-full animate-spin" />
        <p className="font-body text-xs tracking-[0.2em] uppercase text-stone-400">Carregando...</p>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const { session, loading } = useAuth();
  const { path, navigate } = useRouter();

  const isLoginPage = path === '/admin/login';

  useEffect(() => {
    if (loading) return;
    if (!session && !isLoginPage) {
      navigate('/admin/login');
    } else if (session && isLoginPage) {
      navigate('/admin');
    }
  }, [session, loading, isLoginPage]);

  if (loading) return <Spinner />;

  if (!session || isLoginPage) {
    return <Login navigate={navigate} />;
  }

  // Route matching
  const renderPage = () => {
    if (path === '/admin' || path === '/admin/') {
      return <Dashboard navigate={navigate} />;
    }
    if (path === '/admin/products') {
      return <ProductsList navigate={navigate} />;
    }
    if (path === '/admin/products/new') {
      return <ProductForm productId={null} navigate={navigate} />;
    }
    const editMatch = matchRoute('/admin/products/:id', path);
    if (editMatch) {
      return <ProductForm productId={editMatch.id} navigate={navigate} />;
    }
    // Default to dashboard
    return <Dashboard navigate={navigate} />;
  };

  return (
    <AdminLayout currentPath={path} navigate={navigate}>
      {renderPage()}
    </AdminLayout>
  );
}
