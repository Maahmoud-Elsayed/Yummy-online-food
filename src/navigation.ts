import { createSharedPathnamesNavigation } from "next-intl/navigation";

export type Locale = "en" | "ar"; // Default
export const locales = ["en", "ar"];
export const localePrefix = "as-needed";

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix });
