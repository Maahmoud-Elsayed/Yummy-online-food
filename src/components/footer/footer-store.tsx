import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { FaApple, FaGooglePlay } from "react-icons/fa";

const FooterStore = () => {
  const t = useTranslations("footer");
  return (
    <div className="w-full">
      <p className="font-semibold text-gray-200">{t("app")}</p>
      <div className="flex w-full flex-col gap-3 pt-7 sm:mt-3 sm:flex-row sm:pt-2">
        <Link
          href="#"
          className="group inline-flex w-full items-center justify-center rounded-lg bg-gray-700 px-4 py-2.5 text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 sm:w-auto sm:min-w-[166px] rtl:flex-row-reverse"
        >
          <FaApple className="mr-3 h-8 w-8 group-hover:text-primary" />

          <div className="text-left">
            <div className="mb-1 text-xs">Available on the</div>
            <div className="-mt-1 font-sans text-sm font-semibold">
              Apple Store
            </div>
          </div>
        </Link>

        <Link
          href="#"
          className="group inline-flex w-full items-center justify-center rounded-lg bg-gray-700 px-4 py-2.5 text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 sm:w-auto sm:min-w-[166px] rtl:flex-row-reverse"
        >
          <FaGooglePlay className="mr-3 h-7 w-7 group-hover:text-primary" />

          <div className="text-left">
            <div className="mb-1 text-xs">GET IT ON</div>
            <div className="-mt-1 font-sans text-sm font-semibold">
              Google Play
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default FooterStore;
