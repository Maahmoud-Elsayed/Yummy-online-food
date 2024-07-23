import DiscountProducts from "@/components/home/discount-products";
import FeaturedProducts from "@/components/home/featured-products";
import FoodDelivery from "@/components/home/food-delivery";
import GetApp from "@/components/home/get-app";
import HeroSection from "@/components/home/hero-section";
import PopularProducts from "@/components/home/popular-products";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";

const Home = async ({ params: { locale } }: { params: { locale: string } }) => {
  setRequestLocale(locale);
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <FeaturedProducts />
      <DiscountProducts />
      <PopularProducts />
      <FoodDelivery />
      <GetApp />
    </div>
  );
};
export default Home;
