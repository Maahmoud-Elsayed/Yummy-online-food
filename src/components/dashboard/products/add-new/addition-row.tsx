import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableCell, TableRow } from "@/components/ui/table";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
type AdditionRowProps = {
  index: number;
  handleRemoveAddition: (index: number) => void;
};
const AdditionRow = ({ index, handleRemoveAddition }: AdditionRowProps) => {
  const {
    register,
    formState: { isSubmitting, errors },
  } = useFormContext();
  const t = useTranslations("dashboard.addProduct");
  return (
    <>
      <TableRow>
        <TableCell>
          <Label id={`additions[${index}].name.en`} className="sr-only">
            {t("productDetails.nameEn")}
          </Label>
          <Input
            id={`additions[${index}].name.en`}
            type="text"
            {...register(`additions[${index}].name.en`)}
            disabled={isSubmitting}
          />
        </TableCell>
        <TableCell>
          <Label id={`additions[${index}].name.ar`} className="sr-only">
            {t("productDetails.nameAr")}
          </Label>
          <Input
            id={`additions[${index}].name.ar`}
            type="text"
            {...register(`additions[${index}].name.ar`)}
            disabled={isSubmitting}
          />
        </TableCell>
        <TableCell>
          <Label id={`additions[${index}].price`} className="sr-only">
            {t("price.price")}
          </Label>
          <Input
            id={`additions[${index}].price`}
            type="number"
            {...register(`additions[${index}].price`)}
            disabled={isSubmitting}
            min={0}
            step={0.01}
            className="w-full"
          />
        </TableCell>

        <TableCell>
          <TooltipWrapper text="Remove">
            <Button
              size={"icon"}
              variant={"destructive"}
              type="button"
              onClick={() => handleRemoveAddition(index)}
              className="self-end"
            >
              <FaTrash />
            </Button>
          </TooltipWrapper>
        </TableCell>
      </TableRow>
      {((errors?.additions as any)?.[index]?.name?.en.message ||
        (errors?.additions as any)?.[index]?.name?.ar.message ||
        (errors?.additions as any)?.[index]?.price?.message) && (
        <TableRow>
          <TableCell>
            <p className="  text-xs text-destructive">
              {(errors?.additions as any)?.[index]?.name?.en.message}
            </p>
          </TableCell>
          <TableCell>
            <p className="  text-xs text-destructive">
              {(errors?.additions as any)?.[index]?.name?.ar.message}
            </p>
          </TableCell>
          <TableCell>
            <p className="  text-xs text-destructive">
              {(errors?.additions as any)?.[index]?.price?.message}
            </p>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default AdditionRow;
