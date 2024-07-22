"use client";

import { useUploadThing } from "@/lib/uploadFiles";

import { Form } from "@/components/ui/form";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FieldErrors, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import LoadingSpinner from "@/components/loading/loading-spinner";
import ErrorTemplate from "@/components/ui/error-template";
import LoadingButton from "@/components/ui/loading-button";
import { createProductClientSchema } from "@/lib/validations-schema/product-schema";
import { ProductInfo } from "@/server/api/routers/products";
import { notFound, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import ProductAdditions from "./product-additions";
import ProductCategories from "./product-categories";
import ProductDetails from "./product-details";
import ProductImage from "./product-image";
import ProductSizes from "./product-sizes";
import { useTranslations } from "next-intl";

type FormData = z.infer<ReturnType<typeof createProductClientSchema>>;
type CreateFormProps = {
  product?: {
    id: string;
    description_en: string;
    description_ar: string;
    image: string;
    name_en: string;
    name_ar: string;
    price?: string;
    discount: string;
    categoryId: string;
    imageKey: string;
    additions: {
      id: string;
      price: string;
      name: {
        en: string;
        ar: string;
      };
    }[];
    sizes: {
      size: "Small" | "Medium" | "Large";
      price: string;
    }[];
  };
};

export default function CreateProduct() {
  const productId = useSearchParams().get("p");
  const t = useTranslations("dashboard.addProduct");
  const {
    data: productInfo,
    isLoading,
    error,
  } = api.products.getProductInfo.useQuery(productId!, {
    enabled: !!productId,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    select: useCallback((data: ProductInfo) => {
      if (data) {
        return {
          ...data,
          additions:
            data.additions?.map((addition) => ({
              ...addition,
              price: addition.price.toString(),
            })) ?? [],
          sizes:
            data.sizes && data.sizes.length > 0
              ? data.sizes?.map((size) => ({
                  size: size.size as "Small" | "Medium" | "Large",
                  price: size.price.toString(),
                }))
              : [],

          price: data.price?.toString() ?? "",
          discount: data.discount?.toString() ?? "",
        };
      }
    }, []),
  });

  useEffect(() => {
    if (error) {
      notFound();
    }
  }, [error]);

  let product: typeof productInfo = undefined;
  if (productInfo) {
    product = productInfo;
  }

  return (
    <>
      <h2 className=" text-xl font-medium text-foreground">
        {productId ? t("edit") : t("add")}
      </h2>
      {isLoading ? <LoadingSpinner /> : <CreateForm product={product} />}
    </>
  );
}

function CreateForm({ product }: CreateFormProps) {
  const utils = api.useUtils();
  const t = useTranslations("dashboard.addProduct");
  const tZod = useTranslations("zod");

  const { data: categoryNames } = api.categories.getAllNames.useQuery(
    undefined,
    { staleTime: Infinity, refetchOnWindowFocus: false },
  );

  const { mutateAsync, isPending } =
    api.dashboard.products.createOrUpdateProduct.useMutation({
      onSuccess: () => {
        utils.categories.getAll.invalidate();
        utils.dashboard.getDashboardSummary.invalidate();
        if (product?.id) {
          utils.products.getProductInfo.invalidate(product.id);
        }
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
  const methods = useForm<FormData>({
    defaultValues: {
      productId: product?.id ?? "",
      productName_en: product?.name_en ?? "",
      productName_ar: product?.name_ar ?? "",
      description_en: product?.description_en ?? "",
      description_ar: product?.description_ar ?? "",
      price: product?.price ?? "",
      discount: product?.discount ?? "",
      category: product?.categoryId ?? "",
      sizes: product?.sizes ?? [],
      additions: product?.additions ?? [],
      image: undefined,
    },
    mode: "onSubmit",
    resolver: zodResolver(createProductClientSchema(tZod)),
  });
  const {
    setError,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting, dirtyFields },
  } = methods;

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    toast.promise(
      async () => {
        if (data.image && data.image.length > 0) {
          const res = await startUpload([...data.image]);
          if (res?.[0]?.key && res[0].url) {
            const { key, url } = res[0];
            await mutateAsync({
              ...data,
              productId: data.productId,
              image: { key, url },
            });
          } else {
            throw new Error("something went wrong");
          }
        } else {
          await mutateAsync({
            ...data,
            productId: data.productId,
            image: undefined,
          });
        }
        if (data.productId) {
          reset({ ...data, image: undefined }, { keepDirty: false });
        } else {
          reset();
        }
      },
      {
        loading: t("toast.loading", {
          status: data.productId ? "update" : "create",
        }),
        success: t("toast.success", {
          status: data.productId ? "update" : "create",
        }),
        error: t("toast.failed", {
          status: data.productId ? "update" : "create",
        }),
      },
    );
  };

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="my-10 space-y-8">
        {errors?.root?.serverError && (
          <ErrorTemplate>{errors?.root?.serverError?.message}</ErrorTemplate>
        )}

        <div className=" grid   gap-4 lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <ProductDetails />
            <ProductSizes />
            <ProductAdditions />
            <ProductCategories categories={categoryNames} />
          </div>
          <div className="grid auto-rows-max items-start gap-8">
            <ProductImage
              id="image"
              name="image"
              isLoading={isPending}
              image={product?.image}
            />
            <div className="flex w-full justify-end">
              <LoadingButton
                type="submit"
                className="w-full sm:w-fit lg:w-full "
                isLoading={isSubmitting || isPending || isUploading}
                disabled={
                  isSubmitting ||
                  isUploading ||
                  isPending ||
                  Object.keys(dirtyFields).length === 0
                    ? true
                    : false
                }
              >
                {product ? t("update") : t("create")}
              </LoadingButton>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
