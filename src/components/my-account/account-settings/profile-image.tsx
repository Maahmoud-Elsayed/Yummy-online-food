import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { type ChangeEvent, useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FaUser } from "react-icons/fa";

type ImageFile = File & {
  preview: string;
};

type UploadButtonProps = {
  label: string;
  id: string;
  name: string;
  img?: string;
};

const ProfileImage = (props: UploadButtonProps) => {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const t = useTranslations("pages.myAccount");
  const { label, id, name, img, ...rest } = props;
  const {
    register,
    setValue,
    resetField,
    control,
    formState: { errors, isSubmitting },
  } = useFormContext();

  useEffect(() => {
    // Revoke the data URIs to avoid memory leaks
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const { onChange, ...inputProps } = register(name);
  const deleteImg = useWatch({
    name: "deleteImg",
    defaultValue: false,
    control,
  });

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
    resetField(name);
    setFiles([]);
    if (img) {
      setValue("deleteImg", true, { shouldDirty: true });
    }
  };

  return (
    <div className="!min-w-40 max-w-40">
      <Dialog>
        <DialogTrigger asChild>
          <button disabled={!img || deleteImg}>
            {files.length > 0 ? (
              <div className="relative h-40 w-40 rounded-full border shadow-md">
                <Image
                  src={files[0]!.preview}
                  alt={files[0]!.name}
                  fill
                  onLoad={() => URL.revokeObjectURL(files[0]!.preview)}
                  className="h-full w-full rounded-full object-cover object-center "
                />
              </div>
            ) : img && !deleteImg ? (
              <div className="relative h-40 w-40 rounded-full border shadow-md">
                <Image
                  src={img}
                  alt="profile"
                  fill
                  className="h-full w-full rounded-full object-cover object-center"
                />
              </div>
            ) : (
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full border p-8  shadow">
                <FaUser className="h-full w-full text-gray-300" />
              </div>
            )}
          </button>
        </DialogTrigger>
        <DialogContent
          aria-describedby={undefined}
          className="flex aspect-square w-full max-w-sm items-center justify-center p-0"
        >
          {img && !deleteImg && (
            <div className="relative h-full w-full overflow-hidden rounded-lg">
              <Image src={img} alt="profile" fill />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="my-3 flex flex-col items-center  gap-2">
        {errors?.image?.message && typeof errors.image.message === "string" && (
          <p className="block text-start text-sm text-red-500">
            {errors.image.message}
          </p>
        )}
        <Label
          htmlFor={id}
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: cn("w-full cursor-pointer ", {
              " cursor-not-allowed opacity-80": isSubmitting,
            }),
          })}
        >
          {label}
        </Label>
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
          disabled={isSubmitting}
          {...rest}
        />
      </div>
      <Button
        size="sm"
        variant="destructive"
        className="diaabled:cursor-not-allowed w-full"
        onClick={clearFiles}
        disabled={
          isSubmitting ||
          (files.length < 1 && !img) ||
          (deleteImg && files.length < 1)
        }
        type="button"
      >
        {t("remove")}
      </Button>
    </div>
  );
};

export default ProfileImage;
