'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Item {
  name: string;
  englishName: string;
}

interface PriceItem {
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  item: Item;
  category: string;
  drinkType: PriceItem;
  toppings: PriceItem[];
  strength: PriceItem | null;
  note: string;
  totalPrice: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Generate a unique ID for cart items
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const addToCart = (item: Omit<CartItem, 'id' | 'quantity'>) => {
    const newItem = {
      ...item,
      id: generateId(),
      quantity: 1
    };
    
    setCartItems(prevItems => [...prevItems, newItem]);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.totalPrice * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}