import React from "react";

interface PaginationProps {
    page: number;
    setPage: (page: number) => void;
    hasNextPage: boolean;
}

export default function Pagination({ page, setPage, hasNextPage }: PaginationProps){

    return (
        <div className="flex items-center justify-center space-x-4 mt-8 py-4">
            <button 
                disabled={page === 1} 
                onClick={() => setPage(page - 1)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200"
                aria-label="Go to previous page"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
            </button>
            
            <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-blue-50 border border-blue-200 rounded-lg">
                Page {page}
            </span>
            
            <button 
                onClick={() => setPage(page + 1)} 
                disabled={!hasNextPage}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200"
                aria-label="Go to next page"
            >
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    )
}