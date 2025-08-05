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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
                {/* Enhanced Header */}
                <div className="text-center mb-12 sm:mb-20">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl mb-8 transform hover:scale-105 transition-transform duration-300">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6">
                        <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                            GitHub
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Explorer
                        </span>
                    </h1>
                    <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed">
                        Discover the most innovative open-source projects and trending repositories
                    </p>
                    <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-gray-500">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            Live GitHub Data
                        </div>
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            Real-time Search
                        </div>
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                            Advanced Filtering
                        </div>
                    </div>
                </div>
                
                <SearchBar onSearch={setQuery} />

                {/* Enhanced Controls */}
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 sm:p-10 mb-12 sm:mb-16 hover:bg-white/70 transition-all duration-500">
                    <div className="flex items-center mb-8">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Refine Your Search
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <SortOptions sort={sort} setSort={setSort} order={order} setOrder={setOrder} />
                        
                        <Filters language={language} setLanguage={setLanguage} />

                        {/* Enhanced Stars Range Filter */}
                        <div className="space-y-4">
                            <label htmlFor="stars-filter" className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                                Star Range
                            </label>
                            <select 
                                id="stars-filter"
                                value={starsRange} 
                                onChange={(e) => setStarsRange(e.target.value)}
                                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 outline-none text-sm transition-all duration-300 bg-white/90 hover:bg-white font-medium shadow-lg hover:shadow-xl"
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

                {/* Enhanced Results Info */}
                {totalCount > 0 && (
                    <div className="mb-8 p-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm text-blue-800 rounded-2xl border border-blue-200/50 shadow-lg">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-6 text-sm font-semibold">
                                <span className="flex items-center">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                    <strong>{totalCount.toLocaleString()}</strong> repositories found
                                </span>
                                <span className="flex items-center">
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                    Page <strong>{page}</strong>
                                </span>
                                <span className="flex items-center">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                    <strong>{repos.length}</strong> results shown
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                
                {loading ? (
                    <div className="flex justify-center items-center py-32">
                        <div className="text-center">
                            <div className="relative mx-auto mb-8">
                                <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-100 border-t-blue-600 mx-auto"></div>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-20 animate-pulse"></div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Discovering Repositories</h3>
                            <p className="text-lg text-gray-600">Finding the best projects for you...</p>
                            {error && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <p className="text-red-600 font-medium">{error}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : repos.length > 0 ? (
                    <div className="space-y-8">
                        <div className="grid gap-8">
                            {repos.map((repo, index) => (
                                <div 
                                    key={repo.id} 
                                    className="group bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 sm:p-10 border border-white/40 hover:border-blue-200/50 hover:bg-white/80 hover:-translate-y-2 transform"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
                                        <div className="flex-1 mb-6 lg:mb-0 lg:pr-8">
                                            <a 
                                                href={repo.html_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="block group/link"
                                            >
                                                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 hover:text-blue-600 transition-colors duration-300 group-hover/link:underline decoration-2 underline-offset-4 mb-3">
                                                    {repo.name}
                                                </h2>
                                            </a>
                                            <p className="text-base text-gray-500 font-semibold mb-4">{repo.full_name}</p>
                                            <p className="text-gray-700 text-lg leading-relaxed font-medium">
                                                {repo.description || "No description available"}
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center space-x-4 flex-wrap gap-4">
                                            <div className="flex items-center bg-gradient-to-r from-yellow-100 to-amber-100 px-4 py-3 rounded-2xl border-2 border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                                <span className="text-yellow-600 text-lg mr-3">⭐</span>
                                                <span className="text-base font-bold text-gray-800">
                                                    {repo.stargazers_count.toLocaleString()}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center bg-gradient-to-r from-blue-100 to-cyan-100 px-4 py-3 rounded-2xl border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                                <span className="text-blue-600 text-lg mr-3">🍴</span>
                                                <span className="text-base font-bold text-gray-800">
                                                    {repo.forks_count.toLocaleString()}
                                                </span>
                                            </div>
                                            
                                            {repo.language && (
                                                <div className="flex items-center bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-3 rounded-2xl border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                                    <span className="text-green-600 text-lg mr-3">💻</span>
                                                    <span className="text-base font-bold text-gray-800">
                                                        {repo.language}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {repo.topics && repo.topics.length > 0 && (
                                        <div className="flex flex-wrap gap-3 mb-8">
                                            {repo.topics.slice(0, 6).map((topic, index) => (
                                                <span 
                                                    key={index}
                                                    className="inline-block bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 text-sm font-semibold px-4 py-2 rounded-full border-2 border-gray-200 hover:bg-gradient-to-r hover:from-gray-200 hover:to-slate-200 transition-all duration-300 hover:scale-105 shadow-md"
                                                >
                                                    #{topic}
                                                </span>
                                            ))}
                                            {repo.topics.length > 6 && (
                                                <span className="text-sm text-gray-500 font-semibold px-3 py-2 bg-gray-50 rounded-full border border-gray-200">
                                                    +{repo.topics.length - 6} more
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center justify-between flex-wrap gap-6">
                                        <div className="flex items-center space-x-6 text-base text-gray-600">
                                            <span className="flex items-center font-medium">
                                                <span className="mr-3 text-xl">🕒</span>
                                                Updated {new Date(repo.updated_at).toLocaleDateString('en-US', { 
                                                    year: 'numeric', 
                                                    month: 'short', 
                                                    day: 'numeric' 
                                                })}
                                            </span>
                                        </div>
                                        
                                        <a 
                                            href={repo.html_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-blue-600 hover:to-indigo-600 text-white text-base font-bold rounded-2xl transition-all duration-300 group shadow-xl hover:shadow-2xl hover:scale-105 transform"
                                            aria-label={`View ${repo.name} repository on GitHub`}
                                        >
                                            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                            </svg>
                                            View Repository
                                            <span className="ml-3 group-hover:translate-x-1 transition-transform duration-300 text-xl">→</span>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Pagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <div className="text-gray-500">
                            <div className="text-8xl mb-8 opacity-60">🔍</div>
                            <h3 className="text-3xl font-bold text-gray-700 mb-4">No repositories found</h3>
                            <p className="text-xl text-gray-500 max-w-md mx-auto">Try searching for a different term or adjusting your filters to discover amazing projects</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}