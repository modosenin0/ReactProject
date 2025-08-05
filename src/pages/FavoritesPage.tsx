import React from 'react';
import { useSavedSearches } from '../contexts/SavedSearchesContext';
import DarkModeToggle from '../components/DarkModeToggle';

export default function FavoritesPage() {
    const { favoriteRepos, removeFromFavorites } = useSavedSearches();
    
    return (
        <div className="min-vh-100 py-4">
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-xl-10 col-lg-11 col-12">
                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-center mb-4 header-title">
                            <h1 className="display-5 fw-bold text-center flex-grow-1 mb-0">
                                ⭐ Favorite Repositories
                            </h1>
                            <DarkModeToggle />
                        </div>
                        
                        {favoriteRepos.length === 0 ? (
                            <div className="text-center py-5 no-results">
                                <div className="text-muted">
                                    <div className="display-1 mb-3">⭐</div>
                                    <h4 className="fw-medium">No favorite repositories yet</h4>
                                    <p className="mb-0">
                                        Start adding repositories to your favorites from the search page!
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Stats */}
                                <div className="alert alert-info mb-4" role="status">
                                    <div className="d-flex align-items-center">
                                        <span>
                                            <strong>{favoriteRepos.length}</strong> favorite{favoriteRepos.length !== 1 ? 's' : ''} saved
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Favorites List */}
                                <div className="results-container">
                                    <div className="row g-4">
                                        {favoriteRepos.map((repo, index) => (
                                            <div key={repo.id} className="col-12">
                                                <div className="card h-100 shadow-sm repo-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                                    <div className="card-body">
                                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                                            <div className="flex-grow-1 me-3">
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
                                                                <p className="text-muted small mb-0">
                                                                    💾 Saved {new Date(repo.savedAt).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div className="d-flex flex-wrap gap-1 me-2">
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
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    onClick={() => removeFromFavorites(repo.id)}
                                                                    title="Remove from favorites"
                                                                >
                                                                    🗑️
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
