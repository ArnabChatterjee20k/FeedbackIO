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
    if (currentPage > 1) pages.push(currentPage - 1); // Previous page
    pages.push(currentPage); // Current page
    if (isNext) pages.push(currentPage + 1); // Next page only if there's a next page

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

          {visiblePages.map((page) => (
            <PaginationItem key={page}>
              <button 
                onClick={() => handleNavigation(page, page === currentPage)}
                className="inline-flex"
              >
                <PaginationLink
                  isActive={page === currentPage}
                  className={`cursor-pointer ${page === currentPage ? "font-bold text-blue-600" : ""}`}
                >
                  {page}
                </PaginationLink>
              </button>
            </PaginationItem>
          ))}

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
