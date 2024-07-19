import LoadingSpinner from "@/components/loading/loading-spinner";
import ProductOverview from "@/components/products/product-details/product-overview";
import ProductReviews from "@/components/products/product-details/product-reviews";
import ProductTabs from "@/components/products/product-details/product-tabs";
import BreadcrumbResponsive from "@/components/ui/bread-crumb";
import Container from "@/components/ui/container";
import MotionDiv from "@/components/ui/motion-div";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type ProductDetailsProps = {
  params: {
    productId: string;
    locale: "en" | "ar";
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: ProductDetailsProps) {
  const id = params.productId;
  const locale = params.locale;
  let product;
  try {
    product = await api.products.getProductInfo(id);
  } catch (error) {
    notFound();
  }
  if (!product) {
    notFound();
  }

  return {
    title: product[`name_${locale}`],
    description: product[`description_${locale}`],
  };
}
const ProductDetails = ({ params, searchParams }: ProductDetailsProps) => {
  const tapParam = searchParams?.tab ?? "overview";
  return (
    <Container className="my-10">
      <BreadcrumbResponsive className="mb-5" isProduct />
      <Tabs
        defaultValue={tapParam as string}
        value={tapParam as string}
        className="w-full "
      >
        <div className="flex w-full justify-center">
          <ProductTabs />
        </div>
        <TabsContent value="overview">
          <MotionDiv
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 100 }}
            transition={{ ease: "easeIn", duration: 0.5 }}
          >
            <Suspense fallback={<LoadingSpinner />}>
              <ProductOverview productId={params.productId} />
            </Suspense>
          </MotionDiv>
        </TabsContent>
        <TabsContent value="reviews">
          <MotionDiv
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 100 }}
            transition={{ ease: "easeIn", duration: 0.5 }}
          >
            <ProductReviews productId={params.productId} />
          </MotionDiv>
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default ProductDetails;
