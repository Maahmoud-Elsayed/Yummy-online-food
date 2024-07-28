"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Cart from "../cart/cart";
import { buttonVariants } from "../ui/button";
import { Separator } from "../ui/separator";
import LocaleSwitcher from "./locae-switcher";
import UserAccountMenu from "./user-account-menu";

const NavItems = () => {
  const { data: session, status } = useSession();
  const t = useTranslations("header.buttons");

  if (status === "loading") {
    return (
      <div className="flex items-center gap-4 ">
        <Skeleton className="hidden h-7 w-24 rounded-md md:flex" />
        <Separator
          orientation="vertical"
          className="h-6 w-px bg-gray-200"
          aria-hidden="true"
        />
        <Skeleton className="hidden h-9 w-9 rounded-full md:flex" />
        <Separator
          orientation="vertical"
          className="hidden h-6 w-px bg-gray-200 md:flex"
          aria-hidden="true"
        />
        <Skeleton className="h-6 w-9 rounded-md" />
        <Separator
          orientation="vertical"
          className="hidden h-6 w-px bg-gray-200 md:flex"
          aria-hidden="true"
        />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    );
  }
  return (
    <div className=" flex items-center gap-3 lg:gap-4  ">
      <div className="hidden gap-4 md:flex md:flex-1 md:items-center md:justify-end ">
        {session ? null : (
          <>
            <Link
              href="/login"
              className={buttonVariants({
                variant: "outline",
              })}
            >
              {t("signIn")}
            </Link>
            <Link
              href="/register"
              className={buttonVariants({
                variant: "default",
              })}
            >
              {t("register")}
            </Link>
            <Separator
              orientation="vertical"
              className="h-6 w-px bg-gray-200"
              aria-hidden="true"
            />
          </>
        )}

        {session &&
          (session.user.role === "ADMIN" ||
            session.user.role === "MANAGER") && (
            <>
              <Link
                href={"/dashboard"}
                className={buttonVariants({
                  variant: "default",
                  className: "px-3 lg:px-4",
                })}
              >
                {t("dashboard")}
              </Link>
              <Separator
                orientation="vertical"
                className="h-6 w-px bg-gray-200"
                aria-hidden="true"
              />
            </>
          )}
      </div>

      <LocaleSwitcher />

      <Separator
        orientation="vertical"
        className="h-6 w-px bg-gray-200"
        aria-hidden="true"
      />
      <Cart />

      {session && <UserAccountMenu />}
    </div>
  );
};

export default NavItems;
