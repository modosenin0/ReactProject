import React from "react";

interface SortProps {
    sort: string;
    setSort: (sort: string) => void;
    order: string;
    setOrder: (order: string) => void;
}

export default function SortOptions({ sort, setSort, order, setOrder }: SortProps){

    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="border border-gray-300 rounded-md p-2">
                <option value="stars">Stars</option>
                <option value="forks">Forks</option>
                <option value="updated">Recently Updated</option>
            </select>

            <select value={order} onChange={e => setOrder(e.target.value)}>
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
            </select>
        </div>
    )
}
