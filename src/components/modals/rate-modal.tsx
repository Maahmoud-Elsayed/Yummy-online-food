"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { Rating, ThinRoundedStar } from "@smastrom/react-rating";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { useRef, useState } from "react";
import LoadingButton from "../ui/loading-button";
import ErrorTemplate from "../ui/error-template";
import { toast } from "sonner";

type RateModalProps = {
  withTrigger?: boolean;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  productId: string;
  userRate?: number;
  userComment?: string;
};

const RateModal = ({
  withTrigger = false,
  open,
  setOpen,
  productId,
  userRate,
  userComment,
}: RateModalProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [value, setValue] = useState(userRate ?? 0);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const utils = api.useUtils();
  const t = useTranslations("pages.productDetails");

  const { mutate, isPending, error } = api.reviews.submitReview.useMutation({
    onError: () => {
      toast.error(t("reviewError"));
    },
    onSuccess: async () => {
      await utils.reviews.getProductReviews.invalidate();
      await utils.reviews.getUserReview.invalidate();
      router.refresh();
      toast.success(t("reviewSuccess"));
      // setValue(userRate ?? 0);
      if (!withTrigger && setOpen) {
        setOpen(false);
      } else {
        setOpenDialog(false);
      }
    },
  });

  return (
    <Dialog
      open={open ? open : openDialog}
      onOpenChange={(open) => {
        setValue(userRate ?? 0);
        if (setOpen) {
          setOpen(open);
        } else {
          setOpenDialog(open);
        }
      }}
    >
      {withTrigger ? (
        <DialogTrigger asChild>
          <Button variant="default" size="sm">
            {t("addReview")}
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="rtl:text-right">{t("addReview")}</DialogTitle>
          <DialogDescription className="rtl:text-right">
            {t("share")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
          {error && (
            <ErrorTemplate className="mb-3 mt-0">{error.message}</ErrorTemplate>
          )}
          <div className="flex items-center justify-between">
            <Label>{t("yourRating")} :</Label>
            <Rating
              className=" !focus:outline-none"
              style={{ maxWidth: 120, outline: "none" }}
              itemStyles={{
                itemShapes: ThinRoundedStar,
                activeFillColor: "#f59e0b",
                // inactiveFillColor: "#ffedd5",
                inactiveStrokeColor: "#f59e0b",
                activeStrokeColor: "#f59e0b",
                itemStrokeWidth: 1,
              }}
              readOnly={false}
              value={value}
              transition="zoom"
              halfFillMode="svg"
              onChange={(value: number) => {
                setValue(value);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">{t("yourReview")}</Label>
            <div className="mt-1">
              <Textarea
                name="comment"
                id="comment"
                ref={commentRef}
                placeholder={t("addComment")}
                defaultValue={userComment ?? ""}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <LoadingButton
            type="button"
            size={"sm"}
            disabled={value === 0 || isPending}
            isLoading={isPending}
            onClick={() => {
              if (
                value === userRate &&
                commentRef.current?.value === userComment
              ) {
                if (setOpen) {
                  setOpen(false);
                } else {
                  setOpenDialog(false);
                }
              } else {
                mutate({
                  productId,
                  rate: value,
                  comment: commentRef.current?.value.trim() ?? undefined,
                });
              }
            }}
          >
            {t("submit")}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RateModal;
