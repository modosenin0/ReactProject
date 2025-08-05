import React from "react";

interface SortProps {
    sort: string;
    setSort: (sort: string) => void;
    order: string;
    setOrder: (order: string) => void;
}

export default function SortOptions({ sort, setSort, order, setOrder }: SortProps){

    return (
        <div className="space-y-2">
            <label htmlFor="sort-select" className="block text-sm font-medium text-gray-700">
                Sort By
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
                <select 
                    id="sort-select"
                    value={sort} 
                    onChange={(e) => setSort(e.target.value)} 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all duration-200"
                    aria-label="Sort repositories by"
                >
                    <option value="stars">Stars</option>
                    <option value="forks">Forks</option>
                    <option value="updated">Recently Updated</option>
                </select>

                <select 
                    value={order} 
                    onChange={e => setOrder(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all duration-200"
                    aria-label="Sort order"
                >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
            </div>
        </div>
    )
}
