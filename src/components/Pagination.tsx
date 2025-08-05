import React from "react";

interface PaginationProps {
    page: number;
    setPage: (page: number) => void;
    hasNextPage: boolean;
    totalCount: number;
}

export default function Pagination({ page, setPage, hasNextPage, totalCount }: PaginationProps){
    // Calculate total pages (GitHub limits to 1000 items max, 10 per page = 100 pages max)
    const maxResults = Math.min(totalCount, 1000);
    const totalPages = Math.ceil(maxResults / 10);
    const maxPage = Math.min(totalPages, 100); // GitHub's hard limit
    
    // Calculate which page numbers to show
    const getVisiblePages = (): number[] => {
        const visiblePages: number[] = [];
        const maxVisiblePages = 5; // Show up to 5 page numbers
        
        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                visiblePages.push(i);
            }
        } else {
            // Smart pagination logic
            let start = Math.max(1, page - 2);
            let end = Math.min(totalPages, start + maxVisiblePages - 1);
            
            // Adjust start if we're near the end
            if (end - start < maxVisiblePages - 1) {
                start = Math.max(1, end - maxVisiblePages + 1);
            }
            
            for (let i = start; i <= end; i++) {
                visiblePages.push(i);
            }
        }
        
        return visiblePages;
    };
    
    const visiblePages = getVisiblePages();

    return (
        <nav aria-label="Repository pagination" className="d-flex justify-content-center mt-4">
            <ul className="pagination">
                {/* Previous Button */}
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button 
                        className="page-link"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        aria-label="Go to previous page"
                    >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="me-1">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                    </button>
                </li>
                
                {/* First page if not visible */}
                {visiblePages[0] > 1 && (
                    <>
                        <li className="page-item">
                            <button 
                                className="page-link"
                                onClick={() => setPage(1)}
                                aria-label="Go to page 1"
                            >
                                1
                            </button>
                        </li>
                        {visiblePages[0] > 2 && (
                            <li className="page-item disabled">
                                <span className="page-link">...</span>
                            </li>
                        )}
                    </>
                )}
                
                {/* Visible page numbers */}
                {visiblePages.map((pageNum) => (
                    <li key={pageNum} className={`page-item ${pageNum === page ? 'active' : ''}`}>
                        <button 
                            className="page-link"
                            onClick={() => setPage(pageNum)}
                            disabled={pageNum > maxPage}
                            aria-label={`Go to page ${pageNum}`}
                            aria-current={pageNum === page ? 'page' : undefined}
                        >
                            {pageNum}
                        </button>
                    </li>
                ))}
                
                {/* Last page if not visible */}
                {visiblePages[visiblePages.length - 1] < totalPages && totalPages <= 100 && (
                    <>
                        {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                            <li className="page-item disabled">
                                <span className="page-link">...</span>
                            </li>
                        )}
                        <li className="page-item">
                            <button 
                                className="page-link"
                                onClick={() => setPage(totalPages)}
                                disabled={totalPages > 100}
                                aria-label={`Go to page ${totalPages}`}
                            >
                                {totalPages}
                            </button>
                        </li>
                    </>
                )}
                
                {/* GitHub limit indicator */}
                {totalPages > 100 && (
                    <li className="page-item disabled">
                        <span className="page-link text-muted small">
                            (Limited to 100 pages)
                        </span>
                    </li>
                )}
                
                {/* Next Button */}
                <li className={`page-item ${!hasNextPage || page >= maxPage ? 'disabled' : ''}`}>
                    <button 
                        className="page-link"
                        onClick={() => setPage(page + 1)} 
                        disabled={!hasNextPage || page >= maxPage}
                        aria-label="Go to next page"
                    >
                        Next
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="ms-1">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </li>
            </ul>
        </nav>
    )
}