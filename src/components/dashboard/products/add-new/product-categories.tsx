import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Locale } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Controller, useFormContext } from "react-hook-form";

type CategoriesSelectProps = {
  categories?: {
    id: string;
    name_en: string;
    name_ar: string;
  }[];
};
export default function ProductCategories({
  categories,
}: CategoriesSelectProps) {
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext();
  const t = useTranslations("dashboard.addProduct.category");
  const locale = useLocale() as Locale;
  return (
    <Controller
      control={control}
      name="category"
      render={({ field }) => {
        const { ref, onChange, name, value, onBlur, disabled } = field;
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t("title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div className="flex gap-4">
                  <Label htmlFor="category">
                    {t("category")}{" "}
                    {errors.category && <span className="text-red-500">*</span>}
                  </Label>
                  {errors.category && (
                    <p className=" text-xs text-red-500">
                      {errors.category.message as string}
                    </p>
                  )}
                </div>
                <Select
                  onValueChange={onChange}
                  name={name}
                  disabled={isSubmitting || disabled}
                  value={value}
                >
                  <SelectTrigger id="category" aria-label="Select category">
                    <SelectValue
                      placeholder={t("select")}
                      ref={ref}
                      onBlur={onBlur}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category[`name_${locale}`]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );
      }}
    ></Controller>
  );
}
