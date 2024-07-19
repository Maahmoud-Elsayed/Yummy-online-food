import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableCell, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTranslations } from "next-intl";
import {
  Controller,
  useFormContext
} from "react-hook-form";
import { FaTrash } from "react-icons/fa";

type SizeRowProps = {
  index: number;
  handleRemoveSize: (index: number) => void;

  sizes?: { size: string; price: string }[];
};

const SizeRow = ({ index, handleRemoveSize, sizes }: SizeRowProps) => {
  const {
    register,
    control,
    formState: { errors, isSubmitting },
  } = useFormContext();
  const t = useTranslations("dashboard.addProduct.price");
  return (
    <>
      <TableRow>
        <TableCell>
          <Label id={`sizes[${index}].price`} className="sr-only">
            {t("price")}
          </Label>
          <Input
            id={`sizes[${index}].price`}
            type="number"
            {...register(`sizes[${index}].price`)}
            disabled={isSubmitting}
            min={0}
            step={0.01}
            className="w-full"
          />
        </TableCell>
        <TableCell>
          <Controller
            // key={size.id}
            control={control}
            name={`sizes[${index}].size` as const}
            render={({ field }) => {
              return (
                <ToggleGroup
                  type="single"
                  //   defaultValue="s"
                  variant="outline"
                  onValueChange={field.onChange}
                  {...field}
                  disabled={isSubmitting}
                >
                  <ToggleGroupItem
                    value="Small"
                    disabled={(sizes ?? []).some(
                      (s: { size: string }) => s.size === "Small",
                    )}
                    className="hover:bg-primary hover:text-primary-foreground disabled:bg-accent disabled:text-accent-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:opacity-100"
                  >
                    S
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="Medium"
                    disabled={(sizes ?? []).some(
                      (s: { size: string }) => s.size === "Medium",
                    )}
                    className="hover:bg-primary hover:text-primary-foreground disabled:bg-accent disabled:text-accent-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:opacity-100"
                  >
                    M
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="Large"
                    disabled={(sizes ?? []).some(
                      (s: { size: string }) => s.size === "Large",
                    )}
                    className="hover:bg-primary hover:text-primary-foreground disabled:bg-accent disabled:text-accent-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:opacity-100"
                  >
                    L
                  </ToggleGroupItem>
                </ToggleGroup>
              );
            }}
          ></Controller>
        </TableCell>
        <TableCell>
          <Button
            size={"icon"}
            variant={"destructive"}
            type="button"
            onClick={() => handleRemoveSize(index)}
            className="self-end"
            disabled={isSubmitting}
          >
            <FaTrash />
          </Button>
        </TableCell>
      </TableRow>
      {((errors?.sizes as any)?.[index]?.size?.message ||
        (errors?.sizes as any)?.[index]?.price?.message) && (
        <TableRow>
          <TableCell colSpan={3}>
            <p className="p-2  text-xs text-destructive">{t("error")}</p>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
export default SizeRow;
