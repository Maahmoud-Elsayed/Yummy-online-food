import { useMessages, useTranslations } from "next-intl";
import { Link } from "@/navigation";

const FooterNav = () => {
  const t = useTranslations("footer.links");
  const messages = useMessages();
  //@ts-ignore
  const keys = Object.keys(messages?.footer?.links ?? {});
  return (
    <div className="mt-10 grid grid-cols-2 items-center justify-between gap-6 sm:flex md:mt-0 md:space-y-0 ltr:flex-1 rtl:basis-1/2">
      {keys.map((key, idx) => {
        const linksKeys = Object.keys(
          //@ts-ignore
          messages?.footer?.links[key as any].links || {},
        );
        return (
          <ul className="space-y-4" key={idx}>
            <h4 className="font-medium text-gray-200">{t(`${key}.title`)}</h4>
            {linksKeys.map((linkKey, idx) => (
              <li key={idx}>
                <Link
                  href="#"
                  className="text-sm text-gray-400 hover:text-primary"
                >
                  {t(`${key}.links.${linkKey}`)}
                </Link>
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
};

export default FooterNav;
