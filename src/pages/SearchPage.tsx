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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-6 sm:py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3">
                        Discover Repositories
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore the most popular open-source projects on GitHub
                    </p>
                </div>
                </h1>
                
                <SearchBar onSearch={setQuery} />

                {/* Controls Group */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 sm:p-8 mb-8 sm:mb-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Filter & Sort Options
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <SortOptions sort={sort} setSort={setSort} order={order} setOrder={setOrder} />
                        
                        <Filters language={language} setLanguage={setLanguage} />

                        {/* Stars Range Filter */}
                        <div className="space-y-3">
                            <label htmlFor="stars-filter" className="block text-sm font-semibold text-gray-800">
                                Filter by Stars
                            </label>
                            <select 
                                id="stars-filter"
                                value={starsRange} 
                                onChange={(e) => setStarsRange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none text-sm transition-all duration-200 bg-white/80 hover:bg-white"
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
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 text-sm text-blue-800 rounded-xl border border-blue-100 shadow-sm">
                        <div className="flex flex-wrap gap-2 sm:gap-4">
                            <span>Total: <strong>{totalCount.toLocaleString()}</strong> results</span>
                            <span>Page: <strong>{page}</strong></span>
                            <span>Results on page: <strong>{repos.length}</strong></span>
                            <span>Has next: <strong>{hasNextPage.toString()}</strong></span>
                        </div>
                    </div>
                )}
                
                {loading ? (
                    <div className="flex justify-center items-center py-20 sm:py-24">
                        <div className="text-center">
                            <div className="relative mx-auto mb-6">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600 mx-auto"></div>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-20 animate-pulse"></div>
                            </div>
                            <p className="text-xl font-medium text-gray-700">Loading repositories...</p>
                            <p className="text-sm text-gray-500 mt-2">Discovering amazing projects</p>
                            {error && <p className="text-red-600 mt-2">{error}</p>}
                        </div>
                    </div>
                ) : repos.length > 0 ? (
                    <div className="space-y-6">
                        <div className="grid gap-6 sm:gap-8">
                            {repos.map((repo) => (
                                <div key={repo.id} className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 p-6 sm:p-8 border border-white/50 hover:border-blue-200 hover:bg-white/90 hover:-translate-y-1">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
                                        <div className="flex-1 mb-4 sm:mb-0">
                                            <a 
                                                href={repo.html_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="block group"
                                            >
                                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-300 group-hover:underline decoration-2 underline-offset-4">
                                                    {repo.name}
                                                </h2>
                                            </a>
                                            <p className="text-sm text-gray-500 mt-2 font-medium">{repo.full_name}</p>
                                        </div>
                                        
                                        <div className="flex items-center space-x-3 sm:space-x-4 flex-wrap gap-3">
                                            <div className="flex items-center bg-gradient-to-r from-yellow-50 to-amber-50 px-3 py-2 rounded-full border border-yellow-200 shadow-sm">
                                                <span className="text-yellow-500 text-sm mr-2">⭐</span>
                                                <span className="text-sm font-semibold text-gray-800">
                                                    {repo.stargazers_count.toLocaleString()}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-2 rounded-full border border-blue-200 shadow-sm">
                                                <span className="text-blue-500 text-sm mr-2">🍴</span>
                                                <span className="text-sm font-semibold text-gray-800">
                                                    {repo.forks_count.toLocaleString()}
                                                </span>
                                            </div>
                                            
                                            {repo.language && (
                                                <div className="flex items-center bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-2 rounded-full border border-green-200 shadow-sm">
                                                    <span className="text-green-500 text-sm mr-2">🖥️</span>
                                                    <span className="text-sm font-semibold text-gray-800">
                                                        {repo.language}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-700 text-base mb-6 leading-relaxed font-medium">
                                        {repo.description || "No description available"}
                                    </p>
                                    
                                    {repo.topics && repo.topics.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {repo.topics.slice(0, 5).map((topic, index) => (
                                                <span 
                                                    key={index}
                                                    className="inline-block bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-200 transition-colors"
                                                >
                                                    {topic}
                                                </span>
                                            ))}
                                            {repo.topics.length > 5 && (
                                                <span className="text-xs text-gray-500 font-medium px-2 py-1">
                                                    +{repo.topics.length - 5} more
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center justify-between flex-wrap gap-3">
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                            <span className="flex items-center">
                                                <span className="mr-2 text-base">🕓</span>
                                                Updated {new Date(repo.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        
                                        <a 
                                            href={repo.html_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 group shadow-lg hover:shadow-xl hover:scale-105"
                                            aria-label={`View ${repo.name} repository on GitHub`}
                                        >
                                            View Repository
                                            <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Pagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
                    </div>
                ) : (
                    <div className="text-center py-16 sm:py-20">
                        <div className="text-gray-500">
                            <div className="text-6xl sm:text-8xl mb-6 opacity-60">📁</div>
                            <p className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">No repositories found</p>
                            <p className="text-base sm:text-lg text-gray-500">Try searching for a different term or adjusting your filters</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}