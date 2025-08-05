import React, { useState, useEffect } from 'react';
import { useSavedSearches } from '../contexts/SavedSearchesContext';
import DarkModeToggle from '../components/DarkModeToggle';

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

export default function TrendingPage() {
    const [repos, setRepos] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeframe, setTimeframe] = useState('daily');
    const [language, setLanguage] = useState('');
    const { addToFavorites, removeFromFavorites, isFavorite } = useSavedSearches();
    
    const timeframes = [
        { value: 'daily', label: 'Today', query: 'created:>=' + new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        { value: 'weekly', label: 'This Week', query: 'created:>=' + new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        { value: 'monthly', label: 'This Month', query: 'created:>=' + new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        { value: 'yearly', label: 'This Year', query: 'created:>=' + new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    ];
    
    const popularLanguages = [
        '', 'JavaScript', 'Python', 'Java', 'TypeScript', 'C#', 'PHP', 'C++', 'C', 'Shell', 'Go', 'Rust'
    ];
    
    useEffect(() => {
        const fetchTrending = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const selectedTimeframe = timeframes.find(t => t.value === timeframe);
                let query = selectedTimeframe?.query || '';
                
                if (language) {
                    query += `+language:${language}`;
                }
                
                const response = await fetch(
                    `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=20`
                );
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                setRepos(data.items || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };
        
        fetchTrending();
    }, [timeframe, language]);
    
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
                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-center mb-4 header-title">
                            <h1 className="display-5 fw-bold text-center flex-grow-1 mb-0">
                                🔥 Trending Repositories
                            </h1>
                            <DarkModeToggle />
                        </div>
                        
                        {/* Filters */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h2 className="h5 fw-semibold mb-3">Trending Filters</h2>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="timeframe-select" className="form-label fw-medium">
                                            Timeframe
                                        </label>
                                        <select
                                            id="timeframe-select"
                                            value={timeframe}
                                            onChange={(e) => setTimeframe(e.target.value)}
                                            className="form-select"
                                        >
                                            {timeframes.map((tf) => (
                                                <option key={tf.value} value={tf.value}>
                                                    {tf.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="language-select" className="form-label fw-medium">
                                            Language
                                        </label>
                                        <select
                                            id="language-select"
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="">All Languages</option>
                                            {popularLanguages.slice(1).map((lang) => (
                                                <option key={lang} value={lang}>
                                                    {lang}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center py-5 loading-container">
                                <div className="text-center">
                                    <div className="spinner-border text-primary mb-3 loading-spinner" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="h6 text-muted">Loading trending repositories...</p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="alert alert-danger" role="alert">
                                <h6 className="alert-heading">Error loading trending repositories</h6>
                                <p className="mb-0">{error}</p>
                            </div>
                        ) : repos.length > 0 ? (
                            <div className="results-container">
                                <div className="alert alert-info mb-4" role="status">
                                    <span>
                                        Found <strong>{repos.length}</strong> trending repositories
                                        {language && ` for ${language}`}
                                        {timeframes.find(t => t.value === timeframe)?.label.toLowerCase() && 
                                            ` ${timeframes.find(t => t.value === timeframe)?.label.toLowerCase()}`}
                                    </span>
                                </div>
                                
                                <div className="row g-4">
                                    {repos.map((repo, index) => (
                                        <div key={repo.id} className="col-12">
                                            <div className="card h-100 shadow-sm repo-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                                <div className="card-body">
                                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
                                                        <div className="flex-grow-1 mb-2 mb-md-0 me-md-3">
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
                                                            <div className="d-flex flex-wrap gap-2 me-2">
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
                                                            {repo.topics.slice(0, 5).map((topic, topicIndex) => (
                                                                <span 
                                                                    key={topicIndex}
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
                            </div>
                        ) : (
                            <div className="text-center py-5 no-results">
                                <div className="text-muted">
                                    <div className="display-1 mb-3">🔥</div>
                                    <h4 className="fw-medium">No trending repositories found</h4>
                                    <p className="mb-0">Try adjusting your filters</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
