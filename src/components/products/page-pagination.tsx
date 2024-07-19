import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Button } from "../ui/button";

type PagePaginationProps = {
  page?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  searchParams?: { [key: string]: string | string[] | undefined };
  pathName: string;
};
export function PagePagination({
  page = 5,
  totalPages = 5,
  hasNextPage,
  searchParams,
  pathName,
}: PagePaginationProps) {
  const pageNumbers = [];
  const offsetNumber = 1;
  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }
  return (
    <Pagination className="absolute bottom-0 left-0 z-10 mt-10 w-full">
      <PaginationContent>
        <PaginationItem>
          {page > 1 ? (
            <PaginationPrevious
              href={{
                pathname: pathName,
                query: { ...searchParams, page: page - 1 },
              }}
            />
          ) : (
            <Button className="flex gap-1" variant="ghost" disabled>
              <FaChevronLeft className="h-4 w-4 rtl:rotate-180" />
              {/* <span>Previous</span> */}
            </Button>
          )}
        </PaginationItem>
        {page > 2 && (
          <>
            <PaginationItem>
              <PaginationLink
                href={{
                  pathname: pathName,
                  query: { ...searchParams, page: 1 },
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>
            {page > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}
        {pageNumbers.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              href={{
                pathname: pathName,
                query: { ...searchParams, page: pageNumber },
              }}
              isActive={pageNumber === page}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}
        {page < totalPages - 1 && (
          <>
            {page < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                href={{
                  pathname: pathName,
                  query: { ...searchParams, page: totalPages },
                }}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          {hasNextPage ? (
            <PaginationNext
              href={{
                pathname: pathName,
                query: { ...searchParams, page: page + 1 },
              }}
            />
          ) : (
            <Button className="flex gap-1" variant="ghost" disabled>
              {/* <span>Next</span> */}
              <FaChevronRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
