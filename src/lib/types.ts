import { type Size } from "@prisma/client";
import { type JsonValue } from "@prisma/client/runtime/library";

export type Item = {
  product: {
    name_ar: string;
    name_en: string;
    image: string;
    discount: number;
    price: number;
    additions: JsonValue;
    sizes: JsonValue;
    finalPrice: number;
  };
  additions: JsonValue;
  productId: string;
  quantity: number;
  size: Size;
  id: string;
};

export type ExtraSize = {
  size: Size;
  price: number;
  finalPrice: number;
};

export type Address =
  | {
      city?: string;
      country?: string;
      line1?: string;
      line2?: string;
      postal_code?: string;
      state?: string;
    }
  | undefined;

export type ExtraAddition = {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  price: number;
};
