import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type DbProduct = {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  short_description: string;
  full_description: string;
  features: string[];
  ideal_environments: string[];
  light_type: string;
  material: string;
  tag: string;
  is_featured: boolean;
  display_order: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  product_images?: DbProductImage[];
};

export type DbProductImage = {
  id: string;
  product_id: string;
  url: string;
  storage_path: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
};

export type DbCategory = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};
