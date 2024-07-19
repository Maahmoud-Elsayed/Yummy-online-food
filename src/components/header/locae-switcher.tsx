"use client";

import { type Locale, locales, usePathname, useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useLocale, useTranslations } from "next-intl";
import { ArFlagIcon, EnFlagIcon } from "../ui/icons/icons";

export default function LocaleSwitcher() {
  const t = useTranslations("header.buttons");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  const activeLocale = useLocale() as Locale;

  const searchParams = useSearchParams();

  const allParams = searchParams.toString();

  function onSelectChange(locale: "en" | "ar") {
    // startTransition(() => {
    //   router.replace(
    //     // @ts-expect-error -- TypeScript will validate that only known `params`
    //     // are used in combination with a given `pathname`. Since the two will
    //     // always match for the current route, we can skip runtime checks.
    //     { pathname, params },
    //     { locale: locale },
    //   );
    // });
    const newPathname = pathname + "?" + allParams;

    startTransition(() => {
      router.replace(newPathname, { locale });
    });
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="flex h-fit w-fit items-center gap-1 p-0 outline-none ">
          {activeLocale === "en" ? (
            <EnFlagIcon className="h-5 w-5" />
          ) : (
            <ArFlagIcon className="h-5 w-5" />
          )}
          <span className="font-medium text-muted-foreground">
            {activeLocale === "en" ? "EN" : "AR"}
          </span>
          <ChevronDownIcon className="-ms-1 h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2">
        <DropdownMenuLabel className="rtl:text-right">
          {t("language")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {locales.map((locale) => (
          <DropdownMenuCheckboxItem
            className="ltr:flex-row-reverse rtl:flex-row"
            key={locale}
            checked={locale === activeLocale}
            disabled={isPending || locale === activeLocale}
            onCheckedChange={(checked) => {
              if (checked) {
                onSelectChange(locale as "en" | "ar");
              }
            }}
          >
            <div
              className={cn(
                "flex w-full  gap-2 rtl:flex-row-reverse rtl:text-right",
                locale === "en" && "items-center",
              )}
            >
              {t(`languages.${locale}`)}
              {locale === "en" ? (
                <EnFlagIcon className="h-4 w-4" />
              ) : (
                <ArFlagIcon className="h-4 w-4" />
              )}
            </div>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
