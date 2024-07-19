import { createQueryString, removeQueryString } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

type UseFilterOptions = {
  delay?: number;
  route?: "push" | "replace";
  remove?: string | number;
};

export const useFilter = <T>(
  filterName: string,
  initialValue: T,
  opts: UseFilterOptions = {},
) => {
  const { delay = 500, route = "push", remove } = opts;
  const [filterValue, setFilterValue] = useState(initialValue);
  const [debouncedValue] = useDebounce(filterValue, delay);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const paramValue = searchParams.get(filterName);

  useEffect(() => {
    if (paramValue) {
      if (Array.isArray(debouncedValue)) {
        setFilterValue(paramValue.split("_") as T);
      } else if (paramValue === "true") {
        setFilterValue(true as T);
      } else if (typeof debouncedValue === "number") {
        setFilterValue(Number(paramValue) as T);
      } else {
        setFilterValue(paramValue as T);
      }
    }
  }, [paramValue]);

  useEffect(() => {
    if (Array.isArray(debouncedValue)) {
      if (debouncedValue.length > 0) {
        router[route](
          pathname +
            "?" +
            createQueryString(
              searchParams,
              filterName,
              debouncedValue.join("_"),
            ),
          { scroll: false },
        );
      } else {
        router[route](
          pathname + "?" + removeQueryString(searchParams, filterName),
          { scroll: false },
        );
      }
    } else {
      if (debouncedValue && debouncedValue !== remove) {
        if (
          typeof debouncedValue === "string" &&
          debouncedValue.trim() === ""
        ) {
          return;
        }
        router[route](
          pathname +
            "?" +
            createQueryString(
              searchParams,
              filterName,
              debouncedValue.toString().trim().replace(/\s+/g, " "),
            ),
          { scroll: false },
        );
      } else {
        router[route](
          pathname + "?" + removeQueryString(searchParams, filterName),
          { scroll: false },
        );
      }
    }
  }, [debouncedValue]);

  return [filterValue, setFilterValue] as const;
};
