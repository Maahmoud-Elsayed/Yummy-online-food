import { useSession } from "next-auth/react";
import { useFormContext, useWatch } from "react-hook-form";
import PasswordFieldWithChecker from "../../auth/password-field-with-checker";
import { useTranslations } from "next-intl";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const PasswordForm = () => {
  const { data: session } = useSession();
  const t = useTranslations("pages.myAccount");
  const { control } = useFormContext();
  const emailInput = useWatch({
    name: "email",
    defaultValue: session?.user?.email,
    control,
  });
  return (
    <>
      {(session?.provider === "credentials" ||
        emailInput !== session?.user?.email) && (
        <>
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("password")}</FormLabel>
                <FormControl>
                  <PasswordFieldWithChecker {...field} showPw pwStrength />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("confirm")}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </>
  );
};

export default PasswordForm;
