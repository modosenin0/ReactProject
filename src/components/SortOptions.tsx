import React from "react";

interface SortProps {
    sort: string;
    setSort: (sort: string) => void;
    order: string;
    setOrder: (order: string) => void;
}

export default function SortOptions({ sort, setSort, order, setOrder }: SortProps){

    return (
        <div className="col-lg-4 col-md-6 col-12 mb-3">
            <label htmlFor="sort-select" className="form-label fw-medium">
                Sort By
            </label>
            <div className="row g-2">
                <div className="col-sm-6">
                    <select 
                        id="sort-select"
                        value={sort} 
                        onChange={(e) => setSort(e.target.value)} 
                        className="form-select"
                        aria-label="Sort repositories by"
                    >
                        <option value="stars">Stars</option>
                        <option value="forks">Forks</option>
                        <option value="updated">Recently Updated</option>
                    </select>
                </div>
                <div className="col-sm-6">
                    <select 
                        value={order} 
                        onChange={e => setOrder(e.target.value)}
                        className="form-select"
                        aria-label="Sort order"
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                </div>
            </div>
        </div>
    )
}