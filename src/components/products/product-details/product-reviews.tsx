"use client";
import { api } from "@/trpc/react";

import LoadingSpinner from "@/components/loading/loading-spinner";
import LoadingButton from "@/components/ui/loading-button";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import RateModal from "../../modals/rate-modal";
import UserReview from "./user-review";

type ProductReviewsProps = {
  productId: string;
};
const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { data: session, status } = useSession();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    api.reviews.getProductReviews.useInfiniteQuery(
      {
        limit: 5,
        productId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        trpc: { abortOnUnmount: true },
        staleTime: Infinity,
      },
    );
  const { data: userReview, fetchStatus } = api.reviews.getUserReview.useQuery(
    productId,
    {
      enabled: !!session?.user.id,
      trpc: { abortOnUnmount: true },
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  );

  const t = useTranslations("pages.productDetails");
  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="mt-10 space-y-4">
      {session?.user.id && userReview && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground rtl:text-right">
            {t("yourReview")}
          </h3>
          <UserReview review={userReview} />
        </div>
      )}
      <div className="space-y-4">
        <div className="flex w-full items-center justify-between rtl:flex-row-reverse">
          <h3 className="text-lg font-semibold text-foreground ">
            ({data?.pages?.[0]?.count ?? 0}) {t("reviews")}
          </h3>
          {status === "authenticated" &&
            fetchStatus === "idle" &&
            !userReview && <RateModal productId={productId} withTrigger />}
        </div>
        {(data?.pages?.[0]?.count ?? 0) > 0 ? (
          data?.pages?.map((page) =>
            page.reviews?.reviews.map((review) => (
              <UserReview key={review.id} review={review} />
            )),
          )
        ) : (
          <div className="!mt-20 text-center text-lg text-muted-foreground">
            {t("noReviews")}
          </div>
        )}
        {hasNextPage && (
          <LoadingButton
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full"
            variant="secondary"
            size="sm"
            isLoading={isFetchingNextPage}
          >
            {t("seeMore")}
          </LoadingButton>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
