// src/components/admin/categories/Pagination.tsx
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
    currentPage, 
    totalPages, 
    onPageChange 
}) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    
    // Show max 7 pages
    let displayPages = pages;
    if (totalPages > 7) {
        if (currentPage <= 4) {
            displayPages = [...pages.slice(0, 5), -1, totalPages];
        } else if (currentPage >= totalPages - 3) {
            displayPages = [1, -1, ...pages.slice(totalPages - 5)];
        } else {
            displayPages = [
                1,
                -1,
                currentPage - 1,
                currentPage,
                currentPage + 1,
                -1,
                totalPages
            ];
        }
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeftIcon className="w-5 h-5" />
            </button>

            {displayPages.map((page, index) => (
                page === -1 ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            currentPage === page
                                ? 'bg-black text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        {page}
                    </button>
                )
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRightIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Pagination;