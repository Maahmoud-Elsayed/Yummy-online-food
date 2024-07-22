import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "@/trpc/react";

import Footer from "@/components/footer/footer";
import Navbar from "@/components/header/navbar";
import AuthProvider from "@/providers/auth-provider";

import AuthChecker from "@/components/auth/auth-checker";
import AdminLogin from "@/components/modals/admin-login";
import { Toaster } from "@/components/ui/sonner";
import { locales } from "@/navigation";
import { CartStoreProvider } from "@/providers/cart-store-provider";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  unstable_setRequestLocale as setRequestLocale,
} from "next-intl/server";
import { getBaseUrl } from "@/lib/utils";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { unstable_noStore as noStore } from "next/cache";
import { getServerAuthSession } from "@/server/auth";
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: "en" | "ar" };
}) {
  const data = {
    en: {
      title: {
        template: "%s | Yummy",
        default: "Yummy",
      },
      description:
        "Food, Desserts & more, delivered quickly to your doorstep. Contactless delivery available. Order & Track Your Food. Simple Food Ordering. Best Delivery Service.",
      icons: [{ rel: "icon", url: "/icon.png" }],
      openGraph: {
        title: "Yummy",
        description:
          "Food, Desserts & more, delivered quickly to your doorstep. Contactless delivery available. Order & Track Your Food. Simple Food Ordering. Best Delivery Service.",
        url: getBaseUrl(),
        siteName: "Yummy",
        images: [
          {
            url: `${getBaseUrl()}/icon.png`, // Must be an absolute URL
            width: 800,
            height: 600,
          },
          {
            url: `${getBaseUrl()}/icon.png`, // Must be an absolute URL
            width: 1800,
            height: 1600,
            alt: "Yummy alt",
          },
        ],
        authors: ["Mahmoud Elsayed"],
        locale: "en_US",
        type: "website",
      },
    },
    ar: {
      title: {
        template: "%s | Yummy",
        default: "Yummy",
      },
      description:
        "يتم توصيل الطعام والحلويات والمزيد بسرعة إلى عتبة داركم. تتوفر خدمة التوصيل بدون تلامس. اطلب طعامك وتتبعه. طلب ​​طعام بسيط. أفضل خدمة توصيل.",
      icons: [{ rel: "icon", url: "/icon.png" }],
      openGraph: {
        title: "Yummy",
        description:
          "يتم توصيل الطعام والحلويات والمزيد بسرعة إلى عتبة داركم. تتوفر خدمة التوصيل بدون تلامس. اطلب طعامك وتتبعه. طلب ​​طعام بسيط. أفضل خدمة توصيل.",
        url: getBaseUrl(),
        siteName: "Yummy",
        images: [
          {
            url: `${getBaseUrl()}/icon.png`, // Must be an absolute URL
            width: 800,
            height: 600,
          },
          {
            url: `${getBaseUrl()}/icon.png`, // Must be an absolute URL
            width: 1800,
            height: 1600,
            alt: "Yummy alt",
          },
        ],
        authors: ["Mahmoud Elsayed"],
        locale: "ar_EG",
        type: "website",
      },
    },
  };
  return data[locale] ?? data.en;
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  noStore();
  setRequestLocale(locale);

  const session = await getServerAuthSession();

  const messages = await getMessages({ locale });
  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${GeistSans.variable}`}
    >
      <body className="relative flex h-full  flex-col bg-background font-sans antialiased">
        <TRPCReactProvider>
          <AuthProvider session={session}>
            <NextIntlClientProvider messages={messages}>
              <CartStoreProvider>
                <div className="relative min-h-screen w-full flex-1 flex-grow ">
                  <Navbar />
                  <main className="overflow-x-hidden">{children}</main>
                  <ScrollToTop />
                </div>

                <Footer />
                <AdminLogin />
                <Toaster
                  // position="top-center"
                  richColors
                  theme="light"
                  closeButton
                />
                <AuthChecker />
              </CartStoreProvider>
            </NextIntlClientProvider>
          </AuthProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
