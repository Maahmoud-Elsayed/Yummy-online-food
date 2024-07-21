import { type ProductWithId } from "@/server/api/routers/products";
import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

export type Item = {
  id: string;
  productId: string;
  name_en: string;
  name_ar: string;
  image: string;
  price: number;
  totalPrice: number;
  additions_en: string[];
  additions_ar: string[];
  additions: string[];
  fullAdditions: {
    id: string;
    name: { en: string; ar: string };
    price: number;
  }[];
  size: "Small" | "Medium" | "Large" | "None";
  quantity: number;
};
export type CartState = {
  items: Item[];
  totalPrice: number;
  totalQuantity: number;
  changed: boolean;
};

type CartActions = {
  addItem: (newItem: Omit<Item, "id">) => void;

  removeItem: (id: string) => void;
  inCreaseItem: (id: string) => void;
  clearCart: () => void;
  getAllProductIds: () => string[];
  updateCartWithProducts: (products: ProductWithId) => void;
  removeAllItem: (id: string) => void;
};
export type CartStore = CartState & CartActions;

export const initialState: CartState = {
  items: [],
  totalPrice: 0,
  totalQuantity: 0,
  changed: false,
};

export const createCartStore = (initState: CartState = initialState) => {
  return createStore<CartStore>()(
    persist(
      (set, get) => ({
        ...initState,
        updateCartWithProducts: (products: ProductWithId) => {
          set((state) => {
            let updatedItems: Item[] = [];
            let updatedTotalPrice: number = 0;
            let updatedTotalQuantity: number = 0;

            const productMap = new Map(products.map((p) => [p.id, p]));

            updatedItems = state.items
              .map((item) => {
                const product = productMap.get(item.productId);
                if (product) {
                  const commonAdditions = item.fullAdditions?.filter(
                    (addition) =>
                      product.additions.some(
                        (prodAdd) => prodAdd.id === addition.id,
                      ),
                  );

                  let price = product.finalPrice ?? 0;
                  let size = "None";
                  let additions: string[] = [];
                  let additions_en: string[] = [];
                  let additions_ar: string[] = [];
                  let fullAdditions: {
                    id: string;
                    name: { en: string; ar: string };
                    price: number;
                  }[] = [];

                  if (product.sizes && product.sizes.length > 0) {
                    const selectedSize = product.sizes.find(
                      (size) => size.size === item.size,
                    );
                    if (selectedSize) {
                      size = selectedSize.size;
                      price = selectedSize.finalPrice;
                    } else {
                      price = product.sizes[0]?.finalPrice!;
                      size = product.sizes[0]?.size as
                        | "Small"
                        | "Medium"
                        | "Large";
                    }
                  }

                  if (commonAdditions) {
                    for (const item of commonAdditions) {
                      const foundItem = product.additions.find(
                        (element) => element.id === item.id,
                      );
                      if (foundItem) {
                        additions.push(foundItem.id);
                        additions_en.push(foundItem.name.en);
                        additions_ar.push(foundItem.name.ar);

                        fullAdditions.push(foundItem);

                        price += foundItem.price;
                      }
                    }
                  }

                  const newTotalPrice = item.quantity * price;

                  updatedTotalPrice += newTotalPrice;
                  updatedTotalQuantity += item.quantity;

                  return {
                    ...item,
                    price: Number(price.toFixed(2)),
                    totalPrice: Number(newTotalPrice.toFixed(2)),
                    size,
                    additions,
                    image: product.image,
                    name_en: product.name_en,
                    name_ar: product.name_ar,
                  };
                }
              })
              .filter((item) => item !== undefined) as Item[];

            return {
              ...state,
              items: updatedItems,
              totalPrice: Number(updatedTotalPrice.toFixed(2)),
              totalQuantity: updatedTotalQuantity,
            };
          });
        },

        clearCart: () => {
          set(initialState);
        },
        getAllProductIds: () => {
          const state = get();
          const productIds = new Set(state.items.map((item) => item.productId));
          return Array.from(productIds);
        },
        addItem: (newItem) => {
          set((state) => {
            const { productId, size, additions, quantity, totalPrice } =
              newItem;
            const existingItem = state.items.find(
              (item) =>
                item.productId === productId &&
                item.size === size &&
                JSON.stringify(item.additions?.sort()) ===
                  JSON.stringify(additions?.sort()),
            );

            if (existingItem) {
              const updatedItems = state.items.map((item) =>
                item.id === existingItem.id
                  ? {
                      ...item,
                      quantity: item.quantity + quantity,
                      totalPrice: item.totalPrice + totalPrice,
                    }
                  : item,
              );
              return {
                items: updatedItems,
                totalPrice: state.totalPrice + totalPrice,
                totalQuantity: state.totalQuantity + quantity,
                changed: true,
              };
            } else {
              return {
                items: [
                  ...state.items,
                  { ...newItem, id: crypto.randomUUID() },
                ],
                totalPrice: state.totalPrice + totalPrice,
                totalQuantity: state.totalQuantity + quantity,
                changed: true,
              };
            }
          });
        },

        removeItem: (id) => {
          set((state) => {
            const itemToRemove = state.items.find((item) => item.id === id);
            if (!itemToRemove) return state;

            if (itemToRemove.quantity > 1) {
              const updatedItems = state.items.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      quantity: item.quantity - 1,
                      totalPrice: item.totalPrice - item.price,
                    }
                  : item,
              );
              return {
                items: updatedItems,
                totalPrice: state.totalPrice - itemToRemove.price,
                totalQuantity: state.totalQuantity - 1,
                changed: true,
              };
            } else {
              const updatedItems = state.items.filter((item) => item.id !== id);
              return {
                items: updatedItems,
                totalPrice: state.totalPrice - itemToRemove.totalPrice,
                totalQuantity: state.totalQuantity - itemToRemove.quantity,
                changed: true,
              };
            }
          });
        },
        inCreaseItem(id) {
          set((state) => {
            const itemToIncrease = state.items.find((item) => item.id === id);
            if (!itemToIncrease) return state;
            const updatedItems = state.items.map((item) =>
              item.id === id
                ? {
                    ...item,
                    quantity: item.quantity + 1,
                    totalPrice: item.totalPrice + item.price,
                  }
                : item,
            );
            return {
              items: updatedItems,
              totalPrice: state.totalPrice + itemToIncrease.price,
              totalQuantity: state.totalQuantity + 1,
              changed: true,
            };
          });
        },

        removeAllItem(id) {
          set((state) => {
            const itemToRemove = state.items.find((item) => item.id === id);
            if (!itemToRemove) return state;
            const updatedItems = state.items.filter((item) => item.id !== id);
            return {
              items: updatedItems,
              totalPrice: state.totalPrice - itemToRemove.totalPrice,
              totalQuantity: state.totalQuantity - itemToRemove.quantity,
              changed: true,
            };
          });
        },
      }),
      {
        name: "cart",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          items: state.items,
          totalPrice: state.totalPrice,
          totalQuantity: state.totalQuantity,
        }),
      },
    ),
  );
};
