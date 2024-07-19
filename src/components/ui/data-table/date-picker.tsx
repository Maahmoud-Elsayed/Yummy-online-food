"use client";

import { CalendarIcon } from "@radix-ui/react-icons";
import { addMonths, endOfDay, format, isSameMonth } from "date-fns";
import { useMediaQuery } from "react-responsive";

import { arEG, enUS } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { type Locale } from "@/navigation";
import { type Table } from "@tanstack/react-table";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

type DateRangePickerProps<TData> = {
  table: Table<TData>;
} & React.HTMLAttributes<HTMLDivElement>;

export function DatePickerWithRange<TData>({
  className,
  table,
}: DateRangePickerProps<TData>) {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const [month, setMonth] = useState<Date>(
    isMobile ? new Date() : addMonths(new Date(), -1),
  );

  const t = useTranslations("dashboard.users.table");
  const locale = useLocale() as Locale;

  const filteredDate = table.getColumn("createdAt")?.getFilterValue() as Date[];

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start  font-normal",
              !filteredDate && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {filteredDate?.[0] ? (
              filteredDate[1] ? (
                <>
                  {format(filteredDate[0], "LLL dd, y", {
                    locale: locale === "en" ? enUS : arEG,
                  })}{" "}
                  -{" "}
                  {format(filteredDate[1], "LLL dd, y", {
                    locale: locale === "en" ? enUS : arEG,
                  })}
                </>
              ) : (
                format(filteredDate[0], "LLL dd, y", {
                  locale: locale === "en" ? enUS : arEG,
                })
              )
            ) : (
              <span>{t("pickDate")}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            locale={locale === "en" ? enUS : arEG}
            dir={locale === "en" ? "ltr" : "rtl"}
            initialFocus
            mode="range"
            defaultMonth={new Date()}
            classNames={{
              nav_button_previous:
                "rtl:right-1 absolute ltr:left-1 top-1/2 -translate-y-1/2",
              nav_button_next:
                "rtl:left-1  ltr:right-1 absolute  top-1/2 -translate-y-1/2",

              months: "flex gap-2",
            }}
            selected={{
              from: filteredDate?.[0] ?? undefined,
              to: filteredDate?.[1] ?? undefined,
            }}
            onSelect={(range) =>
              table
                .getColumn("createdAt")
                ?.setFilterValue([
                  range?.from,
                  range?.to ? endOfDay(range.to) : undefined,
                ])
            }
            toDate={new Date()}
            weekStartsOn={6}
            numberOfMonths={isMobile ? 1 : 2}
            pagedNavigation
            modifiersClassNames={{
              disabled: "!cursor-not-allowed",
              today: "border border-primary",
              range_middle: "bg-primary rounded-none",
              range_start: "rounded-none ltr:rounded-l-md rtl:rounded-r-md ",
              range_end: "rounded-none ltr:rounded-r-md rtl:rounded-l-md",
            }}
            month={month}
            onMonthChange={setMonth}
          />
          <div className="flex items-center justify-between px-4 pb-4">
            <Button
              size={"sm"}
              variant={"secondary"}
              onClick={() =>
                setMonth(isMobile ? new Date() : addMonths(new Date(), -1))
              }
              disabled={isSameMonth(
                !isMobile ? new Date(addMonths(new Date(), -1)) : new Date(),
                month,
              )}
              className="disabled:!cursor-not-allowed"
            >
              {t("today")}
            </Button>
            <Button
              size={"sm"}
              variant={"secondary"}
              onClick={() => table.resetColumnFilters()}
              disabled={!filteredDate}
              className="disabled:!cursor-not-allowed"
            >
              {t("reset")}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
