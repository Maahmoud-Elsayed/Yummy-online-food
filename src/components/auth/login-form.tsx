"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginUserClientSchema } from "@/lib/validations-schema/user-schema";
import { Link, useRouter } from "@/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { buttonVariants } from "../ui/button";
import ErrorTemplate from "../ui/error-template";
import LoadingButton from "../ui/loading-button";
import PasswordFieldWithChecker from "./password-field-with-checker";
import SocialLogin from "./social-login";

type FormData = z.infer<ReturnType<typeof loginUserClientSchema>>;

type LoginFormProps = {
  isModal?: boolean;
};

const LoginForm = ({ isModal }: LoginFormProps) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl");
  const router = useRouter();
  const t = useTranslations("pages.login");
  const tZod = useTranslations("zod");
  const form = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
    resolver: zodResolver(loginUserClientSchema(tZod)),
  });
  const {
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const response = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl: callbackUrl ?? "/",
    });
    if (response?.error) {
      setError("root.serverError", {
        type: "server",
        message: response.error,
      });
    } else {
      if (!isModal) {
        router.push(response?.url ?? "/");
      }
    }
  };

  return (
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <PasswordFieldWithChecker showPw {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className=" flex items-center justify-end  py-2 text-sm">
            <Link
              href="/reset-password"
              className={buttonVariants({
                variant: "link",
                className: "pr-0 !text-muted-foreground hover:!text-primary",
              })}
            >
              {t("forgot")}
            </Link>
          </div>
          <LoadingButton
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {t("login")}
          </LoadingButton>
        </form>
      </Form>

      <SocialLogin
        isSubmitting={isSubmitting}
        isModal={isModal}
        callbackUrl={callbackUrl}
      />
      <p className="mt-4 block text-center text-sm">
        {t("create")}{" "}
        <Link
          href="/register"
          className={buttonVariants({ className: "!p-0", variant: "link" })}
        >
          {t("register")}
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
