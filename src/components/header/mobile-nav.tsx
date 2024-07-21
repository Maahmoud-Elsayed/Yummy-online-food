"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import { IoMenu } from "react-icons/io5";

import { type Locale } from "@/navigation";
import { type Categories } from "@/server/api/routers/categories";
import { signOut, useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { FaBookOpen, FaPlus, FaRegUser } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { GiWhiteBook } from "react-icons/gi";
import { IoReceiptOutline } from "react-icons/io5";
import { LiaSitemapSolid } from "react-icons/lia";
import { RxDashboard } from "react-icons/rx";
import { useMediaQuery } from "react-responsive";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Logo from "./logo";

const MobileNav = ({ categories }: { categories: Categories }) => {
  const { data: session } = useSession();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const locale = useLocale() as Locale;
  const t = useTranslations();

  const ListItems = useMemo(
    () => [
      {
        header: t("navigation.my-account"),
        icon: <FaRegUser />,
        items: [
          {
            name: t("navigation.accountSettings"),
            href: "/my-account",
            icon: <FaRegUser />,
          },
          {
            name: t("navigation.my-orders"),
            href: "my-account/orders",
            icon: <IoReceiptOutline />,
          },
        ],
      },
      {
        header: t("navigation.dashboard"),
        icon: <RxDashboard />,
        items: [
          {
            name: t("navigation.overview"),
            href: "/dashboard",
            icon: <RxDashboard />,
          },
          {
            name: t("navigation.categories"),
            href: "/dashboard/categories",
            icon: <FaBookOpen />,
          },
          {
            header: t("navigation.products"),
            icon: <LiaSitemapSolid />,
            items: [
              {
                name: t("navigation.allProducts"),
                href: "/dashboard/products",
                icon: <LiaSitemapSolid />,
              },
              {
                name: t("navigation.add-product"),
                href: "/dashboard/products/add-product",
                icon: <FaPlus />,
              },
            ],
          },
          {
            name: t("navigation.orders"),
            href: "/dashboard/orders",
            icon: <IoReceiptOutline />,
          },
          {
            name: t("navigation.users"),
            href: "/dashboard/users",
            icon: <FaUsers />,
          },
        ],
      },
    ],
    [locale],
  );

  const signOutHahndler = () => {
    signOut({
      redirect: true,
      callbackUrl: "/",
    });
  };
  return (
    <Sheet>
      <SheetTrigger className="group flex  items-center  md:hidden">
        <IoMenu
          aria-hidden="true"
          className="h-8 w-8 text-gray-400 group-hover:text-gray-500"
        />
      </SheetTrigger>
      <SheetContent
        aria-describedby={undefined}
        side={isMobile && locale === "ar" ? "right" : "left"}
        className="flex  max-h-screen w-full flex-col overflow-y-auto pr-0 sm:max-w-lg"
      >
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>
            <Logo className="h-7 w-full" />
          </SheetTitle>
        </SheetHeader>
        <Separator />
        <div className=" space-y-4 overflow-y-auto">
          <div className="flex w-full flex-col pr-6">
            <Accordion type="multiple">
              <AccordionItem value="item-1">
                <AccordionTrigger className=" hover:no-underline">
                  <div className="flex items-center gap-4">
                    <GiWhiteBook />
                    <span>{t("navigation.categories")}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="grid-col-1 grid w-full gap-2 ">
                    <li>
                      <SheetTrigger asChild>
                        <Link
                          href="/products"
                          className={buttonVariants({
                            variant: "secondary",
                            className:
                              "w-full !justify-start gap-4 hover:no-underline",
                          })}
                        >
                          <FaBookOpen />
                          <span>{t("navigation.allProducts")}</span>
                        </Link>
                      </SheetTrigger>
                    </li>
                    {categories?.map((category) => (
                      <li key={category.id}>
                        <SheetTrigger asChild>
                          <Link
                            href={{
                              pathname: "/products",
                              query: { category: category.name_en },
                            }}
                            className={buttonVariants({
                              variant: "secondary",
                              className:
                                "w-full !justify-start gap-4 hover:no-underline",
                            })}
                          >
                            <FaBookOpen />
                            <span>{category[`name_${locale}`]}</span>
                          </Link>
                        </SheetTrigger>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              {ListItems.map((item) =>
                item.header === "dashboard" &&
                (!session ||
                  (session.user.role !== "ADMIN" &&
                    session.user.role !== "MANAGER")) ? null : (
                  <AccordionItem key={item.header} value={item.header}>
                    <AccordionTrigger className=" hover:no-underline">
                      <div className="flex items-center gap-4">
                        {item.icon}
                        <span>{item.header}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="grid-col-1 grid w-full gap-2">
                        {item.items.map((el) =>
                          el.header && el.items ? (
                            <AccordionItem
                              key={el.header}
                              value={el.header}
                              className="border-none "
                            >
                              <AccordionTrigger
                                className={buttonVariants({
                                  variant: "secondary",
                                  className:
                                    " justify-between  hover:no-underline",
                                })}
                              >
                                <div className="flex items-center gap-4">
                                  {el.icon}
                                  <span>{el.header}</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="ms-4 pb-0">
                                <ul className="grid-col-1 grid w-full gap-2">
                                  {el.items.map((el, idx) => (
                                    <li
                                      key={el.name}
                                      className={cn(idx === 0 && "mt-2")}
                                    >
                                      <SheetTrigger asChild>
                                        <Link
                                          href={el.href}
                                          className={buttonVariants({
                                            variant: "secondary",
                                            className:
                                              "w-full !justify-start gap-4",
                                          })}
                                        >
                                          {el.icon}
                                          <span>{el.name}</span>
                                        </Link>
                                      </SheetTrigger>
                                    </li>
                                  ))}
                                </ul>
                              </AccordionContent>
                            </AccordionItem>
                          ) : (
                            <li key={el.name}>
                              <SheetTrigger asChild>
                                <Link
                                  href={el.href!}
                                  className={buttonVariants({
                                    variant: "secondary",
                                    className: "w-full !justify-start gap-4",
                                  })}
                                >
                                  {el.icon}
                                  <span>{el.name}</span>
                                </Link>
                              </SheetTrigger>
                            </li>
                          ),
                        )}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ),
              )}
            </Accordion>
          </div>
          <div className="space-y-4 pr-6">
            {session ? (
              <div className="flex w-full">
                <SheetTrigger asChild>
                  <Button
                    className="w-full"
                    variant={"default"}
                    onClick={signOutHahndler}
                  >
                    {t("header.buttons.signOut")}
                  </Button>
                </SheetTrigger>
              </div>
            ) : (
              <div className="flex w-full flex-col gap-4 sm:flex-row">
                <SheetTrigger asChild>
                  <Link
                    href="/login"
                    className={buttonVariants({
                      className: "w-full",
                    })}
                  >
                    {t("header.buttons.signIn")}
                  </Link>
                </SheetTrigger>
                <SheetTrigger asChild>
                  <Link
                    href="/register"
                    className={buttonVariants({
                      className: "w-full",
                    })}
                  >
                    {t("header.buttons.register")}
                  </Link>
                </SheetTrigger>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;

//     <div>
//       <div className='relative z-40 lg:hidden'>
//         <div className='fixed inset-0 bg-black bg-opacity-25' />
//       </div>

//       <div className='fixed overflow-y-scroll overscroll-y-none inset-0 z-40 flex'>
//         <div className='w-4/5'>
//           <div className='relative flex w-full max-w-sm flex-col overflow-y-auto bg-white pb-12 shadow-xl'>
//             <div className='flex px-4 pb-2 pt-5'>
//               <button
//                 type='button'
//                 onClick={() => setIsOpen(false)}
//                 className='relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400'>
//                 <X className='h-6 w-6' aria-hidden='true' />
//               </button>
//             </div>

//             <div className='mt-2'>
//               <ul>
//                 {PRODUCT_CATEGORIES.map((category) => (
//                   <li
//                     key={category.label}
//                     className='space-y-10 px-4 pb-8 pt-10'>
//                     <div className='border-b border-gray-200'>
//                       <div className='-mb-px flex'>
//                         <p className='border-transparent text-gray-900 flex-1 whitespace-nowrap border-b-2 py-4 text-base font-medium'>
//                           {category.label}
//                         </p>
//                       </div>
//                     </div>

//                     <div className='grid grid-cols-2 gap-y-10 gap-x-4'>
//                       {category.featured.map((item) => (
//                         <div
//                           key={item.name}
//                           className='group relative text-sm'>
//                           <div className='relative aspect-square overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75'>
//                             <Image
//                               fill
//                               src={item.imageSrc}
//                               alt='product category image'
//                               className='object-cover object-center'
//                             />
//                           </div>
//                           <Link
//                             href={item.href}
//                             className='mt-6 block font-medium text-gray-900'>
//                             {item.name}
//                           </Link>
//                         </div>
//                       ))}
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div className='space-y-6 border-t border-gray-200 px-4 py-6'>
//               <div className='flow-root'>
//                 <Link
//                   onClick={() => closeOnCurrent('/sign-in')}
//                   href='/sign-in'
//                   className='-m-2 block p-2 font-medium text-gray-900'>
//                   Sign in
//                 </Link>
//               </div>
//               <div className='flow-root'>
//                 <Link
//                   onClick={() => closeOnCurrent('/sign-up')}
//                   href='/sign-up'
//                   className='-m-2 block p-2 font-medium text-gray-900'>
//                   Sign up
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
