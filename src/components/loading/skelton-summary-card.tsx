import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const SkeltonSummaryCard = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="w-3/4">
          <Skeleton className="h-6 w-full" />
        </CardTitle>
        <Skeleton className="inline h-8 w-8 rounded-full" />
      </CardHeader>
      <CardContent>
        <div className="flex w-full flex-col gap-2">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SkeltonSummaryCard;
