import React from "react";

interface PaginationProps {
    page: number;
    setPage: (page: number) => void;
    hasNextPage: boolean;
}

export default function Pagination({ page, setPage, hasNextPage }: PaginationProps){

    return (
        <div className="flex items-center justify-center space-x-8 mt-16 py-8">
            <button 
                disabled={page === 1} 
                onClick={() => setPage(page - 1)}
                className="flex items-center px-8 py-4 text-base font-bold text-gray-700 bg-white/80 backdrop-blur-xl border-2 border-gray-200 rounded-2xl hover:bg-white hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/80 transition-all duration-300 shadow-xl hover:scale-105 transform hover:border-blue-300"
                aria-label="Go to previous page"
            >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
            </button>
            
            <div className="px-8 py-4 text-base font-black text-blue-800 bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-300 rounded-2xl shadow-xl backdrop-blur-sm">
                Page {page}
            </div>
            
            <button 
                onClick={() => setPage(page + 1)} 
                disabled={!hasNextPage}
                className="flex items-center px-8 py-4 text-base font-bold text-gray-700 bg-white/80 backdrop-blur-xl border-2 border-gray-200 rounded-2xl hover:bg-white hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/80 transition-all duration-300 shadow-xl hover:scale-105 transform hover:border-blue-300"
                aria-label="Go to next page"
            >
                Next
                <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    )
}