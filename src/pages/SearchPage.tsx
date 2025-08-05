import React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import SortOptions from "../components/SortOptions";
import Filters from "../components/Filters";
import StarsFilter from "../components/StarsFilter";
import DarkModeToggle from "../components/DarkModeToggle";
import { useSearchParams } from "react-router-dom";
import { useSavedSearches } from "../contexts/SavedSearchesContext";

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
    const [minStars, setMinStars] = useState('');
    const [maxStars, setMaxStars] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [searchName, setSearchName] = useState('');
    
    // Saved searches context
    const { saveSearch, addToFavorites, removeFromFavorites, isFavorite } = useSavedSearches();
    
    // Refs for debouncing and request cancellation
    const abortControllerRef = useRef<AbortController | null>(null);
    const debounceTimeoutRef = useRef<number | null>(null);

    // Cleanup function to cancel ongoing requests and timeouts
    const cancelOngoingRequests = useCallback(() => {
        // Cancel the current fetch request if it exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        
        // Clear the debounce timeout if it exists
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
            debounceTimeoutRef.current = null;
        }
    }, []);

    // Debounced fetch function
    const debouncedFetch = useCallback((
        queryString: string,
        sort: string,
        order: string,
        page: number,
        delay: number = 300
    ) => {
        // Cancel any ongoing requests and timeouts
        cancelOngoingRequests();
        
        // Set up new debounce timeout
        debounceTimeoutRef.current = window.setTimeout(() => {
            // Create new AbortController for this request
            const controller = new AbortController();
            abortControllerRef.current = controller;
            
            setLoading(true);
            setError(null);
            
            fetch(`https://api.github.com/search/repositories?q=${queryString}&sort=${sort}&order=${order}&per_page=10&page=${page}`, {
                signal: controller.signal
            })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                // Only update state if this request wasn't aborted
                if (!controller.signal.aborted) {
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
                }
            })
            .catch((error) => {
                // Only handle error if this request wasn't aborted
                if (!controller.signal.aborted) {
                    console.log(error.message);
                    setError(error.message);
                    setLoading(false);
                }
            })
            .finally(() => {
                // Clean up the abort controller reference
                if (abortControllerRef.current === controller) {
                    abortControllerRef.current = null;
                }
            });
        }, delay);
    }, [cancelOngoingRequests]);

    useEffect(() => {
        const urlQuery = searchParams.get('q');
        const urlLang = searchParams.get('lang');
        const urlSort = searchParams.get('sort');
        const urlOrder = searchParams.get('order');
        const urlMinStars = searchParams.get('minStars');
        const urlMaxStars = searchParams.get('maxStars');
        const urlPage = searchParams.get('page');

        // If URL has params, use them (URL takes priority)
        if (urlQuery || urlLang || urlSort || urlOrder || urlMinStars || urlMaxStars || urlPage) {
            setQuery(urlQuery || 'react');
            setLanguage(urlLang || '');
            setSort(urlSort || 'stars');
            setOrder(urlOrder || 'desc');
            setMinStars(urlMinStars || '');
            setMaxStars(urlMaxStars || '');
            setPage(parseInt(urlPage || '1') || 1);
        } else {
            // Otherwise, try to load from localStorage
            const savedState = localStorage.getItem('searchState');
            if (savedState) {
                try {
                    const { query, language, sort, order, minStars, maxStars } = JSON.parse(savedState);
                    const restoredQuery = query || 'react';
                    const restoredLang = language || '';
                    const restoredSort = sort || 'stars';
                    const restoredOrder = order || 'desc';
                    const restoredMinStars = minStars || '';
                    const restoredMaxStars = maxStars || '';
                    
                    setQuery(restoredQuery);
                    setLanguage(restoredLang);
                    setSort(restoredSort);
                    setOrder(restoredOrder);
                    setMinStars(restoredMinStars);
                    setMaxStars(restoredMaxStars);
                    setPage(1);

                    // Update URL with restored state
                    const params: Record<string, string> = {
                        q: restoredQuery,
                        sort: restoredSort,
                        order: restoredOrder,
                        page: '1',
                    };
                    if (restoredLang) params.lang = restoredLang;
                    if (restoredMinStars) params.minStars = restoredMinStars;
                    if (restoredMaxStars) params.maxStars = restoredMaxStars;
                    
                    setSearchParams(params);
                } catch (error) {
                    console.error('Error parsing saved search state:', error);
                    localStorage.removeItem('searchState');
                    // Set defaults and update URL
                    setQuery('react');
                    setSearchParams({ q: 'react', sort: 'stars', order: 'desc', page: '1' });
                }
            } else {
                // No saved state, set defaults and update URL
                setQuery('react');
                setSearchParams({ q: 'react', sort: 'stars', order: 'desc', page: '1' });
            }
        }
    }, [searchParams, setSearchParams]);

    // Sync state changes to URL (but avoid empty values to keep URL clean)
    useEffect(() => {
        const params: Record<string, string> = {
            q: query,
            sort,
            order,
            page: page.toString(),
        };

        // Only add optional params if they have values
        if (language) params.lang = language;
        if (minStars) params.minStars = minStars;
        if (maxStars) params.maxStars = maxStars;

        setSearchParams(params, { replace: true });

        // Also save to localStorage for persistence across sessions
        const stateToPersist = {
            query,
            language,
            sort,
            order,
            minStars,
            maxStars,
        };
        localStorage.setItem('searchState', JSON.stringify(stateToPersist));
    }, [query, language, sort, order, minStars, maxStars, page, setSearchParams]);


    // Helper function to build stars query string
    const buildStarsQuery = (min: string, max: string): string => {
        const minNum = min ? parseInt(min) : null;
        const maxNum = max ? parseInt(max) : null;
        
        if (minNum && maxNum) {
            return `stars:${minNum}..${maxNum}`;
        } else if (minNum) {
            return `stars:>${minNum}`;
        } else if (maxNum) {
            return `stars:<${maxNum}`;
        }
        return '';
    };

    useEffect(() => {
        if (!query) return;

        let queryString = `${query}`;
        if (language) {
            queryString += `+language:${language}`;
        }
        
        const starsQuery = buildStarsQuery(minStars, maxStars);
        if (starsQuery) {
            queryString += `+${starsQuery}`;
        }
        
        // Use debounced fetch for search queries (but not for pagination)
        // For pagination, we want immediate results
        if (page === 1) {
            // This is a new search, use debouncing
            debouncedFetch(queryString, sort, order, page, 300);
        } else {
            // This is pagination, fetch immediately without debouncing
            cancelOngoingRequests();
            
            const controller = new AbortController();
            abortControllerRef.current = controller;
            
            setLoading(true);
            setError(null);
            
            fetch(`https://api.github.com/search/repositories?q=${queryString}&sort=${sort}&order=${order}&per_page=10&page=${page}`, {
                signal: controller.signal
            })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                if (!controller.signal.aborted) {
                    setTotalCount(data.total_count || 0);
                    
                    const maxResults = Math.min(data.total_count || 0, 1000);
                    const maxPages = Math.ceil(maxResults / 10);
                    const calculatedHasNextPage = page < maxPages && (data.items?.length || 0) === 10;
                    
                    setHasNextPage(calculatedHasNextPage);
                    setRepos((prevRepos) => [...prevRepos, ...(data.items || [])]);
                    setLoading(false);
                }
            })
            .catch((error) => {
                if (!controller.signal.aborted) {
                    console.log(error.message);
                    setError(error.message);
                    setLoading(false);
                }
            })
            .finally(() => {
                if (abortControllerRef.current === controller) {
                    abortControllerRef.current = null;
                }
            });
        }
    }, [query, page, sort, order, language, minStars, maxStars, debouncedFetch, cancelOngoingRequests]);

    useEffect(() => {
        setPage(1);
    }, [query, sort, order, language, minStars, maxStars]);

    // Cleanup effect to cancel ongoing requests when component unmounts
    useEffect(() => {
        return () => {
            cancelOngoingRequests();
        };
    }, [cancelOngoingRequests]);

    // Listen for apply saved search events
    useEffect(() => {
        const handleApplySavedSearch = (event: any) => {
            const search = event.detail;
            setQuery(search.query);
            setLanguage(search.language);
            setSort(search.sort);
            setOrder(search.order);
            setMinStars(search.minStars);
            setMaxStars(search.maxStars);
            setPage(1);
        };

        window.addEventListener('applySavedSearch', handleApplySavedSearch);
        return () => {
            window.removeEventListener('applySavedSearch', handleApplySavedSearch);
        };
    }, []);

    // Save search functionality
    const handleSaveSearch = () => {
        if (!searchName.trim()) {
            alert('Please enter a name for this search');
            return;
        }

        saveSearch({
            name: searchName,
            query,
            language,
            minStars,
            maxStars,
            sort,
            order,
        });

        setSearchName('');
        setShowSaveModal(false);
        alert('Search saved successfully!');
    };

    // Toggle favorite for a repository
    const handleToggleFavorite = (repo: Repository) => {
        if (isFavorite(repo.id)) {
            removeFromFavorites(repo.id);
        } else {
            addToFavorites(repo);
        }
    };

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
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h2 className="h5 fw-semibold mb-0">Filter & Sort Options</h2>
                                    <button 
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => setShowSaveModal(true)}
                                        title="Save current search configuration"
                                    >
                                        💾 Save Search
                                    </button>
                                </div>
                                
                                <div className="row">
                                    <SortOptions sort={sort} setSort={setSort} order={order} setOrder={setOrder} />
                                    
                                    <Filters language={language} setLanguage={setLanguage} />

                                    <StarsFilter 
                                        minStars={minStars}
                                        maxStars={maxStars}
                                        setMinStars={setMinStars}
                                        setMaxStars={setMaxStars}
                                    />
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
                                                        
                                                        <div className="d-flex align-items-center gap-2">
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
                                                            
                                                            <button
                                                                type="button"
                                                                className={`btn btn-sm ${isFavorite(repo.id) ? 'btn-warning' : 'btn-outline-warning'}`}
                                                                onClick={() => handleToggleFavorite(repo)}
                                                                title={isFavorite(repo.id) ? 'Remove from favorites' : 'Add to favorites'}
                                                            >
                                                                ⭐
                                                            </button>
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
                                    <Pagination 
                                        page={page} 
                                        setPage={setPage} 
                                        hasNextPage={hasNextPage} 
                                        totalCount={totalCount}
                                    />
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
            
            {/* Save Search Modal */}
            <div className={`modal fade ${showSaveModal ? 'show' : ''}`} 
                 style={{ display: showSaveModal ? 'block' : 'none' }}
                 tabIndex={-1} 
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">💾 Save Search</h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={() => setShowSaveModal(false)}
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="search-name" className="form-label">Search Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="search-name"
                                    value={searchName}
                                    onChange={(e) => setSearchName(e.target.value)}
                                    placeholder="Enter a name for this search..."
                                />
                            </div>
                            
                            <div className="alert alert-info">
                                <h6 className="alert-heading">Current Search Configuration:</h6>
                                <ul className="mb-0 small">
                                    <li><strong>Query:</strong> "{query}"</li>
                                    {language && <li><strong>Language:</strong> {language}</li>}
                                    {minStars && <li><strong>Min Stars:</strong> {minStars}</li>}
                                    {maxStars && <li><strong>Max Stars:</strong> {maxStars}</li>}
                                    <li><strong>Sort:</strong> {sort} ({order})</li>
                                </ul>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={() => setShowSaveModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-primary"
                                onClick={handleSaveSearch}
                                disabled={!searchName.trim()}
                            >
                                Save Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Modal backdrop */}
            {showSaveModal && (
                <div 
                    className="modal-backdrop fade show"
                    onClick={() => setShowSaveModal(false)}
                ></div>
            )}
        </div>
    )
}