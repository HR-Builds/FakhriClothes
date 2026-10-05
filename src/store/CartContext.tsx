"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

type CartContextType = { count: number; refresh: () => Promise<void> };
const CartContext = createContext<CartContextType>({ count: 0, refresh: async () => {} });

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) { setCount(0); return; }
      const data = await res.json();
      setCount((data.items || []).reduce((sum: number, i: { qty: number }) => sum + i.qty, 0));
    } catch {
      setCount(0);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return <CartContext.Provider value={{ count, refresh }}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);