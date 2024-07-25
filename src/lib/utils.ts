import { type Locale } from "@/navigation";
import { type Size } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ExtraAddition, ExtraSize, Item } from "./types";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 4; // 3MB
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export function getBaseUrl() {
  if (process.env.VERCEL_ENV === "production") {
    return process.env.PRODUCTION_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}


export function formatPrice(
  price: number | string,
  options: {
    currency?: "USD" | "EUR" | "GBP" | "EGP";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {},
) {
  const { currency = "USD", notation = "compact" } = options;

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

export const formattedDate = (date: Date, locale?: Locale) => {
  return new Date(date).toLocaleString(
    locale === "en" ? "en-US" : locale === "ar" ? "ar-EG" : "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      // second: "numeric",
      hour12: true, // for 12-hour format
    },
  );
};

export const createQueryString = (
  searchParams: URLSearchParams,
  name: string,
  value: string,
) => {
  const params = new URLSearchParams(searchParams.toString());
  params.set(name, value);
  return params.toString();
};

export const removeQueryString = (
  searchParams: URLSearchParams,
  name: string,
) => {
  const params = new URLSearchParams(searchParams.toString());
  params.delete(name);
  return params.toString();
};

export const mergeCounts = (
  items: { productId: string; quantity: number }[],
) => {
  const counts: Record<string, number> = {};

  items.forEach((product: { productId: string; quantity: number }) => {
    counts[product.productId] =
      (counts[product.productId] ?? 0) + product.quantity;
  });

  return Object.keys(counts).map((productId: string) => ({
    productId,
    quantity: counts[productId],
  }));
};

export const calculateCartTotals = async (items: Item[]) => {
  let cartTotalPrice = 0;
  let cartTotalQuantity = 0;

  const cartItems = await Promise.all(
    items.map(async (item) => {
      let price = item.product.finalPrice ?? 0;
      let fullAdditions: ExtraAddition[] = [];
      let additions_en: string[] = [];
      let additions_ar: string[] = [];
      let size = "None" as Size;

      const parsedItemAdditions = item.additions
        ? (JSON.parse(item.additions as string) as string[])
        : [];

      const parsedProductSizes = item.product.sizes
        ? (JSON.parse(item.product.sizes as string) as ExtraSize[])
        : [];

      const parsedProductAdditions = item.product.additions
        ? (JSON.parse(item.product.additions as string) as ExtraAddition[])
        : [];
      const { product, ...rest } = item;
      const { name_ar, name_en, image } = product;
      if (parsedProductSizes && parsedProductSizes.length > 0) {
        const selectedSize = parsedProductSizes.find(
          (size) => size.size === item.size,
        );
        if (selectedSize) {
          size = selectedSize.size;
          price = selectedSize.finalPrice;
        } else {
          size = parsedProductSizes[0]?.size!;
          price = parsedProductSizes[0]?.finalPrice!;
        }
      }

      if (parsedItemAdditions && parsedItemAdditions.length > 0) {
        for (const itemName of parsedItemAdditions) {
          const foundItem = parsedProductAdditions.find(
            (element) => element.id === itemName,
          );
          if (foundItem) {
            additions_en.push(foundItem.name.en);
            additions_ar.push(foundItem.name.ar);
            fullAdditions.push(foundItem);
            price += foundItem.price;
          }
        }
      }

      const totalPrice = price * item.quantity;
      cartTotalPrice += totalPrice;
      cartTotalQuantity += item.quantity;

      return {
        name_ar,
        name_en,
        image,
        ...rest,
        additions: parsedItemAdditions,
        price: Number(price.toFixed(2)),
        totalPrice,
        size: size,
        additions_en: additions_en,
        additions_ar: additions_ar,
        fullAdditions: fullAdditions,
      };
    }),
  );

  return {
    items: cartItems,
    totalPrice: Number(cartTotalPrice.toFixed(2)),
    totalQuantity: cartTotalQuantity,
  };
};

export function calculatePercentageIncrease(
  previousValue: number,
  currentValue: number,
) {
  if (previousValue === 0 && currentValue === 0) {
    return 0;
  } else if (previousValue === 0) {
    return 100;
  } else {
    return ((currentValue - previousValue) / previousValue) * 100;
  }
}

export const parseAdditions = (
  additionsIds: string[] | undefined,
  additions: ExtraAddition[],
) => {
  let additions_en: string[] = [];
  let additions_ar: string[] = [];
  let fullAdditions: {
    id: string;
    name: { en: string; ar: string };
    price: number;
  }[] = [];
  if (additionsIds && additionsIds.length > 0) {
    additions_ar = additionsIds
      .map((item) => {
        const selected = additions.find((addition) => addition.id === item);
        if (!selected) return undefined;
        return selected.name.ar;
      })
      .filter(Boolean) as string[];
    additions_en = additionsIds
      .map((item) => {
        const selected = additions.find((addition) => addition.id === item);
        if (!selected) return undefined;
        return selected.name.en;
      })
      .filter(Boolean) as string[];

    fullAdditions = additionsIds
      .map((item) => {
        const selected = additions.find((addition) => addition.id === item);
        if (!selected) return undefined;
        return selected;
      })
      .filter(Boolean) as {
      id: string;
      name: { en: string; ar: string };
      price: number;
    }[];
  }

  return {
    additions_en,
    additions_ar,
    fullAdditions,
  };
};

// export const getCartItemsWithLocale = (
//   items: CartItem[],
// ) => {
//   return items.map((item) => ({
//     ...item,
//     additions: item.additions?.map((addition) => addition[filter]) ?? [],
//   }));
// };
