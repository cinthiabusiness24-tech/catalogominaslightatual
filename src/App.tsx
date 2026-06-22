import { useState, useEffect, lazy, Suspense } from 'react';
import { CartProvider } from './context/CartContext';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Cart from './components/Cart';

const AdminApp = lazy(() => import('./admin/AdminApp'));

function AdminLoader() {
  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-beige-300 border-t-gold-300 rounded-full animate-spin" />
    </div>
  );
}

function PublicSite() {
  const [cartOpen, setCartOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const sections = ['catalogo', 'sobre', 'contato'];
    const observers: IntersectionObserver[] = [];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="min-h-screen bg-cream-100">
      <LoadingScreen />
      <Navbar onCartOpen={() => setCartOpen(true)} activeSection={activeSection} />
      <main>
        <Hero />
        <Catalog />
        <About />
        <Contact />
      </main>
      <Footer />
      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

function Router() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  if (path.startsWith('/admin')) {
    return (
      <Suspense fallback={<AdminLoader />}>
        <AdminApp />
      </Suspense>
    );
  }

  return <PublicSite />;
}

export default function App() {
  return (
    <CartProvider>
      <Router />
    </CartProvider>
  );
}
