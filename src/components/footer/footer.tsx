import { useTranslations } from "next-intl";
import Container from "../ui/container";
import FooterNav from "./footer-nav";
import FooterStore from "./footer-store";
import SocialLinks from "./social-links";

const Footer = () => {
  const t = useTranslations("footer");
  return (
    <footer className="items-center justify-center ">
      <div className="border-b border-gray-200 bg-[#262626] text-gray-600">
        <Container>
          <div className=" gap-6 py-10 sm:py-12  md:flex  md:justify-between   md:rtl:flex-row-reverse ">
            <div className=" ltr:flex-1">
              <FooterStore />
              <SocialLinks />
            </div>
            <FooterNav />
          </div>
        </Container>
      </div>
      <div className="bg-[#262626] py-4 shadow-inner">
        <div className="container-custom ">
          <span
            dir="ltr"
            className="mx-auto block text-center text-sm text-gray-200"
          >
            Copyright © 2024 YUMMY™ {t("copyright")}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
