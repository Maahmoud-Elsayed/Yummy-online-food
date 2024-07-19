import Image from "next/image";
import { MdOutlineFileUpload } from "react-icons/md";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChangeEvent, useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useTranslations } from "next-intl";

type ImageFile = File & {
  preview: string;
};

type ProductImageProps = {
  image?: string;
  id: string;
  name: string;
  isLoading: boolean;
};

export default function ProductImage({
  image,
  id,
  name,
  isLoading,
}: ProductImageProps) {
  const [files, setFiles] = useState<ImageFile[]>([]);

  const {
    register,
    resetField,
    control,
    formState: { errors, isSubmitting },
  } = useFormContext();
  const t = useTranslations("dashboard.addProduct.images");
  const imageValue = useWatch({ name, control, defaultValue: undefined });

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  useEffect(() => {
    if (!imageValue) {
      setFiles([]);
    }
  }, [imageValue]);

  const { onChange, ...inputProps } = register(name);

  const onDrop = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles([
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      ]);
    }
  };

  const clearFiles = () => {
    resetField(name, { defaultValue: undefined });
    setFiles([]);
  };
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>
          {t("title")}{" "}
          {errors?.image?.message && <span className=" text-red-500">*</span>}
        </CardTitle>
        {errors?.image?.message && (
          <CardDescription className="block text-start text-xs text-red-500">
            {errors.image.message as string}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {files.length > 0 ? (
            <div className="relative">
              <Image
                src={files[0]!.preview}
                alt={files[0]!.name}
                width={300}
                height={300}
                onLoad={() => URL.revokeObjectURL(files[0]!.preview)}
                className="mx-auto  aspect-square w-full  max-w-[300px] rounded-md object-fill"
              />
              <button
                type="button"
                className=" absolute -right-3 -top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white"
                onClick={clearFiles}
                disabled={isSubmitting || isLoading}
              >
                <IoIosCloseCircleOutline className=" h-5 w-5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          ) : image && files.length === 0 ? (
            <Image
              alt="Product image"
              className="mx-auto aspect-square w-full max-w-[300px] rounded-md object-fill"
              height="300"
              src={image}
              width="300"
            />
          ) : (
            <Image
              alt="Product image"
              className="mx-auto aspect-square w-full max-w-[300px] rounded-md object-cover"
              height="300"
              src="/assets/images/image-placeholder.jpg"
              width="300"
            />
          )}
          <div className="flex justify-center lg:justify-start">
            <label
              htmlFor={id}
              className={buttonVariants({
                variant: "outline",
                className:
                  "flex aspect-square !h-20 w-20 cursor-pointer flex-col  items-center justify-center gap-2 rounded-md border border-dashed border-gray-500",
              })}
            >
              <MdOutlineFileUpload className="h-6 w-6 text-muted-foreground" />
              <span className=" text-sm text-foreground">{t("upload")}</span>
            </label>
            <input
              id={id}
              type="file"
              {...inputProps}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                onChange(e);
                onDrop(e);
              }}
              disabled={isLoading || isSubmitting}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
