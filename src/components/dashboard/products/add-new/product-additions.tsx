import { Button } from "@/components/ui/button";

import { IoIosAddCircleOutline } from "react-icons/io";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import AdditionRow from "./addition-row";
import { useTranslations } from "next-intl";

const ProductAdditions = () => {
  const {
    control,
    formState: { isSubmitting },
  } = useFormContext();
  const { append, fields, remove } = useFieldArray({
    control,
    name: "additions",
  });

  const t = useTranslations("dashboard.addProduct");

  const additions: [] =
    useWatch({
      control,
      name: "additions",
      // defaultValue: [],
    }) ?? [];

  const handleAddAddition = () => {
    append({ id: crypto.randomUUID(), name: { en: "", ar: "" }, price: "" });
  };

  const handleRemoveAddition = (index: number) => {
    remove(index);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("additions.title")}</CardTitle>
        <CardDescription>{t("additions.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {additions.length > 0 && (
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead className="rtl:text-right">
                  {t("productDetails.nameEn")}
                </TableHead>
                <TableHead className="rtl:text-right">
                  {t("productDetails.nameAr")}
                </TableHead>
                <TableHead className="rtl:text-right">
                  {t("price.price")}
                </TableHead>
                <TableHead className="rtl:text-right">
                  {t("price.remove")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((size, index) => (
                <AdditionRow
                  key={size.id}
                  index={index}
                  handleRemoveAddition={handleRemoveAddition}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter className="justify-center border-t p-4">
        <Button
          size="sm"
          variant="ghost"
          type="button"
          className="gap-1"
          onClick={handleAddAddition}
          disabled={isSubmitting}
        >
          <IoIosAddCircleOutline className="h-3.5 w-3.5" />
          {t("additions.addAddition")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductAdditions;
