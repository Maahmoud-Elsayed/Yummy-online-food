import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { type Review } from "@/server/api/routers/reviews";
import { api } from "@/trpc/react";
import { Rating, ThinRoundedStar } from "@smastrom/react-rating";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "@/navigation";
import { useEffect, useRef, useState } from "react";

import { FaCheck, FaPencilAlt, FaRegUser } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { toast } from "sonner";

type UserReviewProps = {
  review: NonNullable<Review>;
};
const UserReview = ({ review }: UserReviewProps) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(review?.rate ?? 0);
  const t = useTranslations("pages.productDetails");
  const locale = useLocale();
  useEffect(() => {
    setValue(review.rate ?? 0);
  }, [review.rate]);
  const router = useRouter();
  const utils = api.useUtils();
  const { mutate, isPending } = api.reviews.submitReview.useMutation({
    onError: () => {
      toast.error(t("reviewError"));
      setValue(review?.rate ?? 0);
    },
    onSuccess: () => {
      utils.reviews.getUserReview.invalidate();
      utils.reviews.getProductReviews.invalidate();
      router.refresh();
      toast.success(t("reviewSuccess"));
      setEditing(false);
    },
  });
  const { data: session } = useSession();
  const commentRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className=" space-y-2 rounded-md border border-gray-200 bg-gray-50 p-2">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center rtl:md:flex-row-reverse">
        <div className="">
          <div className="flex items-center gap-2 rtl:flex-row-reverse">
            {review?.createdBy?.image ? (
              <div className="relative h-11 w-11 overflow-hidden rounded-full">
                <Image src={review.createdBy.image} fill alt="profile image" />
              </div>
            ) : (
              <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-gray-300 p-1.5">
                <FaRegUser className=" h-full w-full fill-gray-300 text-gray-300" />
              </div>
            )}
            <div>
              <h2 className=" text-sm text-foreground">
                {review.createdBy.name ?? review.createdBy.email?.split("@")[0]}
              </h2>
              <p className="text-xs text-muted-foreground rtl:text-right">
                {review?.createdAt?.toLocaleDateString(
                  `${locale === "en" ? "en-US" : "ar-EG"}`,
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  },
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start md:ltr:flex-row rtl:flex-row-reverse ">
          {session?.user.id === review.createdById && (
            <div className="flex justify-end">
              {!editing ? (
                <Button
                  variant="link"
                  // size="sm"
                  className="flex  h-fit gap-1 p-1 text-muted-foreground hover:text-primary"
                  onClick={() => setEditing((prev) => !prev)}
                >
                  <FaPencilAlt className="h-3 w-3 text-primary" />
                  {t("edit")}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="h-fit p-1"
                    disabled={isPending}
                    onClick={() => {
                      if (
                        value === review?.rate &&
                        commentRef.current?.value === review.comment
                      ) {
                        setEditing((prev) => !prev);
                      } else {
                        mutate({
                          productId: review.productId,
                          rate: value,
                          comment: commentRef.current?.value,
                        });
                      }
                    }}
                  >
                    <FaCheck className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-fit p-1"
                    onClick={() => {
                      setEditing(false);
                      setValue(review?.rate ?? 0);
                    }}
                  >
                    <IoMdClose className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          )}
          <Rating
            style={{ maxWidth: 100 }}
            itemStyles={{
              itemShapes: ThinRoundedStar,
              activeFillColor: "#f59e0b",
              // inactiveFillColor: "#ffedd5",
              inactiveStrokeColor: "#f59e0b",
              activeStrokeColor: "#f59e0b",
              itemStrokeWidth: 1,
            }}
            readOnly={session?.user.id !== review?.createdById || !editing}
            value={value}
            onChange={(value: number) => {
              setValue(value);
            }}
          />
        </div>
      </div>
      {editing ? (
        <Textarea
          ref={commentRef}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
          placeholder="Leave a comment"
          defaultValue={review?.comment ?? ""}
        />
      ) : review?.comment && !editing ? (
        <p className="text-sm text-muted-foreground rtl:text-right">
          {review.comment}
        </p>
      ) : null}
    </div>
  );
};

export default UserReview;
