import React from "react";

interface SortProps {
    sort: string;
    setSort: (sort: string) => void;
    order: string;
    setOrder: (order: string) => void;
}

export default function SortOptions({ sort, setSort, order, setOrder }: SortProps){

    return (
        <div className="space-y-4">
            <label htmlFor="sort-select" className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                Sort By
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
                <select 
                    id="sort-select"
                    value={sort} 
                    onChange={(e) => setSort(e.target.value)} 
                    className="flex-1 px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 outline-none text-sm transition-all duration-300 bg-white/90 hover:bg-white font-medium shadow-lg hover:shadow-xl"
                    aria-label="Sort repositories by"
                >
                    <option value="stars">⭐ Most Stars</option>
                    <option value="forks">🍴 Most Forks</option>
                    <option value="updated">🕒 Recently Updated</option>
                </select>

                <select 
                    value={order} 
                    onChange={e => setOrder(e.target.value)}
                    className="flex-1 px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 outline-none text-sm transition-all duration-300 bg-white/90 hover:bg-white font-medium shadow-lg hover:shadow-xl"
                    aria-label="Sort order"
                >
                    <option value="desc">📈 Highest First</option>
                    <option value="asc">📉 Lowest First</option>
                </select>
            </div>
        </div>
    )
}