"use client";

import LoginFormModal from "@/components/modals/login-form-modal";
import { api } from "@/trpc/react";
import { Rating, ThinRoundedStar } from "@smastrom/react-rating";
import { useSession } from "next-auth/react";
import { useState } from "react";
import RateModal from "../../modals/rate-modal";
import { useLocale } from "next-intl";

type ProductRateProps = {
  avgRating: number;
  productId: string;
};
const ProductRate = ({ avgRating, productId }: ProductRateProps) => {
  const [openRate, setOpenRate] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const { data: session } = useSession();
  const userReview = api.reviews.getUserReview.useQuery(productId, {
    enabled: session?.user.id ? true : false,
    trpc: { abortOnUnmount: true },
    staleTime: Infinity,
  });
  const local = useLocale();

  return (
    <>
      <Rating
        className="-ml-0.5"
        style={{ maxWidth: 100, direction: local === "ar" ? "rtl" : "ltr" }}
        itemStyles={{
          itemShapes: ThinRoundedStar,
          activeFillColor: "#f59e0b",
          // inactiveFillColor: "#ffedd5",
          inactiveStrokeColor: "#f59e0b",
          activeStrokeColor: "#f59e0b",
          itemStrokeWidth: 1,
        }}
        value={avgRating}
        transition="zoom"
        halfFillMode="svg"
        onChange={() => {
          if (!session?.user.id) {
            setOpenLogin(true);
          } else {
            setOpenRate(true);
          }
        }}
      />
      <RateModal
        key={userReview.data?.rate ?? 0}
        open={openRate}
        setOpen={setOpenRate}
        productId={productId}
        userRate={userReview.data?.rate ?? 0}
        userComment={userReview.data?.comment ?? ""}
      />
      <LoginFormModal open={openLogin} setOpen={setOpenLogin} />
    </>
  );
};

export default ProductRate;
