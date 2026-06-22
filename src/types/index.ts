// Public-facing product type (used by Catalog, Cart, ProductModal, etc.)
export interface Product {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  material: string;
  lightType: string;
  idealEnvironments: string[];
  image: string;
  gallery: string[];
  tag?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  image: string;
  description: string;
  span?: 'wide' | 'tall' | 'normal';
}

export type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' };
