import React from "react";
import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import SortOptions from "../components/SortOptions";
import Filters from "../components/Filters";

interface Repository {
    id: number;
    name: string;
    full_name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    updated_at: string;
    default_branch: string;
    topics: string[];
}

export default function SearchPage(){
    const [repos, setRepos] = useState<Repository[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState('react');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [sort, setSort] = useState('stars');
    const [order, setOrder] = useState('desc');
    const [language, setLanguage] = useState('');
    const [starsRange, setStarsRange] = useState('');

    useEffect(() => {
        if (!query) return;

        let queryString = `${query}`;
        if (language) {
            queryString += `+language:${language}`;
        }
        if (starsRange) {
            queryString += `+stars:${starsRange}`;
        }
        
        setLoading(true);
        setError(null); 
        fetch(`https://api.github.com/search/repositories?q=${queryString}&sort=${sort}&order=${order}&per_page=10&page=${page}`)
        .then((res) => res.json())
        .then((data) => {            
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
            setError(error.message);
            setLoading(false);
        })
    }, [query, page, sort, order, language, starsRange]);

    useEffect(() => {
        setPage(1);
    }, [query, sort, order, language, starsRange]);

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
                    Popular Repositories
                </h1>
                
                <SearchBar onSearch={setQuery} />

                {/* Controls Group */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter & Sort Options</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SortOptions sort={sort} setSort={setSort} order={order} setOrder={setOrder} />
                        
                        <Filters language={language} setLanguage={setLanguage} />

                        {/* Stars Range Filter */}
                        <div className="space-y-2">
                            <label htmlFor="stars-filter" className="block text-sm font-medium text-gray-700">
                                Filter by Stars
                            </label>
                            <select 
                                id="stars-filter"
                                value={starsRange} 
                                onChange={(e) => setStarsRange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all duration-200"
                                aria-label="Filter repositories by star count"
                            >
                                <option value="">All repositories</option>
                                <option value="0..500">0 - 500 stars</option>
                                <option value="500..1000">500 - 1,000 stars</option>
                                <option value="1000..5000">1,000 - 5,000 stars</option>
                                <option value="5000..10000">5,000 - 10,000 stars</option>
                                <option value=">10000">10,000+ stars</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Debug pagination info */}
                {totalCount > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 text-xs sm:text-sm text-blue-700 rounded-lg border border-blue-200">
                        <div className="flex flex-wrap gap-2 sm:gap-4">
                            <span>Total: <strong>{totalCount.toLocaleString()}</strong> results</span>
                            <span>Page: <strong>{page}</strong></span>
                            <span>Results on page: <strong>{repos.length}</strong></span>
                            <span>Has next: <strong>{hasNextPage.toString()}</strong></span>
                        </div>
                    </div>
                )}
                
                {loading ? (
                    <div className="flex justify-center items-center py-16 sm:py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-lg text-gray-600">Loading repositories...</p>
                            {error && <p className="text-red-600 mt-2">{error}</p>}
                        </div>
                    </div>
                ) : repos.length > 0 ? (
                    <div className="space-y-4">
                        <div className="grid gap-4 sm:gap-6">
                            {repos.map((repo) => (
                                <div key={repo.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-6 border border-gray-100 hover:border-gray-200">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                                        <div className="flex-1 mb-3 sm:mb-0">
                                            <a 
                                                href={repo.html_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="block group"
                                            >
                                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 group-hover:underline">
                                                    {repo.name}
                                                </h2>
                                            </a>
                                            <p className="text-sm text-gray-500 mt-1">{repo.full_name}</p>
                                        </div>
                                        
                                        <div className="flex items-center space-x-3 sm:space-x-4 flex-wrap gap-2">
                                            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
                                                <span className="text-yellow-500 text-xs mr-1">⭐</span>
                                                <span className="text-xs font-medium text-gray-700">
                                                    {repo.stargazers_count.toLocaleString()}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center bg-blue-50 px-2 py-1 rounded-full border border-blue-200">
                                                <span className="text-blue-500 text-xs mr-1">🍴</span>
                                                <span className="text-xs font-medium text-gray-700">
                                                    {repo.forks_count.toLocaleString()}
                                                </span>
                                            </div>
                                            
                                            {repo.language && (
                                                <div className="flex items-center bg-green-50 px-2 py-1 rounded-full border border-green-200">
                                                    <span className="text-green-500 text-xs mr-1">🖥️</span>
                                                    <span className="text-xs font-medium text-gray-700">
                                                        {repo.language}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                        {repo.description || "No description available"}
                                    </p>
                                    
                                    {repo.topics && repo.topics.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {repo.topics.slice(0, 5).map((topic, index) => (
                                                <span 
                                                    key={index}
                                                    className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md"
                                                >
                                                    {topic}
                                                </span>
                                            ))}
                                            {repo.topics.length > 5 && (
                                                <span className="text-xs text-gray-500">
                                                    +{repo.topics.length - 5} more
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center justify-between flex-wrap gap-3">
                                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                                            <span className="flex items-center">
                                                <span className="mr-1">🕓</span>
                                                Updated {new Date(repo.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        
                                        <a 
                                            href={repo.html_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium rounded-lg transition-colors duration-200 group"
                                            aria-label={`View ${repo.name} repository on GitHub`}
                                        >
                                            View Repository
                                            <span className="ml-1.5 group-hover:translate-x-0.5 transition-transform">→</span>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Pagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
                    </div>
                ) : (
                    <div className="text-center py-12 sm:py-16">
                        <div className="text-gray-500">
                            <div className="text-4xl sm:text-6xl mb-4">📁</div>
                            <p className="text-lg sm:text-xl font-medium">No repositories found</p>
                            <p className="text-sm sm:text-base mt-1">Try searching for a different term</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}