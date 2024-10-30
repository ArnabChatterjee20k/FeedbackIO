"use client";
import { PropsWithChildren } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useParams, useRouter } from "next/navigation";

interface PaginatedViewProps extends PropsWithChildren {
  isNext: boolean;
  baseLink: string;
}

export default function PaginatedView({ children, isNext, baseLink }: PaginatedViewProps) {
  const params = useParams();
  const currentPage = params.pageId ? parseInt(params.pageId as string) : 1;
  const router = useRouter();

  const getVisiblePages = () => {
    const pages = [];
    const maxPages = isNext ? currentPage + 1 : currentPage; // +1 if isNext is true

    // Show up to 5 pages total
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(maxPages + 2, currentPage + 2); // Adjust to show one more page if isNext is true

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const constructPath = (pageNum: number) => {
    const cleanBaseLink = baseLink.replace(/\/+$/, '');
    return `/${cleanBaseLink}/${pageNum}`;
  };

  const handleNavigation = (pageNum: number, disabled: boolean) => {
    if (disabled) return;
    const path = constructPath(pageNum);
    router.prefetch(path);
    router.push(path);
  };

  const visiblePages = getVisiblePages();
  const showFirstPage = currentPage > 3;
  const showLastPage = isNext && currentPage < visiblePages[visiblePages.length - 1] - 1;

  return (
    <main className="container mx-auto py-8">
      {children}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <button
              onClick={() => handleNavigation(Math.max(1, currentPage - 1), currentPage === 1)}
              className="inline-flex"
            >
              <PaginationPrevious
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </button>
          </PaginationItem>

          {showFirstPage && (
            <>
              <PaginationItem>
                <button onClick={() => handleNavigation(1, false)} className="inline-flex">
                  <PaginationLink className="cursor-pointer">1</PaginationLink>
                </button>
              </PaginationItem>
              {currentPage > 4 && <PaginationEllipsis />}
            </>
          )}

          {visiblePages.map((page) => (
            <PaginationItem key={page}>
              <button 
                onClick={() => handleNavigation(page, page === currentPage)}
                className="inline-flex"
              >
                <PaginationLink
                  isActive={page === currentPage}
                  className={`cursor-pointer ${page === currentPage ? "font-bold text-blue-600" : ""}`} // Adjust styles for active page
                >
                  {page}
                </PaginationLink>
              </button>
            </PaginationItem>
          ))}

          {showLastPage && (
            <>
              <PaginationEllipsis />
              <PaginationItem>
                <button 
                  onClick={() => handleNavigation(visiblePages[visiblePages.length - 1] + 1, false)}
                  className="inline-flex"
                >
                  <PaginationLink className="cursor-pointer">
                    {visiblePages[visiblePages.length - 1] + 1}
                  </PaginationLink>
                </button>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <button
              onClick={() => handleNavigation(currentPage + 1, !isNext)}
              className="inline-flex"
            >
              <PaginationNext
                aria-disabled={!isNext}
                className={!isNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}
