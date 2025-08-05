import React from "react";

interface SortProps {
    sort: string;
    setSort: (sort: string) => void;
    order: string;
    setOrder: (order: string) => void;
}

export default function SortOptions({ sort, setSort, order, setOrder }: SortProps){

    return (
        <div className="space-y-3">
            <label htmlFor="sort-select" className="block text-sm font-semibold text-gray-800">
                Sort By
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
                <select 
                    id="sort-select"
                    value={sort} 
                    onChange={(e) => setSort(e.target.value)} 
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none text-sm transition-all duration-200 bg-white/80 hover:bg-white"
                    aria-label="Sort repositories by"
                >
                    <option value="stars">Stars</option>
                    <option value="forks">Forks</option>
                    <option value="updated">Recently Updated</option>
                </select>

                <select 
                    value={order} 
                    onChange={e => setOrder(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none text-sm transition-all duration-200 bg-white/80 hover:bg-white"
                    aria-label="Sort order"
                >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
            </div>
        </div>
    )
}
