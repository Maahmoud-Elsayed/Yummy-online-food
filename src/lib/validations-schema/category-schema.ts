import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_SIZE } from "../utils";

export const createCategoryClientSchema = (t: (key: string) => string) => {
  return z
    .object({
      categoryName_en: z
        .string()
        .trim()
        .min(1, { message: t("required") }),
      categoryName_ar: z
        .string()
        .trim()
        .min(1, { message: t("required") }),
      image: z.any(),
    })
    .refine((data) => data.image && data.image.length >= 1, {
      message: t("required"),
      path: ["image"],
    })
    .refine(
      (data) =>
        data.image && data.image[0] && data.image[0].size <= MAX_UPLOAD_SIZE,
      {
        message: t("imgSize"),
        path: ["image"],
      },
    )
    .refine(
      (data) =>
        data.image &&
        data.image[0] &&
        ACCEPTED_IMAGE_TYPES.includes(data.image?.[0].type),
      {
        message: t("imgFormat"),
        path: ["image"],
      },
    );
};

export const createCategoryServerSchema = z.object({
  categoryName_en: z.string().trim().min(1, { message: "Required." }),
  categoryName_ar: z.string().trim().min(1, { message: "Required." }),
  image: z.object({
    key: z.string().min(1, { message: "Please upload an image" }),
    url: z.string().min(1, { message: "Please upload an image" }),
  }),
});

export const updateCategoryClientSchema = (t: (key: string) => string) => {
  return z.object({
    categoryName_en: z
      .string()
      .trim()
      .min(1, { message: t("required") }),
    categoryName_ar: z
      .string()
      .trim()
      .min(1, { message: t("required") }),
    image: z.any().optional(),
  });
};

export const updateCategoryServerSchema = z.object({
  categoryName_en: z.string().trim().min(1, { message: "Required." }),
  categoryName_ar: z.string().trim().min(1, { message: "Required." }),
  id: z.string(),
  image: z
    .object({
      key: z.string().min(1, { message: "Please upload an image" }),
      url: z.string().min(1, { message: "Please upload an image" }),
    })
    .optional(),
});

export const upsertCategoryClientSchema = (t: (key: string) => string) => {
  return z
    .object({
      id: z.string().optional(),
      categoryName_en: z
        .string()
        .trim()
        .min(1, { message: t("required") }),
      categoryName_ar: z
        .string()
        .trim()
        .min(1, { message: t("required") }),
      image: z.any().optional(),
    })
    .refine(
      (data) => {
        if (!data.id && (!data.image || data.image.length < 1)) {
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
        if (
          data.image &&
          data.image[0] &&
          !ACCEPTED_IMAGE_TYPES.includes(data.image?.[0].type)
        ) {
          return false;
        }
        return true;
      },
      {
        message: t("imgFormat"),
        path: ["image"],
      },
    );
};

export const upsertCategoryServerSchema = z
  .object({
    id: z.string().optional(),
    categoryName_en: z.string().trim().min(1, { message: "Required." }),
    categoryName_ar: z.string().trim().min(1, { message: "Required." }),
    image: z
      .object({
        key: z.string().min(1, { message: "Please upload an image" }),
        url: z.string().min(1, { message: "Please upload an image" }),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.id && !data.image) {
        return false;
      }
      return true;
    },
    {
      message: "Required",
      path: ["image"],
    },
  );
