"use client";
import { type ReactNode, useEffect, useState } from "react";
import { LuArrowLeftToLine, LuArrowRightToLine } from "react-icons/lu";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";

import { cn } from "@/lib/utils";
import { Link, type Locale, usePathname } from "@/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { type LinkProps } from "next/link";
import { useSearchParams } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { Badge } from "./badge";
import MotionDiv from "./motion-div";
import { Separator } from "./separator";
import { TooltipWrapper } from "./tooltip-wrapper";
import { useLocale, useTranslations } from "next-intl";
import { useMediaQuery } from "react-responsive";

type MenuItem = {
  label: string;
  path: string;
  icon: ReactNode;
};
type SubMenu = {
  label: string;
  icon: ReactNode;
  subMenu: MenuItem[];
};

type SideBarProps = {
  menuItems: (MenuItem | SubMenu)[];
  withCollapsed?: boolean;
};
const isSubMenu = (item: MenuItem | SubMenu): item is SubMenu => {
  return (item as SubMenu).subMenu !== undefined;
};
const SideBar = ({ menuItems, withCollapsed }: SideBarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const path = usePathname();
  const searchParams = useSearchParams().size;
  const lgScreen = useMediaQuery({ query: "(min-width: 1024px)" });
  const { data: session } = useSession();
  const t = useTranslations();
  const locale = useLocale() as Locale;

  useEffect(() => {
    if (!lgScreen && !collapsed && withCollapsed) {
      setCollapsed(true);
    }
  }, [lgScreen]);

  return (
    <div className="sticky top-[66px] z-40 h-[calc(100vh-65px)] overflow-y-auto">
      <Sidebar
        collapsed={collapsed}
        className="relative hidden h-full md:block"
        width={!withCollapsed ? "200px" : undefined}
        rtl={locale === "ar"}
        // backgroundColor="#f0fdf4"
        breakPoint="md"
      >
        <Menu
          closeOnClick
          menuItemStyles={{
            button: ({ level, active, disabled, isSubmenu, open }) => {
              return {
                color: active && !open && isSubmenu ? "#fff1f2" : undefined,
                backgroundColor:
                  active && !open && isSubmenu ? "#16a34a" : undefined,
                borderRadius: "0.3rem",
                fontSize: locale === "en" ? "0.9rem" : "1rem",
                ":hover": {
                  color: active && !open && isSubmenu ? "#fff1f2" : undefined,
                  backgroundColor:
                    active && !open && isSubmenu ? "#16a34a" : "#dcfce7",
                },
              };
            },
          }}
          className={!withCollapsed ? "pt-5" : ""}
        >
          {withCollapsed &&
            (collapsed ? (
              <TooltipWrapper
                text={locale === "ar" ? "اظهار" : "Open"}
                side={locale === "ar" ? "left" : "right"}
              >
                <MenuItem
                  className="hidden lg:block"
                  onClick={() => setCollapsed(!collapsed)}
                  icon={
                    <LuArrowRightToLine className="h-5 w-5 rtl:rotate-180 " />
                  }
                ></MenuItem>
              </TooltipWrapper>
            ) : (
              <>
                <MotionDiv
                  initial={{ opacity: 0, x: locale === "ar" ? 100 : -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: "easeIn" }}
                  className="hidden w-full lg:block"
                >
                  <MenuItem
                    onClick={() => setCollapsed(!collapsed)}

                    // icon={<LuArrowLeftToLine className="h-5 w-5 " />}
                  >
                    <div className="flex w-full items-center justify-between gap-2 ">
                      <span className="font-medium text-foreground">
                        {t("navigation.dashboard")}
                      </span>
                      <LuArrowLeftToLine className="  h-5 w-5 rtl:rotate-180" />
                    </div>
                  </MenuItem>
                </MotionDiv>
                <MotionDiv
                  initial={{ opacity: 0, x: locale === "ar" ? 100 : -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: "easeIn" }}
                  className="relative flex flex-col items-center justify-center gap-2 px-4"
                >
                  <div className="absolute left-0 top-2 z-10 h-[110px] w-full rounded-t-md bg-primary"></div>
                  {session?.user.image ? (
                    <div className="relative z-30 mt-[45px] aspect-square h-[130px] w-[130px] overflow-hidden rounded-full ">
                      <Image
                        src={session?.user.image}
                        alt="User Image"
                        fill
                        className="rounded-full bg-gray-50 p-2"
                      />
                    </div>
                  ) : (
                    <div className="relative z-30 mt-[40px] aspect-square h-[120px] w-[120px] overflow-hidden rounded-full border bg-white p-8 shadow">
                      <FaUser className="h-full w-full text-gray-300" />
                    </div>
                  )}
                  <div className="mt-4 w-full truncate text-center text-lg text-foreground">
                    {session?.user.name}
                  </div>
                  <div
                    className="w-full truncate text-center text-sm text-muted-foreground "
                    dir="ltr"
                  >
                    {session?.user.email}
                  </div>
                  <div className="flex w-full items-center justify-center gap-2  ">
                    <Badge className="  font-light rtl:py-1 rtl:text-[16px] rtl:tracking-widest ">
                      {session && t(`roles.${session.user.role}`)}
                    </Badge>
                    <MdOutlineAdminPanelSettings className="h-6 w-6 rounded-full text-primary" />
                  </div>
                </MotionDiv>
                <Separator className="my-4 bg-gray-300" />
              </>
            ))}
          {menuItems.map((item, index) => {
            if (isSubMenu(item)) {
              if (collapsed) {
                return (
                  <TooltipWrapper
                    key={index}
                    text={item.label}
                    side={locale === "ar" ? "left" : "right"}
                    asChild
                  >
                    <SubMenu
                      label={item.label}
                      icon={item.icon}
                      active={item.subMenu.some(
                        (subItem) =>
                          path === subItem.path && searchParams === 0,
                      )}
                    >
                      {item.subMenu.map((subItem) => (
                        <MenuItem
                          key={subItem.label}
                          active={path === subItem.path && searchParams === 0}
                          component={
                            <CustomLink
                              path={path}
                              href={subItem.path}
                              collapsed={collapsed}
                              text={subItem.label}
                              locale={locale}
                            />
                          }
                          icon={subItem.icon}
                          // className="relative z-20 text-inherit"
                        >
                          {subItem.label}
                        </MenuItem>
                      ))}
                    </SubMenu>
                  </TooltipWrapper>
                );
              }
              return (
                <SubMenu
                  key={index}
                  label={item.label}
                  icon={item.icon}
                  active={item.subMenu.some(
                    (subItem) => path === subItem.path && searchParams === 0,
                  )}
                >
                  {item.subMenu.map((subItem, subIndex) => (
                    <MenuItem
                      key={subIndex}
                      // className="relative z-20 text-inherit"
                      active={path === subItem.path && searchParams === 0}
                      component={
                        <CustomLink
                          path={path}
                          href={subItem.path}
                          collapsed={false}
                          text={subItem.label}
                          locale={locale}
                        />
                      }
                      icon={subItem.icon}
                    >
                      {subItem.label}
                    </MenuItem>
                  ))}
                </SubMenu>
              );
            } else {
              return (
                <MenuItem
                  key={index}
                  active={path === item.path && searchParams === 0}
                  component={
                    <CustomLink
                      href={item.path}
                      path={path}
                      collapsed={collapsed}
                      text={item.label}
                      locale={locale}
                    />
                  }
                  icon={item.icon}
                >
                  {item.label}
                </MenuItem>
              );
            }
          })}
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SideBar;

const CustomLink = ({
  path,
  href,
  children,
  className,
  collapsed,
  text,
  locale,
}: LinkProps & {
  className?: string;
  path?: string;
  children?: React.ReactNode;
  collapsed?: boolean;
  text: string;
  locale: "ar" | "en";
}) => {
  if (collapsed) {
    return (
      <TooltipWrapper
        text={text}
        side={locale === "ar" ? "left" : "right"}
        asChild
      >
        <Link href={href as any} className={cn("relative w-full", className)}>
          <div
            className={cn(
              "relative z-50 flex items-center",
              path === href ? "text-primary-foreground" : "text-foreground",
            )}
          >
            {children}
          </div>

          {href === path && (
            <MotionDiv
              layout
              layoutId="underline"
              className=" absolute inset-0 z-10 rounded bg-primary"
            />
          )}
        </Link>
      </TooltipWrapper>
    );
  }
  return (
    <Link href={href as any} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "relative z-50 flex items-center",
          path === href ? "text-primary-foreground" : "text-foreground",
        )}
      >
        {children}
      </div>

      {href === path && (
        <MotionDiv
          layout
          layoutId="underline"
          className=" absolute inset-0 z-10 rounded bg-primary"
        />
      )}
    </Link>
  );
};
