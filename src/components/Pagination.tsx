import React from "react";

interface PaginationProps {
    page: number;
    setPage: (page: number) => void;
    hasNextPage: boolean;
}

export default function Pagination({ page, setPage, hasNextPage }: PaginationProps){

    return (
        <nav aria-label="Repository pagination" className="d-flex justify-content-center mt-4">
            <ul className="pagination">
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
                
                <li className="page-item active">
                    <span className="page-link">
                        Page {page}
                    </span>
                </li>
                
                <li className={`page-item ${!hasNextPage ? 'disabled' : ''}`}>
                    <button 
                        className="page-link"
                        onClick={() => setPage(page + 1)} 
                        disabled={!hasNextPage}
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