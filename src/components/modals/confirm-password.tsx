import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import LoadingButton from "@/components/ui/loading-button";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import ErrorTemplate from "../ui/error-template";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

type ConfirmModalProps = {
  isLoading: boolean;
  onConfirm: () => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const ConfirmPassword = ({
  onConfirm,
  isLoading,
  open,
  setOpen,
}: ConfirmModalProps) => {
  const {
    control,
    resetField,
    formState: { isSubmitting, errors, isDirty },
  } = useFormContext();
  const t = useTranslations("pages.myAccount");

  useEffect(() => {
    if (
      errors.email ||
      errors.userName ||
      errors.password ||
      errors.confirmPassword
    ) {
      setOpen(false);
    }
  }, [errors]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        resetField("currentPassword", { defaultValue: "", keepDirty: false });
      }}
    >
      <DialogTrigger asChild>
        <LoadingButton
          variant="default"
          type="button"
          disabled={!isDirty}
          isLoading={isLoading || isSubmitting}
          className="w-full sm:w-auto"
        >
          {t("save")}
        </LoadingButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="rtl:text-right">
            {t("editAccount")}
          </DialogTitle>
          <DialogDescription className="rtl:text-right">
            {t("editMsg")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <FormField
            control={control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("currentPassword")}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          {errors.root?.serverError && (
            <ErrorTemplate>{errors.root?.serverError?.message}</ErrorTemplate>
          )}
        </div>
        <DialogFooter className="gap-2 rtl:gap-4 rtl:space-x-0">
          <DialogTrigger asChild>
            <Button
              type="button"
              disabled={isSubmitting || isLoading}
              variant="secondary"
            >
              {t("cancel")}
            </Button>
          </DialogTrigger>
          <LoadingButton
            type="button"
            disabled={isSubmitting || isLoading}
            isLoading={isLoading || isSubmitting}
            onClick={onConfirm}
          >
            {t("save")}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmPassword;
