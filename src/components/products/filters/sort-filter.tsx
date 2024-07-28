import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilter } from "@/hooks/use-filter";
import { useTranslations } from "next-intl";

type SortBy =
  | "price-asc"
  | "price-desc"
  | "date-asc"
  | "date-desc"
  | "rating-asc"
  | "rating-desc"
  | "sold-desc"
  | "none"
  | undefined;
const SortFilter = () => {
  const [sortBy, setSortBy] = useFilter<SortBy>("sortBy", undefined, {
    remove: "none",
  });
  const t = useTranslations("pages.products.sort");
  return (
    <div className=" mx-4 ">
      <Select
        onValueChange={(value) => setSortBy(value as SortBy)}
        value={sortBy}
      >
        <SelectTrigger className="w-full min-w-40 max-w-60 bg-white ">
          <SelectValue placeholder={t("sortBy")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">{t("none")}</SelectItem>
          <SelectGroup>
            <SelectLabel className="pl-2">{t("price")}</SelectLabel>
            <SelectItem value="price-asc">{t("lowToHigh")}</SelectItem>
            <SelectItem value="price-desc">{t("highToLow")}</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel className="pl-2">{t("date")}</SelectLabel>
            <SelectItem value="date-desc">{t("newest")}</SelectItem>
            <SelectItem value="date-asc">{t("oldest")}</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel className="pl-2">{t("rating")}</SelectLabel>
            <SelectItem value="rating-desc">{t("highest")}</SelectItem>
            <SelectItem value="rating-asc">{t("lowest")}</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel className="pl-2">{t("sales")}</SelectLabel>
            <SelectItem value="sold-desc">{t("mostSelling")}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortFilter;
