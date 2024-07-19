import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFilter } from "@/hooks/use-filter";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const DiscountFilter = ({ className }: { className?: string }) => {
  const [discount, setDiscount] = useFilter<boolean>("discount", false);

  const t = useTranslations("pages.products.filter");
  return (
    <div className={cn(" space-y-2 px-4", className)}>
      <Label>{t("discount")}</Label>
      <div className="flex items-center gap-2">
        <Checkbox
          className="bg-white"
          id="discount"
          checked={discount}
          onCheckedChange={(checked) => {
            if (checked) {
              setDiscount(true);
            } else {
              setDiscount(false);
            }
          }}
        />
        <Label className=" text-nowrap" htmlFor="discount ">
          {t("discountOnly")}
        </Label>
      </div>
    </div>
  );
};

export default DiscountFilter;
