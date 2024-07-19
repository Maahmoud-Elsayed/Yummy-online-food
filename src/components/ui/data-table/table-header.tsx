import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon,
} from "@radix-ui/react-icons";
import { type Column } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { type Locale } from "@/navigation";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const locale = useLocale() as Locale;
  const t = useTranslations("dashboard.users.table");
  if (!column.getCanSort()) {
    return <div className={cn("rtl:text-right", className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2 ", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 data-[state=open]:bg-accent ltr:-ml-3 rtl:-mr-3 "
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDownIcon className="h-4 w-4 ltr:ml-2 rtl:mr-2" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="h-4 w-4 ltr:ml-2 rtl:mr-2" />
            ) : (
              <CaretSortIcon className="h-4 w-4 ltr:ml-2 rtl:mr-2" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={locale === "ar" ? "end" : "start"}>
          <DropdownMenuItem
            onClick={() => column.toggleSorting(false)}
            className="rtl:flex-row-reverse "
          >
            <ArrowUpIcon className=" h-3.5 w-3.5 text-muted-foreground/70 ltr:mr-2  rtl:ml-2" />
            {t("asc")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => column.toggleSorting(true)}
            className="rtl:flex-row-reverse "
          >
            <ArrowDownIcon className="h-3.5 w-3.5 text-muted-foreground/70 ltr:mr-2 rtl:ml-2" />
            {t("desc")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => column.toggleVisibility(false)}
            className="rtl:flex-row-reverse "
          >
            <EyeNoneIcon className="h-3.5 w-3.5 text-muted-foreground/70 ltr:mr-2 rtl:ml-2" />
            {t("hide")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
