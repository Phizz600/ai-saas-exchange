
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useIsMobile } from "@/hooks/use-mobile";

interface MarketplacePaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  maxFreePages?: number;
}

export const MarketplacePagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  maxFreePages,
}: MarketplacePaginationProps) => {
  const isMobile = useIsMobile();

  // For mobile, show fewer page numbers
  const getPageNumbers = () => {
    if (isMobile) {
      if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1);
      if (currentPage <= 2) return [1, 2, 3];
      if (currentPage >= totalPages - 1) return [totalPages - 2, totalPages - 1, totalPages];
      return [currentPage - 1, currentPage, currentPage + 1];
    }
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  return (
    <div className="flex justify-center my-8 px-4">
      <Pagination>
        <PaginationContent className="gap-1 sm:gap-2">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              className={`${currentPage === 1 ? "pointer-events-none opacity-50" : ""} min-w-[100px] hidden sm:flex`}
            />
            <PaginationLink
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              className={`${currentPage === 1 ? "pointer-events-none opacity-50" : ""} sm:hidden`}
            >
              Prev
            </PaginationLink>
          </PaginationItem>
          
          {getPageNumbers().map((page) => {
            const isLocked = maxFreePages && page > maxFreePages;
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className={`min-w-[40px] h-10 sm:h-9 relative ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {page}
                  {isLocked && (
                    <span className="absolute -top-1 -right-1 text-xs">🔒</span>
                  )}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : ""} min-w-[100px] hidden sm:flex`}
            />
            <PaginationLink
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : ""} sm:hidden`}
            >
              Next
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
