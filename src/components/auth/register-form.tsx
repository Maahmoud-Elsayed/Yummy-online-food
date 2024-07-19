"use client";

import { Link } from "@/navigation";
import SocialLogin from "./social-login";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createUserClientSchema } from "@/lib/validations-schema/user-schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/navigation";
import { type FieldErrors, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { buttonVariants } from "../ui/button";
import Container from "../ui/container";
import ErrorTemplate from "../ui/error-template";
import LoadingButton from "../ui/loading-button";
import PasswordFieldWithChecker from "./password-field-with-checker";
import { useTranslations } from "next-intl";

type FormData = z.infer<ReturnType<typeof createUserClientSchema>>;

const RegisterForm = () => {
  const router = useRouter();
  const t = useTranslations("pages.register");
  const tZod = useTranslations("zod");
  const { mutate, isPending } = api.auth.createUser.useMutation({
    onSuccess: () => {
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
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
    resolver: zodResolver(createUserClientSchema(tZod)),
  });
  const {
    setError,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutate({ ...data });
  };

  return (
    <Container className=" relative my-10 flex items-center justify-center   ">
      <div className="flex w-full max-w-md overflow-hidden rounded-lg p-5 lg:p-0">
        <div className="  mx-auto h-full w-full max-w-md text-gray-600 lg:p-5 lg:pb-5  ">
          <div className="text-center">
            <h3 className="my-8 text-2xl font-semibold text-foreground sm:text-3xl ">
              {t("title")}
            </h3>
            {errors?.root?.serverError && (
              <ErrorTemplate>
                {errors?.root?.serverError?.message}
              </ErrorTemplate>
            )}
          </div>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("userName")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
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
              <FormField
                control={form.control}
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

              {/* <PasswordFieldWithChecker
                type="password"
                id="password"
                name="password"
                register={register}
                label={t("password")}
                showPw
                pwStrength
                error={errors?.password?.message}
              /> */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("confirm")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <LoadingButton
                type="submit"
                className="w-full"
                disabled={isPending}
                isLoading={isPending}
              >
                {t("register")}
              </LoadingButton>
            </form>
          </Form>

          <SocialLogin isSubmitting={isPending} />
          <p className="mt-4 block text-center text-sm">
            {t("signIn")}{" "}
            <Link
              href="/login"
              className={buttonVariants({ className: "!p-0", variant: "link" })}
            >
              {t("login")}
            </Link>
          </p>
        </div>
      </div>
    </Container>
  );
};

export default RegisterForm;
