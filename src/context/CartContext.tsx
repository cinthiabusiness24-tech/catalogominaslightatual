import React, { createContext, useContext, useReducer } from 'react';
import { CartItem, CartAction, Product } from '../types';

interface CartContextValue {
  items: CartItem[];
  count: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openWhatsApp: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find((i) => i.product.id === action.product.id);
      if (existing) {
        return state.map((i) =>
          i.product.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...state, { product: action.product, quantity: 1 }];
    }
    case 'REMOVE_ITEM':
      return state.filter((i) => i.product.id !== action.productId);
    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) return state.filter((i) => i.product.id !== action.productId);
      return state.map((i) =>
        i.product.id === action.productId ? { ...i, quantity: action.quantity } : i
      );
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  const addItem = (product: Product) => dispatch({ type: 'ADD_ITEM', product });
  const removeItem = (productId: string) => dispatch({ type: 'REMOVE_ITEM', productId });
  const updateQuantity = (productId: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const openWhatsApp = () => {
    if (items.length === 0) return;
    const lines = items
      .map((i) => `• ${i.product.name} (${i.product.category}) — quantidade: ${i.quantity}`)
      .join('\n');
    const message = `Olá! Tenho interesse nos seguintes produtos da Minas Light:\n\n${lines}\n\nPoderia me enviar mais informações sobre disponibilidade e valores?`;
    window.open(`https://wa.me/553534220999?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <CartContext.Provider value={{ items, count, addItem, removeItem, updateQuantity, clearCart, openWhatsApp }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
