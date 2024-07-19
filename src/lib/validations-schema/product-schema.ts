import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_SIZE } from "../utils";

export const productSchema = z.object({
  productId: z.string().optional(),
  productName_en: z.string().trim().min(1, { message: "Required." }),
  productName_ar: z.string().trim().min(1, { message: "Required." }),
  description_en: z
    .string()
    .min(8, { message: "Description must be at least 8 characters." }),
  description_ar: z
    .string()
    .min(8, { message: "Description must be at least 8 characters." }),
  price: z.string().optional(),
  discount: z.string().optional(),
  additions: z
    .array(
      z.object({
        id: z.string(),
        name: z.object({
          en: z.string().min(1, { message: "Required." }),
          ar: z.string().min(1, { message: "Required." }),
        }),
        price: z.string().min(1, { message: "Required." }),
      }),
    )
    .optional(),
  sizes: z
    .array(
      z.object({
        size: z.enum(["Small", "Medium", "Large"]),
        price: z.string().min(1, { message: "Required." }),
      }),
    )
    .optional(),
  category: z.string().min(1, { message: "Required." }),
});

export const createProductClientSchema = (
  t: (key: string, data?: any) => string,
) => {
  return z
    .object({
      productId: z.string().optional(),
      productName_en: z
        .string()
        .trim()
        .min(1, { message: t("required") }),
      productName_ar: z
        .string()
        .trim()
        .min(1, { message: t("required") }),
      description_en: z
        .string()
        .trim()
        .min(1, { message: t("required") }),
      description_ar: z
        .string()
        .trim()
        .min(1, { message: t("required") }),
      price: z.string().optional(),
      discount: z.string().optional(),
      additions: z
        .array(
          z.object({
            id: z.string(),
            name: z.object({
              en: z.string().min(1, { message: t("required") }),
              ar: z.string().min(1, { message: t("required") }),
            }),
            price: z.string().min(1, { message: t("required") }),
          }),
        )
        .optional(),
      sizes: z
        .array(
          z.object({
            size: z.enum(["Small", "Medium", "Large"]),
            price: z.string().min(1, { message: t("required") }),
          }),
        )
        .optional(),
      category: z.string().min(1, { message: t("required") }),
      image: z.any(),
    })
    .refine(
      (data) => {
        if (!data.productId && (!data.image || data.image.length === 0)) {
          return false;
        }

        return true;
      },
      {
        message: t("required"),
        path: ["image"],
      },
    )
    .refine(
      (data) => {
        if (
          !data.productId &&
          data.image &&
          data.image[0] &&
          data.image[0].size >= MAX_UPLOAD_SIZE
        ) {
          return false;
        }
        return true;
      },
      {
        message: t("imgSize"),
        path: ["image"],
      },
    )
    .refine(
      (data) => {
        if (!data.productId && data.image && data.image[0]) {
          return ACCEPTED_IMAGE_TYPES.includes(data.image?.[0].type);
        }
        return true;
      },
      {
        message: t("imgFormat"),
        path: ["image"],
      },
    )
    .refine((data) => data.price !== "" || data.sizes?.length! > 0, {
      message: t("price"),
      path: ["price"],
    });
};

export const createProductServerSchema = z
  .object({
    productId: z.string().optional(),
    productName_en: z.string().trim().min(1, { message: "Required." }),
    productName_ar: z.string().trim().min(1, { message: "Required." }),
    description_en: z
      .string()
      .min(8, { message: "Description must be at least 8 characters." }),
    description_ar: z
      .string()
      .min(8, { message: "Description must be at least 8 characters." }),
    price: z.string().optional(),
    discount: z.string().optional(),
    additions: z
      .array(
        z.object({
          id: z.string(),
          name: z.object({
            en: z.string().min(1, { message: "Required." }),
            ar: z.string().min(1, { message: "Required." }),
          }),
          price: z.string().min(1, { message: "Required." }),
        }),
      )
      .optional(),
    sizes: z
      .array(
        z.object({
          size: z.enum(["Small", "Medium", "Large"]),
          price: z.string().min(1, { message: "Required." }),
        }),
      )
      .optional(),
    category: z.string().min(1, { message: "Required." }),
    image: z
      .object({
        key: z.string().min(1, { message: "Please upload an image" }),
        url: z.string().min(1, { message: "Please upload an image" }),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.productId && !data.image) {
        return false;
      }

      return true;
    },
    {
      message: "Required",
      path: ["image"],
    },
  )
  .refine((data) => data.price || data.sizes, {
    message: "At least one of 'price' or 'sizes' must be provided.",
    path: ["price", "sizes"],
  });

export const filteredProductsSchema = z.object({
  page: z.number(),
  take: z.number().optional(),
  sortBy: z
    .enum([
      "price-asc",
      "price-desc",
      "date-asc",
      "date-desc",
      "sold-asc",
      "sold-desc",
      "rating-asc",
      "rating-desc",
      "sold-desc",
    ])
    .optional(),
  minPrice: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val) {
          return !Number.isNaN(Number(val));
        }
        return true;
      },
      {
        message: "minPrice must be a valid number",
      },
    ),
  maxPrice: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val) {
          return !Number.isNaN(Number(val));
        }
        return true;
      },
      {
        message: "minPrice must be a valid number",
      },
    ),
  category: z.string().optional(),
  discount: z.literal("true").optional(),
  search: z.string().optional(),
});
