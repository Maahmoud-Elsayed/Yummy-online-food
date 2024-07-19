import { cn } from "@/lib/utils";
import SkeletonProductCard from "./skelton-product-card";

const SkeletonProductList = () => {
  return (
    <ul
      className={cn(
        "grid w-full grid-cols-1 justify-items-center gap-5 md:grid-cols-2 md:gap-6  lg:grid-cols-2",
      )}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <li className="flex w-full justify-center" key={index}>
          <SkeletonProductCard />
        </li>
      ))}
    </ul>
  );
};

export default SkeletonProductList;
