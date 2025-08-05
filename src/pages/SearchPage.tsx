import React from "react";
import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import SortOptions from "../components/SortOptions";

interface Repository {
    id: number;
    name: string;
    full_name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
}

export default function SearchPage(){
    const [repos, setRepos] = useState<Repository[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [query, setQuery] = useState('react');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [sort, setSort] = useState('stars');
    const [order, setOrder] = useState('desc');

    useEffect(() => {
        if (!query) return;
        
        setLoading(true);
        fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+language:javascript&sort=${sort}&order=${order}&per_page=10&page=${page}`)
        .then((res) => res.json())
        .then((data) => {
            console.log('API Response:', data); // Debug log
            
            // Set total count from API response
            setTotalCount(data.total_count || 0);
            
            // GitHub API limits results to 1000 items max (100 pages with 10 per page)
            const maxResults = Math.min(data.total_count || 0, 1000);
            const maxPages = Math.ceil(maxResults / 10);
            const calculatedHasNextPage = page < maxPages && (data.items?.length || 0) === 10;
            
            setHasNextPage(calculatedHasNextPage);
            
            if (page > 1) {
                setRepos((prevRepos) => [...prevRepos, ...(data.items || [])]);
            } else {
                setRepos(data.items || []);
            }
            setLoading(false);
        }).catch((error) => {
            console.log(error.message);
            setLoading(false);
        })
    }, [query, page, sort, order]);

    // Reset page when query changes
    useEffect(() => {
        setPage(1);
    }, [query]);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    Popular Repositories
                </h1>
                
                <SearchBar onSearch={setQuery} />

                <SortOptions sort={sort} setSort={setSort} order={order} setOrder={setOrder} />

                {/* Debug pagination info */}
                {totalCount > 0 && (
                    <div className="mb-4 p-2 bg-blue-50 text-xs text-blue-700 rounded">
                        Total: {totalCount.toLocaleString()} results | Page: {page} | Results on page: {repos.length} | Has next: {hasNextPage.toString()}
                    </div>
                )}
                
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-lg text-gray-600">Loading repositories...</p>
                        </div>
                    </div>
                ) : repos.length > 0 ? (
                    <div className="grid gap-4">
                        {repos.map((repo) => (
                            <div key={repo.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-5 border border-gray-100 hover:border-gray-200">
                                <div className="flex items-start justify-between mb-3">
                                    <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                                        {repo.name}
                                    </h2>
                                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                                        <span className="text-yellow-500 text-xs mr-1">⭐</span>
                                        <span className="text-xs font-medium text-gray-700">
                                            {repo.stargazers_count.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    {repo.description || "No description available"}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                                        {repo.full_name}
                                    </span>
                                    <a 
                                        href={repo.html_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium rounded-lg transition-colors duration-200 group"
                                    >
                                        View Repository
                                        <span className="ml-1.5 group-hover:translate-x-0.5 transition-transform">→</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                        <Pagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-500">
                            <div className="text-4xl mb-4">📁</div>
                            <p className="text-lg font-medium">No repositories found</p>
                            <p className="text-sm mt-1">Try searching for a different term</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}