import { cn } from "@/lib/utils";
import Image from "next/image";
import { type ChangeEvent, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { buttonVariants } from "./button";
import { Label } from "./label";

type ImageFile = File & {
  preview: string;
};

type UploadButtonProps = {
  label: string;
  id: string;
  name: string;
  isLoading: boolean;
};

const UploadButton = (props: UploadButtonProps) => {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const { label, id, name, isLoading, ...rest } = props;
  const {
    register,
    resetField,
    formState: { errors, isSubmitting },
  } = useFormContext();

  useEffect(() => {
    // Revoke the data URIs to avoid memory leaks
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

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
    resetField(name);
    setFiles([]);
  };

  return (
    <div className="">
      {files.length > 0 ? (
        <div className="relative h-32 rounded-md shadow">
          <Image
            src={files[0]!.preview}
            alt={files[0]!.name}
            width={100}
            height={100}
            onLoad={() => URL.revokeObjectURL(files[0]!.preview)}
            className="h-full w-full rounded-md object-contain"
          />
          <button
            type="button"
            className="border-secondary-400 bg-secondary-400 absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full border transition-colors hover:bg-white"
            onClick={clearFiles}
            disabled={isSubmitting || isLoading}
          >
            <IoIosCloseCircleOutline className=" h-5 w-5 text-muted-foreground hover:text-foreground" />
          </button>
        </div>
      ) : null}
      <div className="my-3 flex items-center  gap-2">
        <Label
          htmlFor={id}
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: cn("cursor-pointer ", {
              " cursor-not-allowed opacity-80": isLoading || isSubmitting,
            }),
          })}
        >
          {label}
        </Label>
        {errors?.image?.message && typeof errors.image.message === "string" && (
          <p className="block text-start text-xs font-medium text-destructive">
            {errors.image.message}
          </p>
        )}
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
          {...rest}
        />
      </div>
    </div>
  );
};

export default UploadButton;
