import { IoIosAddCircleOutline } from "react-icons/io";

import { Button } from "@/components/ui/button";
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

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import SizeRow from "./size-row";

export default function ProductSizes() {
  const {
    setValue,
    control,
    formState: { isSubmitting },
  } = useFormContext();
  const t = useTranslations("dashboard.addProduct.price");
  const { append, fields, remove } = useFieldArray({
    control,
    name: "sizes",
  });

  const sizes: [] =
    useWatch({
      control,
      name: "sizes",
    }) ?? [];

  const handleAddSize = () => {
    append({ size: "", price: "" });
    setValue("price", "", { shouldDirty: false });
  };

  const handleRemoveSize = (index: number) => {
    remove(index);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex w-full flex-col items-baseline justify-between gap-4 lg:flex-row">
          <div className={cn("w-full", sizes.length > 0 && "hidden")}>
            <FormField
              control={control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("price")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isSubmitting || sizes.length > 0}
                      min={0}
                      step={0.01}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={cn("w-full", sizes.length > 0 && "md:w-1/2")}>
            <FormField
              control={control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("discount")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isSubmitting}
                      min={0}
                      step={0.1}
                      max={100}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {sizes.length > 0 && (
          <div>
            <Table className="">
              <TableHeader>
                <TableRow>
                  <TableHead className="rtl:text-right">{t("price")}</TableHead>
                  <TableHead className="w-[100px] rtl:text-right">
                    {t("size")}
                  </TableHead>
                  <TableHead className="rtl:text-right">
                    {t("remove")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((size, index) => (
                  <SizeRow
                    key={size.id}
                    index={index}
                    handleRemoveSize={handleRemoveSize}
                    sizes={sizes}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-center border-t p-4">
        <Button
          size="sm"
          variant="ghost"
          type="button"
          className="gap-1"
          onClick={handleAddSize}
          disabled={fields.length >= 3 || isSubmitting}
        >
          <IoIosAddCircleOutline className="h-3.5 w-3.5" />
          {t("addSize")}
        </Button>
      </CardFooter>
    </Card>
  );
}
