import React from "react";

interface PaginationProps {
    page: number;
    setPage: (page: number) => void;
    hasNextPage: boolean;
}

export default function Pagination({ page, setPage, hasNextPage }: PaginationProps){

    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
            <button onClick={() => setPage(page + 1)} disabled={!hasNextPage}>Next</button>
        </div>
    )
}