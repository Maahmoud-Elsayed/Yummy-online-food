import { useTranslations } from "next-intl";
import { Link } from "@/navigation";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const SocialLinks = () => {
  const t = useTranslations("footer");
  return (
    <div>
      <h3 className="mt-7 text-gray-200  sm:mt-5">{t("social")}</h3>

      <div className="flex gap-6 pt-7  sm:mt-3 sm:pt-2 ">
        <Link href="#" className="text-gray-200 hover:text-primary">
          <FaFacebook className="h-6 w-6" />
          <span className="sr-only">Facebook page</span>
        </Link>
        <Link href="#" className="text-gray-200 hover:text-primary">
          <FaInstagram className="h-6 w-6" />

          <span className="sr-only">Instagram page</span>
        </Link>
        <Link href="#" className="text-gray-200 hover:text-primary">
          <FaTwitter className="h-6 w-6" />

          <span className="sr-only">Twitter page</span>
        </Link>
        <Link href="#" className="text-gray-200 hover:text-primary">
          <FaLinkedin className="h-6 w-6" />
          <span className="sr-only">Linkedin page</span>
        </Link>
        <Link href="#" className="text-gray-200 hover:text-primary">
          <FaYoutube className="h-6 w-6" />
          <span className="sr-only">Youtube channel</span>
        </Link>
      </div>
    </div>
  );
};

export default SocialLinks;
