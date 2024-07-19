import BreadcrumbResponsive from "@/components/ui/bread-crumb";
import Container from "@/components/ui/container";
import SideBar from "@/components/ui/side-bar";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { FaBookOpen, FaPlus } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { IoReceiptOutline } from "react-icons/io5";
import { LiaSitemapSolid } from "react-icons/lia";
import { RxDashboard } from "react-icons/rx";

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: "en" | "ar" };
}) {
  const data = {
    en: {
      title: {
        template: "%s | Dashboard",
        default: "Dashboard",
      },
    },
    ar: {
      title: {
        template: "%s | لوحة التحكم",
        default: "لوحة التحكم",
      },
    },
  };

  return data[locale] ?? data.en;
}

const DashboardLayout = ({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) => {
  setRequestLocale(locale);
  const t = useTranslations("navigation");
  const menuItems = [
    { label: t("overview"), path: "/dashboard", icon: <RxDashboard /> },
    {
      label: t("categories"),
      path: "/dashboard/categories",
      icon: <FaBookOpen />,
    },
    {
      label: t("products"),
      icon: <LiaSitemapSolid />,
      subMenu: [
        {
          label: t("allProducts"),
          path: "/dashboard/products",
          icon: <LiaSitemapSolid />,
        },
        {
          label: t("add-product"),
          path: "/dashboard/products/add-product",
          icon: <FaPlus />,
        },
      ],
    },
    {
      label: t("users"),
      path: "/dashboard/users",
      icon: <FaUsers />,
    },
    {
      label: t("orders"),
      path: "/dashboard/orders",
      icon: <IoReceiptOutline />,
    },
  ];
  return (
    <div className=" relative flex h-full">
      <SideBar menuItems={menuItems} withCollapsed />
      <main className=" flex-1">
        <Container className="mt-5 max-w-screen-2xl md:px-10">
          <BreadcrumbResponsive />
          {children}
        </Container>
      </main>
    </div>
  );
};
export default DashboardLayout;
