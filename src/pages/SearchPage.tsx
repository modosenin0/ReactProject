import React from "react";
import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import SortOptions from "../components/SortOptions";
import Filters from "../components/Filters";
import DarkModeToggle from "../components/DarkModeToggle";

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
        <div className="min-vh-100 py-4">
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-xl-10 col-lg-11 col-12">
                        {/* Header with Dark Mode Toggle */}
                        <div className="d-flex justify-content-between align-items-center mb-4 header-title">
                            <h1 className="display-5 fw-bold text-center flex-grow-1 mb-0">
                                Popular Repositories
                            </h1>
                            <DarkModeToggle />
                        </div>
                        
                        <div className="search-container">
                            <SearchBar onSearch={setQuery} />
                        </div>

                        {/* Controls Group */}
                        <div className="card shadow-sm mb-4 controls-container">
                            <div className="card-body">
                                <h2 className="h5 fw-semibold mb-3">Filter & Sort Options</h2>
                                
                                <div className="row">
                                    <SortOptions sort={sort} setSort={setSort} order={order} setOrder={setOrder} />
                                    
                                    <Filters language={language} setLanguage={setLanguage} />

                                    {/* Stars Range Filter */}
                                    <div className="col-lg-4 col-md-6 col-12 mb-3">
                                        <label htmlFor="stars-filter" className="form-label fw-medium">
                                            Filter by Stars
                                        </label>
                                        <select 
                                            id="stars-filter"
                                            value={starsRange} 
                                            onChange={(e) => setStarsRange(e.target.value)}
                                            className="form-select"
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
                        </div>

                        {/* Debug pagination info */}
                        {totalCount > 0 && (
                            <div className="alert alert-info mb-4" role="status">
                                <div className="d-flex flex-wrap gap-3 small">
                                    <span>Total: <strong>{totalCount.toLocaleString()}</strong> results</span>
                                    <span>Page: <strong>{page}</strong></span>
                                    <span>Results on page: <strong>{repos.length}</strong></span>
                                    <span>Has next: <strong>{hasNextPage.toString()}</strong></span>
                                </div>
                            </div>
                        )}
                        
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center py-5 loading-container">
                                <div className="text-center">
                                    <div className="spinner-border text-primary mb-3 loading-spinner" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="h6 text-muted">Loading repositories...</p>
                                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                                </div>
                            </div>
                        ) : repos.length > 0 ? (
                            <div className="results-container">
                                <div className="row g-4">
                                    {repos.map((repo, index) => (
                                        <div key={repo.id} className="col-12">
                                            <div className="card h-100 shadow-sm repo-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                                <div className="card-body">
                                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
                                                        <div className="flex-grow-1 mb-2 mb-md-0">
                                                            <a 
                                                                href={repo.html_url} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-decoration-none"
                                                            >
                                                                <h3 className="h5 fw-semibold text-primary mb-1">
                                                                    {repo.name}
                                                                </h3>
                                                            </a>
                                                            <p className="text-muted small mb-0">{repo.full_name}</p>
                                                        </div>
                                                        
                                                        <div className="d-flex flex-wrap gap-2">
                                                            <span className="badge bg-warning text-dark">
                                                                ⭐ {repo.stargazers_count.toLocaleString()}
                                                            </span>
                                                            
                                                            <span className="badge bg-info text-dark">
                                                                🍴 {repo.forks_count.toLocaleString()}
                                                            </span>
                                                            
                                                            {repo.language && (
                                                                <span className="badge bg-success">
                                                                    🖥️ {repo.language}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <p className="text-muted mb-3">
                                                        {repo.description || "No description available"}
                                                    </p>
                                                    
                                                    {repo.topics && repo.topics.length > 0 && (
                                                        <div className="mb-3">
                                                            {repo.topics.slice(0, 5).map((topic, index) => (
                                                                <span 
                                                                    key={index}
                                                                    className="badge bg-secondary me-1 mb-1"
                                                                >
                                                                    {topic}
                                                                </span>
                                                            ))}
                                                            {repo.topics.length > 5 && (
                                                                <span className="text-muted small">
                                                                    +{repo.topics.length - 5} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                    
                                                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                                        <small className="text-muted">
                                                            🕓 Updated {new Date(repo.updated_at).toLocaleDateString()}
                                                        </small>
                                                        
                                                        <a 
                                                            href={repo.html_url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="btn btn-dark btn-sm"
                                                            aria-label={`View ${repo.name} repository on GitHub`}
                                                        >
                                                            View Repository →
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="pagination-container">
                                    <Pagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-5 no-results">
                                <div className="text-muted">
                                    <div className="display-1 mb-3">📁</div>
                                    <h4 className="fw-medium">No repositories found</h4>
                                    <p className="mb-0">Try searching for a different term</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}