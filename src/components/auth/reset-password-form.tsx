"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type FieldErrors, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPwClientSchema } from "@/lib/validations-schema/user-schema";
import { api } from "@/trpc/react";
import { useTranslations } from "next-intl";
import Container from "../ui/container";
import ErrorTemplate from "../ui/error-template";
import LoadingButton from "../ui/loading-button";
import SuccessTemplate from "../ui/success-templater";

type FormData = z.infer<ReturnType<typeof resetPwClientSchema>>;

const ResetPasswordForm = () => {
  const t = useTranslations("pages.resetPassword");
  const tZod = useTranslations("zod");
  const { mutate, isPending, isSuccess } = api.auth.resetPassword.useMutation({
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
      email: "",
    },
    mode: "onSubmit",
    resolver: zodResolver(resetPwClientSchema(tZod)),
  });
  const {
    setError,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutate({ ...data });
  };

  return (
    <Container className=" relative my-10 flex items-center justify-center   ">
      <div className="  mx-auto h-full w-full  max-w-md text-gray-600 lg:p-5 lg:pb-5  ">
        <div className="text-center">
          <h3 className="my-8 text-xl font-semibold text-foreground sm:text-3xl ">
            {t("title")}
          </h3>
          {errors?.root?.serverError && (
            <ErrorTemplate>{errors?.root?.serverError?.message}</ErrorTemplate>
          )}
          {isSuccess && <SuccessTemplate>{t("success")}</SuccessTemplate>}
        </div>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton
              type="submit"
              className="w-full"
              isLoading={isPending}
              disabled={isPending}
            >
              {t("reset")}
            </LoadingButton>
          </form>
        </Form>
      </div>
    </Container>
  );
};

export default ResetPasswordForm;
