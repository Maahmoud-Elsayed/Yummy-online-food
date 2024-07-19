import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFilter } from "@/hooks/use-filter";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const PriceFilter = ({ className }: { className?: string }) => {
  const t = useTranslations("pages.products.filter");
  const [minPrice, setMinPrice] = useFilter<string | undefined>(
    "minPrice",
    undefined,
  );
  const [maxPrice, setMaxPrice] = useFilter<string | undefined>(
    "maxPrice",
    undefined,
  );

  return (
    <div className={cn(" px-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="min">{t("minPrice")}</Label>
        <Input
          id="min"
          type="number"
          min={0}
          onChange={(e) => setMinPrice(e.target.value)}
          value={minPrice}
          step={0.01}
          className="bg-white"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="max">{t("maxPrice")}</Label>
        <Input
          id="max"
          type="number"
          min={minPrice ? parseInt(minPrice) : 0}
          onChange={(e) => setMaxPrice(e.target.value)}
          value={maxPrice}
          className="bg-white"
          step={0.01}
        />
      </div>
    </div>
  );
};

export default PriceFilter;
