import { z } from "zod";

export const itemSchema = z.object({
  productId: z.string(),
  additions: z.array(z.string()).optional(),
  size: z.enum(["Small", "Medium", "Large"]).optional(),
  quantity: z.number(),
});

export const cartSchema = z.object({
  items: z.array(itemSchema).optional(),
});

export const selectionSchema = z
  .object({
    quantity: z.number(),
    size: z.enum(["Small", "Medium", "Large"]).optional(),
    additions: z.array(z.string()).optional(),
    price: z.number(),
    withSizes: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.withSizes && !data.size) {
        return false;
      }
      return true;
    },
    {
      message: "Please select a size",
      path: ["size"],
    },
  );
