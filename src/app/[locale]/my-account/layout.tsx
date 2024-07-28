import BreadcrumbResponsive from "@/components/ui/bread-crumb";
import Container from "@/components/ui/container";
import SideBar from "@/components/ui/side-bar";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { FaRegUser } from "react-icons/fa";
import { IoReceiptOutline } from "react-icons/io5";

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: "en" | "ar" };
}) {
  const data = {
    en: {
      title: {
        template: "%s - My Account",
        default: "My Account",
      },
    },
    ar: {
      title: {
        template: "%s - حسابي",
        default: "حسابي",
      },
    },
  };

  return data[locale] ?? data.en;
}

const ProfileLayout = ({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) => {
  setRequestLocale(locale);
  const t = useTranslations("navigation");
  const menuItems = [
    { label: t("accountSettings"), path: "/my-account", icon: <FaRegUser /> },
    {
      label: t("my-orders"),
      path: "/my-account/orders",
      icon: <IoReceiptOutline />,
    },
  ];
  return (
    <div className=" relative flex h-full  ">
      <SideBar menuItems={menuItems} />
      <main className="flex-1 ">
        <Container className="mt-6 md:ps-8 xl:pe-44">
          <BreadcrumbResponsive />
          {children}
        </Container>
      </main>
    </div>
  );
};
export default ProfileLayout;
