"use client";

import { Link, type Locale } from "@/navigation";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useParams, usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";

const ITEMS_TO_DISPLAY = 2;
const BreadcrumbResponsive = ({
  productName,
  className,
}: {
  productName?: string;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const pathName = usePathname();
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });
  const params = useParams();
  const productId = params?.productId;
  const orderId = params?.orderId;

  const locale = useLocale() as Locale;

  const t = useTranslations("navigation");

  const pathArray = pathName
    .split("/")
    .filter((segment) => segment !== "ar" && segment !== "en" && segment);

  const items = useMemo(() => {
    return pathArray.map((segment, index) => {
      const href =
        index === pathArray.length - 1
          ? undefined
          : `/${pathArray.slice(0, index + 1).join("/")}`;
      const label =
        segment === productId || segment === orderId ? segment : t(segment);
      return { href, label };
    });
  }, [pathName]);

  return (
    <Breadcrumb
      className={cn(
        " w-fit rounded-lg border border-gray-200 bg-gray-50 px-5 py-2",
        className,
      )}
    >
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link className="hover:text-primary" href="/">
              {t("home")}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {items.length > ITEMS_TO_DISPLAY ? (
          <>
            <BreadcrumbItem>
              {isDesktop ? (
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger
                    className="flex items-center gap-1"
                    aria-label="Toggle menu"
                  >
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {items.slice(0, -ITEMS_TO_DISPLAY).map((item, index) => (
                      <DropdownMenuItem key={index}>
                        <Link href={item.href ? item.href : "#"}>
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Drawer open={open} onOpenChange={setOpen}>
                  <DrawerTrigger aria-label="Toggle Menu">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>{t("breadCrumb.title")}</DrawerTitle>
                      <DrawerDescription>
                        {t("breadCrumb.select")}
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="grid gap-1 px-4">
                      {items.slice(0, -ITEMS_TO_DISPLAY).map((item, index) => (
                        <Link
                          key={index}
                          href={item.href ? item.href : "#"}
                          className="py-1 text-sm"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    <DrawerFooter className="pt-4">
                      <DrawerClose asChild>
                        <Button variant="outline">
                          {t("breadCrumb.close")}
                        </Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        ) : null}
        {items.slice(-ITEMS_TO_DISPLAY).map((item, index) => {
          const isLast = index === items.slice(-ITEMS_TO_DISPLAY).length - 1;
          return (
            <ItemPath
              key={index}
              href={item.href}
              label={productName && isLast ? productName : item.label}
              isLast={isLast}
            />
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbResponsive;

const ItemPath = ({
  href,
  label,
  isLast,
}: {
  href?: string;
  label: string;
  isLast: boolean;
}) => {
  return (
    <>
      <BreadcrumbItem>
        {href ? (
          <>
            <BreadcrumbLink asChild className="max-w-20 truncate md:max-w-none">
              <Link className="hover:text-primary" href={href}>
                {label}
              </Link>
            </BreadcrumbLink>
          </>
        ) : (
          <BreadcrumbPage className="max-w-20 truncate md:max-w-none">
            {label}
          </BreadcrumbPage>
        )}
      </BreadcrumbItem>
      {isLast ? null : <BreadcrumbSeparator />}
    </>
  );
};
