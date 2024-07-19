"use client";
import { zodResolver } from "@hookform/resolvers/zod";

import ErrorTemplate from "@/components/ui/error-template";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import { useUploadThing } from "@/lib/uploadFiles";
import { updateUserClientSchema } from "@/lib/validations-schema/user-schema";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import {
  type FieldErrors,
  type SubmitHandler,
  useForm
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import ConfirmPassword from "../../modals/confirm-password";
import DeleteAccount from "../../modals/delete-account";
import PasswordForm from "./password-form";
import ProfileImage from "./profile-image";

type FormData = z.infer<ReturnType<typeof updateUserClientSchema>>;
const AccountForm = () => {
  const [open, setOpen] = useState(false);
  const { data: session, update } = useSession();
  const t = useTranslations("pages.myAccount");
  const tZod = useTranslations("zod");

  const sessionJson = JSON.stringify(session?.user);
  const formRef = useRef<HTMLFormElement>(null);
  const { mutateAsync, isPending } = api.auth.updateUser.useMutation({
    async onSuccess(data) {
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.user.name,
          email: data.user.email,
          image: data.user.image,
        },
        provider: data.provider,
      });

      setOpen(false);
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

  useEffect(() => {
    reset({
      userName: session?.user.name ?? "",
      email: session?.user.email ?? "",
      password: "",
      confirmPassword: "",
      image: null,
      currentPassword: session?.provider === "credentials" ? "" : "Pass",
      deleteImg: false,
    });
  }, [sessionJson]);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onUploadError: () => {
      setError("root.serverError", {
        type: "server",
        message: "something went wrong",
      });
    },
  });

  const methods = useForm({
    defaultValues: {
      userName: session?.user.name ?? "",
      email: session?.user.email ?? "",
      password: "",
      confirmPassword: "",
      image: null,
      currentPassword: session?.provider === "credentials" ? "" : "Pass",
      deleteImg: false,
    },
    mode: "onSubmit",
    resolver: zodResolver(updateUserClientSchema(tZod)),
  });
  const {
    setError,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = methods;
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (data.email !== session?.user.email && !data.password) {
      setError("password", {
        type: "server",
        message: "Required",
      });
      return;
    }
    if (data.image && data.image.length > 0) {
      toast.promise(
        async () => {
          const res = await startUpload([...data.image]);
          if (res?.[0]?.key && res[0].url) {
            const { key, url } = res[0];
            await mutateAsync({
              ...data,
              image: { key, url },
              provider:
                data.email !== session?.user.email &&
                session?.provider !== "credentials"
                  ? "credentials"
                  : session?.provider!,
            });
          } else {
            throw new Error("Something went wrong");
          }
        },
        {
          loading: t("toast.loading"),
          success: t("toast.success"),
          error: t("toast.failed"),
        },
      );
    } else {
      toast.promise(
        mutateAsync({
          ...data,
          image: undefined,
          provider:
            data.email !== session?.user.email &&
            session?.provider !== "credentials"
              ? "credentials"
              : session?.provider!,
        }),
        {
          loading: t("toast.loading"),
          success: t("toast.success"),
          error: t("toast.failed"),
        },
      );
    }
  };
  const confirmHandler = async () => {
    formRef.current?.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true }),
    );
  };
  return (
    <Form {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 space-y-6"
        ref={formRef}
      >
        {errors?.root?.serverError && (
          <ErrorTemplate>{errors?.root?.serverError.message}</ErrorTemplate>
        )}
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start">
          <ProfileImage
            id="image"
            name="image"
            img={session?.user.image ?? undefined}
            label={t("image")}
          />
          <div className="w-full space-y-2 md:self-end">
            <FormField
              control={control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("userName")}</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <PasswordForm />
            <div className="!mt-6 flex items-center gap-6 ltr:sm:justify-end rtl:flex-row-reverse rtl:sm:justify-start">
              <DeleteAccount provider={session?.provider as string} />

              {session?.provider === "credentials" ? (
                <ConfirmPassword
                  open={open}
                  setOpen={setOpen}
                  onConfirm={confirmHandler}
                  isLoading={isPending || isUploading || isSubmitting}
                />
              ) : (
                <LoadingButton
                  isLoading={isSubmitting || isPending}
                  type="submit"
                  disabled={isSubmitting || !isDirty || isPending}
                  className="w-full sm:w-auto"
                >
                  {t("save")}
                </LoadingButton>
              )}
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default AccountForm;
