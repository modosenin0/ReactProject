import React from "react";

interface PaginationProps {
    page: number;
    setPage: (page: number) => void;
    hasNextPage: boolean;
}

export default function Pagination({ page, setPage, hasNextPage }: PaginationProps){

    return (
        <div className="flex items-center justify-center space-x-6 mt-12 py-6">
            <button 
                disabled={page === 1} 
                onClick={() => setPage(page - 1)}
                className="flex items-center px-6 py-3 text-sm font-semibold text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/80 transition-all duration-300 shadow-md"
                aria-label="Go to previous page"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
            </button>
            
            <span className="px-6 py-3 text-sm font-bold text-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-md">
                Page {page}
            </span>
            
            <button 
                onClick={() => setPage(page + 1)} 
                disabled={!hasNextPage}
                className="flex items-center px-6 py-3 text-sm font-semibold text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/80 transition-all duration-300 shadow-md"
                aria-label="Go to next page"
            >
                Next
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    )
}