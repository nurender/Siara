"use client";

import Link from "next/link";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function BlogPagination({ currentPage, totalPages, basePath = "/blog" }: BlogPaginationProps) {
  const getPageUrl = (page: number) => {
    if (page === 1) {
      return basePath;
    }
    return `${basePath}?page=${page}`;
  };

  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push("...");
      }
      
      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-siara-purple-200 bg-white text-siara-purple-700 font-dm-sans text-sm font-medium hover:bg-siara-purple-50 hover:border-siara-gold-400 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </Link>
      ) : (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-siara-purple-200 bg-siara-purple-50 text-siara-purple-400 font-dm-sans text-sm font-medium opacity-50 cursor-not-allowed">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </div>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-siara-purple-400 font-dm-sans">
                ...
              </span>
            );
          }
          
          const pageNum = page as number;
          const isActive = pageNum === currentPage;
          
          return (
            <Link
              key={pageNum}
              href={getPageUrl(pageNum)}
              className={`flex items-center justify-center w-10 h-10 rounded-xl font-dm-sans text-sm font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-siara-gold-500 to-siara-gold-400 text-siara-purple-950 shadow-lg shadow-siara-gold-500/20"
                  : "border border-siara-purple-200 bg-white text-siara-purple-700 hover:bg-siara-purple-50 hover:border-siara-gold-400"
              }`}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-siara-purple-200 bg-white text-siara-purple-700 font-dm-sans text-sm font-medium hover:bg-siara-purple-50 hover:border-siara-gold-400 transition-all"
        >
          <span>Next</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-siara-purple-200 bg-siara-purple-50 text-siara-purple-400 font-dm-sans text-sm font-medium opacity-50 cursor-not-allowed">
          <span>Next</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  );
}

