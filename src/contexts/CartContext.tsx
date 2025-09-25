import React, { createContext, useContext } from 'react';
import { useCart as useSupabaseCart } from '../hooks/useCart';

const CartContext = createContext<ReturnType<typeof useSupabaseCart> | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cart = useSupabaseCart();

  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  );
};