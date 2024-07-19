import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Table } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { BsXCircle } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import DebouncedInput from "../debounced-input";
import { Label } from "../label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../select";
import { DatePickerWithRange } from "./date-picker";

type FilterMenuProps<TData> = {
  table: Table<TData>;
};

type FilterOptions = {
  name: string;
  meta: {
    filterFn: string;
    type: string;
    filterOptions: { name: string; value: string }[] | null;
    name: string;
  };
};

const FilterMenu = <TData,>({ table }: FilterMenuProps<TData>) => {
  const filters: FilterOptions[] = useMemo(() => {
    const filters: FilterOptions[] = [];
    table.getVisibleLeafColumns().forEach((column) => {
      if (column.getCanFilter()) {
        filters.push({
          name: column.id,
          meta: column.columnDef.meta as FilterOptions["meta"],
        });
      }
    });
    return filters;
  }, [table.getVisibleLeafColumns().length]);

  const [filterBy, setFilterBy] = useState<FilterOptions | null>(
    filters[0] ?? null,
  );

  const t = useTranslations("dashboard.users.table");

  const filterHandler = (value: string) => {
    table.resetColumnFilters();
    setFilterBy(filters.find((f) => f.name === value) ?? null);
  };

  const filterContent = useMemo(() => {
    if (!filterBy) {
      return null;
    }
    switch (filterBy?.meta.filterFn) {
      case "search":
        return (
          <div className="flex items-center gap-4">
            <Label className="min-w-fit text-nowrap">
              {filterBy.meta.name}
            </Label>
            <DebouncedInput
              type={filterBy.meta.type}
              placeholder={`${t("search")} ${filterBy.meta.name} ...`}
              value={
                (table.getColumn(filterBy.name)?.getFilterValue() as string) ??
                ""
              }
              onChange={(value) =>
                table.getColumn(filterBy.name)?.setFilterValue(value)
              }
            />
          </div>
        );

      case "date":
        return (
          <div className="flex items-center gap-2">
            <Label>{filterBy.meta.name}</Label>
            <DatePickerWithRange table={table} />
          </div>
        );

      case "range":
        return (
          <div className="flex items-center gap-2">
            <Label>{filterBy.meta.name}</Label>

            <div className="flex gap-4">
              <DebouncedInput
                type={filterBy.meta.type}
                placeholder={t("from")}
                value={
                  (
                    table.getColumn(filterBy.name)?.getFilterValue() as [
                      number,
                      number,
                    ]
                  )?.[0] ?? ""
                }
                onChange={(value) =>
                  table
                    .getColumn(filterBy.name)
                    ?.setFilterValue((old: [number, number]) => [
                      value,
                      old?.[1],
                    ])
                }
              />
              <DebouncedInput
                type={filterBy.meta.type}
                placeholder={t("to")}
                value={
                  (
                    table.getColumn(filterBy.name)?.getFilterValue() as [
                      number,
                      number,
                    ]
                  )?.[1] ?? ""
                }
                onChange={(value) =>
                  table
                    .getColumn(filterBy.name)
                    ?.setFilterValue((old: [number, number]) => [
                      old?.[0],
                      value,
                    ])
                }
              />
            </div>
          </div>
        );

      case "select":
        return (
          <div className="flex items-center gap-2">
            <Label>{filterBy.meta.name}</Label>
            <Select
              onValueChange={(value) =>
                value === "ALL"
                  ? table.resetColumnFilters()
                  : table.getColumn(filterBy.name)?.setFilterValue(value)
              }
              name={filterBy.name}
              value={
                (table.getColumn(filterBy.name)?.getFilterValue() as string) ??
                "ALL"
              }
            >
              <SelectTrigger className="w-[150px] bg-white">
                <SelectValue placeholder={`Select a ${filterBy.meta.name}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("status")}</SelectLabel>
                  <SelectItem key={"ALL"} value={"ALL"}>
                    {t("all")}
                  </SelectItem>
                  {filterBy.meta.filterOptions?.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return null;
    }
  }, [filterBy?.name, table.getColumn(filterBy?.name ?? "")?.getFilterValue()]);

  return (
    <div className="flex items-center gap-2">
      {filterBy && filterContent}
      <div className="flex items-center gap-1 ">
        {table.getColumn(filterBy?.name ?? "")?.getFilterValue() !==
          undefined && (
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.resetColumnFilters()}
          >
            <span className="sr-only">Clear filters</span>
            <BsXCircle className="h-5 w-5 text-muted-foreground" />
          </Button>
        )}
        {/* <div
          className={cn(filterBy?.meta.filterFn === "range" && "self-end")}
        ></div> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <FaFilter className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="rtl:text-right">
              {t("filter")}
            </DropdownMenuLabel>
            {filters.length > 0 &&
              filters.map((item) => (
                <DropdownMenuItem
                  onClick={() => filterHandler(item.name)}
                  key={item.name}
                  className="rtl:flex-row-reverse"
                >
                  {item.meta.name}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default FilterMenu;
