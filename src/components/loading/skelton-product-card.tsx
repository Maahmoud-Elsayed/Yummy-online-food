import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";

const SkeletonProductCard = () => {
  return (
    <Card className={cn("flex w-full items-center gap-2 p-4")}>
      <Skeleton className={cn("aspect-square w-[170px] rounded-md")} />
      <div className={cn("flex h-full flex-1 flex-col justify-between")}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton className={cn("h-4 w-full rounded-md")} key={index} />
        ))}
      </div>
    </Card>
  );
};

export default SkeletonProductCard;
