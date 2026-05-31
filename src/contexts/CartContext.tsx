import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Event, CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (event: Event) => void;
  removeItem: (eventId: number) => void;
  updateQuantity: (eventId: number, quantity: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('@IngressoPro:cart');
      if (savedCart) {
        return JSON.parse(savedCart);
      }
    } catch (err) {
      console.error('Failed to load cart from localStorage', err);
    }
    return [];
  });
  
  const [cartOpen, setCartOpen] = useState(false);

  // Salva no localStorage sempre que os itens mudarem
  useEffect(() => {
    localStorage.setItem('@IngressoPro:cart', JSON.stringify(items));
  }, [items]);

  const addItem = (event: Event) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.event.id === event.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.event.id === event.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { event, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeItem = (eventId: number) => {
    setItems(prevItems => prevItems.filter(item => item.event.id !== eventId));
  };

  const updateQuantity = (eventId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(eventId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.event.id === eventId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (Number(item.event.price) * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cartOpen,
        setCartOpen,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
