import LoadingSpinner from "@/components/loading/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { RiArrowRightUpLine } from "react-icons/ri";

const Transactions = () => {
  const t = useTranslations("dashboard.overview.transactions");
  const { data: orders, isLoading } =
    api.dashboard.orders.getLatestOrders.useQuery();
  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <>
      {orders && (
        <Card>
          <CardHeader className="flex  flex-row items-center justify-between">
            <div className="grid gap-2">
              <CardTitle>{t("title")}</CardTitle>
              <CardDescription>{t("description")}</CardDescription>
            </div>
            <Button asChild size="sm" className=" gap-1">
              <Link href="/dashboard/orders">
                {t("viewAll")}
                <RiArrowRightUpLine className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="rtl:text-right">
                    {t("customer")}
                  </TableHead>
                  <TableHead className="hidden md:table-cell rtl:text-right">
                    {t("status")}
                  </TableHead>
                  <TableHead className="hidden lg:table-cell rtl:text-right">
                    {t("date")}
                  </TableHead>
                  <TableHead className="text-right">{t("amount")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {order.customerEmail}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        className="w-full justify-center py-1 text-xs"
                        variant={
                          order.status === "PAID" ||
                          order.status === "DELIVERED"
                            ? "default"
                            : order.status === "CANCELED"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {t(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell ">
                      {order.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">${order.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Transactions;
