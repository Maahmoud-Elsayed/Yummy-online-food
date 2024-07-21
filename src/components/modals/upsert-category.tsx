"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useUploadThing } from "@/lib/uploadFiles";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type Categories } from "@/server/api/routers/categories";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FieldErrors, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import ErrorTemplate from "@/components/ui/error-template";
import UploadButton from "@/components/ui/upload-button";
import { upsertCategoryClientSchema } from "@/lib/validations-schema/category-schema";

import LoadingButton from "@/components/ui/loading-button";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaPencil } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { toast } from "sonner";
import { Button } from "../ui/button";

type FormData = z.infer<ReturnType<typeof upsertCategoryClientSchema>>;

type UpsertCategoryProps = {
  category?: Categories[number];
};

export default function UpsertCategory({ category }: UpsertCategoryProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations(
    `${category?.id ? "dashboard.categories.modals.edit" : "dashboard.categories.modals.new"}`,
  );
  const tZod = useTranslations("zod");
  const utils = api.useUtils();
  const { mutateAsync, isPending } =
    api.dashboard.categories.upsertCategory.useMutation({
      onSuccess: () => {
        utils.categories.getAll.invalidate();
        utils.dashboard.getDashboardSummary.invalidate();
        if (!category?.id) {
          reset();
        }
        router.refresh();
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
      id: category?.id ?? undefined,
      categoryName_en: category?.name_en ?? "",
      categoryName_ar: category?.name_ar ?? "",
      image: undefined,
    },
    mode: "onSubmit",
    resolver: zodResolver(upsertCategoryClientSchema(tZod)),
  });
  const {
    setError,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = methods;

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    toast.promise(
      async () => {
        if (data.image && data.image.length > 0) {
          const res = await startUpload([...data.image]);

          if (res?.[0]?.key && res[0].url) {
            const { key, url } = res[0];
            await mutateAsync({
              categoryName_en: data.categoryName_en,
              categoryName_ar: data.categoryName_ar,
              id: data.id,
              image: { key, url },
            });
          } else {
            throw new Error("Something went wrong");
          }
        } else {
          await mutateAsync({
            ...data,
            image: undefined,
          });
        }
      },
      {
        loading: t("toast.loading"),
        success: t("toast.success"),
        error: t("toast.failed"),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {category?.id ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button size={"icon"} variant={"default"}>
                  <FaPencil />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent className="bg-black text-white">
              <p>{t("edit")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className=" h-full w-full max-w-[150px] rounded-xl border border-dashed border-gray-300 md:max-w-full"
          >
            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
              <IoMdAdd className="h-14 w-14 text-gray-300" />
              <span className="mb-2">{t("addCategory")}</span>
            </div>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent aria-describedby={undefined} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <div>
          {errors?.root?.serverError && (
            <ErrorTemplate>{errors?.root?.serverError?.message}</ErrorTemplate>
          )}
          <Form {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-3">
                <FormField
                  control={control}
                  name="categoryName_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("nameEn")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="categoryName_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("nameAr")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <UploadButton
                  id="image"
                  label={t("uploadImg")}
                  name="image"
                  isLoading={isPending || isUploading}
                />
              </div>
              <DialogFooter>
                <LoadingButton
                  type="submit"
                  className="w-full"
                  disabled={
                    isSubmitting || isPending || !isDirty || isUploading
                  }
                  isLoading={isSubmitting || isPending}
                >
                  {t("save")}
                </LoadingButton>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
