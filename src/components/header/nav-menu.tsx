"use client";

import { Link } from "@/navigation";

import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { type Locale } from "@/navigation";
import { type Categories } from "@/server/api/routers/categories";
import { Separator } from "@radix-ui/react-separator";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { forwardRef, useState } from "react";

export function NavMenu({ categories }: { categories: Categories }) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const t = useTranslations();
  const locale = useLocale() as Locale;
  return (
    <NavigationMenu className="group">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="  font-medium text-foreground group-hover:text-primary rtl:text-base">
            {t("navigation.menu")}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="flex items-center gap-4 p-4">
              <div className="  ">
                <h2 className="px-3 text-foreground  rtl:text-right ">
                  {t("navigation.categories")}
                </h2>
                <Separator
                  className="mt-3 h-px w-full bg-gray-200"
                  aria-hidden="true"
                />
                <div className="flex justify-between gap-4 rtl:flex-row-reverse">
                  <ul
                    dir={locale === "ar" ? "rtl" : "ltr"}
                    className="grid w-[400px] shrink-0 auto-cols-fr grid-flow-col grid-rows-6  pt-4  lg:w-[450px] "
                  >
                    <ListItem
                      title={t("navigation.allProducts")}
                      href="/products"
                      className=" overflow-hidden !truncate text-muted-foreground rtl:text-right  "
                    ></ListItem>
                    {categories?.map((category) => (
                      <ListItem
                        className=" overflow-hidden !truncate text-muted-foreground rtl:text-right "
                        key={category.id}
                        title={category[`name_${locale}`]}
                        href={{
                          pathname: "/products",
                          query: { category: category.name_en },
                        }}
                        onMouseEnter={() => setHoveredCategory(category.image)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      ></ListItem>
                    ))}
                  </ul>
                  <div className=" relative mt-4  flex h-[200px] w-[200px] items-center justify-center self-center overflow-hidden">
                    <Image
                      className="h-full w-full rounded-md object-fill "
                      alt="category"
                      fill
                      src={hoveredCategory ?? "/assets/images/yummy-logo.png"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            " block  select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground lg:p-3 ",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
