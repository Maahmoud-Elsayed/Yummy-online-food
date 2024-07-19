"use client";

import {
  createContext,
  useContext,
  useRef,
  type ReactNode
} from "react";
import { useStore, type StoreApi } from "zustand";

import { createCartStore, type CartStore } from "@/store/cart-store";

export const CartStoreContext = createContext<StoreApi<CartStore> | null>(null);

export type CartStoreProviderProps = {
  children: ReactNode;
};

export const CartStoreProvider = ({ children }: CartStoreProviderProps) => {
  // const [storeRef] = useState<StoreApi<CartStore>>(createCartStore());

  const storeRef = useRef<StoreApi<CartStore>>();
  if (!storeRef.current) {
    storeRef.current = createCartStore();
  }

  return (
    <CartStoreContext.Provider value={storeRef.current}>
      {children}
    </CartStoreContext.Provider>
  );
};

export const useCartStore = <T,>(selector: (store: CartStore) => T): T => {
  const cartStoreContext = useContext(CartStoreContext);

  if (!cartStoreContext) {
    throw new Error(`useCartStore must be used within CartStoreProvider`);
  }

  return useStore(cartStoreContext, selector);
};
