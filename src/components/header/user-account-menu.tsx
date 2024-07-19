"use client";
import { Button } from "@/components//ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/navigation";
import { CiLogout } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import { IoReceiptOutline, IoSettingsOutline } from "react-icons/io5";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { type Locale } from "@/navigation";

const UserAccountMenu = () => {
  const { data: session } = useSession();
  const locale = useLocale() as Locale;

  const t = useTranslations();

  const signOutHahndler = () => {
    signOut({
      redirect: true,
      callbackUrl: "/",
    });
  };

  return session ? (
    <>
      <Separator
        orientation="vertical"
        className={cn("hidden h-6 w-px bg-gray-200 md:flex")}
        aria-hidden="true"
      />
      <div className=" hidden md:flex md:items-center md:justify-end md:space-x-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="overflow-visible">
            <Button
              variant="secondary"
              className=" w-fit rounded-full p-0 focus-visible:ring-0"
            >
              {session?.user.image ? (
                <div className="relative aspect-square h-8 w-8">
                  <Image
                    src={session.user.image}
                    alt="User Image"
                    fill
                    className="aspect-square rounded-full object-cover object-center  "
                  />
                </div>
              ) : (
                <FaUserCircle className="h-8 w-8 text-gray-400" />
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className=" w-44 bg-white"
            align={locale === "ar" ? "start" : "end"}
          >
            <DropdownMenuItem asChild>
              <Link
                className="flex cursor-pointer items-center gap-2 text-foreground rtl:flex-row-reverse"
                href="/my-account"
              >
                <IoSettingsOutline className=" h-4 w-4" />
                {t("navigation.my-account")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                className="flex cursor-pointer items-center gap-2 text-foreground rtl:flex-row-reverse"
                href="/my-account/orders"
              >
                <IoReceiptOutline className=" h-4 w-4" />
                {t("navigation.my-orders")}
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={signOutHahndler}
              className=" flex cursor-pointer gap-2 text-foreground rtl:flex-row-reverse"
            >
              <CiLogout className=" h-4 w-4" />
              {t("header.buttons.signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  ) : null;
};

export default UserAccountMenu;
