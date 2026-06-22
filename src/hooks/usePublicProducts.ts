import { useState, useEffect } from 'react';
import { supabase, DbProduct } from '../lib/supabase';
import { Product } from '../types';

function transformDbProduct(p: DbProduct): Product {
  const images = [...(p.product_images || [])].sort((a, b) => a.display_order - b.display_order);
  const primary = images.find((i) => i.is_primary)?.url || images[0]?.url || '';
  const gallery = images.map((i) => i.url).filter(Boolean);

  return {
    id: p.id,
    name: p.name,
    category: p.category,
    shortDescription: p.short_description,
    fullDescription: p.full_description,
    features: p.features || [],
    material: p.material,
    lightType: p.light_type,
    idealEnvironments: p.ideal_environments || [],
    image: primary,
    gallery: gallery.length > 0 ? gallery : [primary].filter(Boolean),
    tag: p.tag || undefined,
  };
}

export function usePublicProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('status', 'active')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (!active) return;
      if (error) {
        setError(error.message);
      } else {
        setProducts((data as DbProduct[]).map(transformDbProduct));
      }
      setLoading(false);
    }

    fetchProducts();

    const channel = supabase
      .channel('public-products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchProducts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'product_images' }, fetchProducts)
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const categories = ['Todos', ...Array.from(new Set(products.map((p) => p.category)))];

  return { products, categories, loading, error };
}
