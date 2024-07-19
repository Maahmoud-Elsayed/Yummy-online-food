"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { changePwClientSchema } from "@/lib/validations-schema/user-schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { type FieldErrors, type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Container from "../ui/container";
import ErrorTemplate from "../ui/error-template";
import { Input } from "../ui/input";
import LoadingButton from "../ui/loading-button";
import PasswordFieldWithChecker from "./password-field-with-checker";

type ChangePasswordFormProps = {
  resetPasswordToken: string;
};
type FormData = z.infer<ReturnType<typeof changePwClientSchema>>;

const ChangePasswordForm = ({
  resetPasswordToken,
}: ChangePasswordFormProps) => {
  const router = useRouter();
  const t = useTranslations("pages.resetPassword");
  const tZod = useTranslations("zod");
  const { mutate, isPending } = api.auth.changePassword.useMutation({
    onSuccess: () => {
      toast.success(t("changedMsg"));
      router.push("/login");
    },
    onError(error) {
      const serverValidationError = error?.data?.zodError?.fieldErrors;
      if (serverValidationError) {
        Object.keys(serverValidationError).forEach((key) => {
          const errorMessages = serverValidationError[key] ?? [];
          setError(key as keyof FieldErrors<FormData>, {
            type: "server",
            message: errorMessages[0],
          });
        });
      } else {
        setError("root.serverError", {
          type: "server",
          message: error?.message,
        });
      }
    },
  });
  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
    resolver: zodResolver(changePwClientSchema(tZod)),
  });

  const {
    setError,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutate({ ...data, resetPasswordToken });
  };

  return (
    <Container className=" relative my-10 flex items-center justify-center   ">
      <div className="  mx-auto h-full w-full  max-w-md text-gray-600 lg:p-5 lg:pb-5  ">
        <div className="text-center">
          <h3 className="my-8 text-2xl font-semibold text-foreground sm:text-3xl ">
            {t("title")}
          </h3>
          {errors?.root?.serverError && (
            <ErrorTemplate>{errors?.root?.serverError?.message}</ErrorTemplate>
          )}
        </div>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
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
            </div>
            <LoadingButton
              type="submit"
              className="w-full"
              disabled={isPending}
              isLoading={isPending}
            >
              {t("reset")}
            </LoadingButton>
          </form>
        </Form>
      </div>
    </Container>
  );
};

export default ChangePasswordForm;
