import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_SIZE } from "../utils";
export type Role = "USER" | "ADMIN" | "MANAGER";

export const createUserClientSchema = (
  t: (key: string, data?: any) => string,
) => {
  return z
    .object({
      email: z
        .string()
        .trim()
        .min(1, { message: t("required") })
        .email({ message: t("email") }),
      confirmPassword: z.string().min(1, { message: t("required") }),
      userName: z
        .string()
        .trim()
        .min(1, { message: t("required") }),
      password: z
        .string()
        .trim()
        .min(8, { message: t("shortPw", { min: 8 }) })
        .regex(/^(?=.*[A-Z])(?=.*\d).+$/, {
          message: t("regexPw"),
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("matchPw"),
      path: ["confirmPassword"],
    });
};

export const createUserServerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, { message: "Required" })
      .email({ message: "Invalid email" }),
    confirmPassword: z.string().trim().min(1, { message: "Required" }),
    userName: z.string().trim().min(1, { message: "Required" }),
    password: z
      .string()
      .trim()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*[A-Z])(?=.*\d).+$/, {
        message:
          "Password must contain at least one capital letter and one number",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export const loginUserClientSchema = (t: (key: string) => string) => {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, { message: t("required") })
      .email({ message: t("email") }),
    password: z
      .string()
      .trim()
      .min(1, { message: t("required") }),
  });
};

export const loginUserServerSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Required" })
    .email({ message: "Invalid email" }),
  password: z.string().trim().min(1, { message: "Required" }),
});

export const changePwClientSchema = (t: (key: string) => string) => {
  return z
    .object({
      password: z
        .string()
        .trim()
        .min(1, { message: t("required") })
        .regex(/^(?=.*[A-Z])(?=.*\d).+$/, {
          message: t("regexPw"),
        }),
      confirmPassword: z.string().trim().min(1, { message: "Required" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("matchPw"),
      path: ["confirmPassword"],
    });
};

export const resetPwClientSchema = (t: (key: string) => string) => {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, { message: t("required") })
      .email({ message: t("email") }),
  });
};

export const resetPwServerSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Required" })
    .email({ message: "Invalid email" }),
});

export const changePwServerSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
    resetPasswordToken: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const updateUserClientSchema = (
  t: (key: string, data?: any) => string,
) => {
  return z
    .object({
      userName: z
        .string()
        .trim()
        .min(1, { message: t("required") }),
      email: z
        .string()
        .trim()
        .email({ message: t("email") })
        .optional(),

      currentPassword: z
        .string()
        .trim()
        .min(1, { message: t("required") }),

      password: z.preprocess(
        (arg) => (arg === "" ? undefined : arg),
        z
          .string()
          .trim()
          .min(8, { message: t("shortPw", { min: 8 }) })
          .optional(),
      ),
      confirmPassword: z.preprocess(
        (arg) => (arg === "" ? undefined : arg),
        z.string().trim().optional(),
      ),
      image: z.any().optional(),

      deleteImg: z.boolean(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("matchPw"),
      path: ["confirmPassword"],
    })
    .refine(
      (data) => {
        if (data.image && data.image.length > 0) {
          return data.image[0] && data.image[0].size <= MAX_UPLOAD_SIZE;
        }
        return true; // If image is not provided, return true to pass validation
      },
      {
        message: t("imgSize"),
        path: ["image"],
      },
    )
    .refine(
      (data) => {
        if (data.image && data.image.length > 0) {
          return (
            data.image[0] && ACCEPTED_IMAGE_TYPES.includes(data.image?.[0].type)
          );
        }
        return true; // If image is not provided, return true to pass validation
      },
      {
        message: t("imgFormat"),
        path: ["image"],
      },
    );
};
export const updateUserServerSchema = z
  .object({
    userName: z.string().trim().min(1, { message: "Required" }),
    email: z.string().trim().email({ message: "Invalid email" }).optional(),

    currentPassword: z.string().trim().min(1, { message: "Required" }),

    password: z.preprocess(
      (arg) => (arg === "" ? undefined : arg),
      z
        .string()
        .trim()
        .min(8, { message: "Password must be at least 8 characters" })
        .optional(),
    ),
    confirmPassword: z.preprocess(
      (arg) => (arg === "" ? undefined : arg),
      z.string().optional(),
    ),
    image: z
      .object({
        key: z.string().min(1, { message: "Please upload an image" }),
        url: z.string().min(1, { message: "Please upload an image" }),
      })
      .optional(),
    deleteImg: z.boolean(),
    provider: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
