import React, { useState } from 'react';
import { useSavedSearches } from '../contexts/SavedSearchesContext';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

export default function SavedSearchesPage() {
    const { savedSearches, deleteSavedSearch, applySavedSearch } = useSavedSearches();
    const navigate = useNavigate();
    const [searchFilter, setSearchFilter] = useState('');
    
    const filteredSearches = savedSearches.filter(search =>
        search.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        search.query.toLowerCase().includes(searchFilter.toLowerCase())
    );
    
    const handleApplySearch = (search: any) => {
        applySavedSearch(search);
        navigate('/');
    };
    
    const formatSearchCriteria = (search: any) => {
        const criteria = [];
        if (search.language) criteria.push(`Language: ${search.language}`);
        if (search.minStars) criteria.push(`Min Stars: ${search.minStars}`);
        if (search.maxStars) criteria.push(`Max Stars: ${search.maxStars}`);
        criteria.push(`Sort: ${search.sort} (${search.order})`);
        return criteria.join(' • ');
    };
    
    return (
        <div className="min-vh-100 py-4">
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-xl-10 col-lg-11 col-12">
                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-center mb-4 header-title">
                            <h1 className="display-5 fw-bold text-center flex-grow-1 mb-0">
                                💾 Saved Searches
                            </h1>
                            <DarkModeToggle />
                        </div>
                        
                        {savedSearches.length === 0 ? (
                            <div className="text-center py-5 no-results">
                                <div className="text-muted">
                                    <div className="display-1 mb-3">💾</div>
                                    <h4 className="fw-medium">No saved searches yet</h4>
                                    <p className="mb-0">
                                        Save your favorite search configurations from the search page!
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Search Filter */}
                                <div className="card shadow-sm mb-4">
                                    <div className="card-body">
                                        <div className="row align-items-center">
                                            <div className="col-md-6">
                                                <h5 className="card-title mb-0">
                                                    {filteredSearches.length} saved search{filteredSearches.length !== 1 ? 'es' : ''}
                                                </h5>
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Filter saved searches..."
                                                    value={searchFilter}
                                                    onChange={(e) => setSearchFilter(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Saved Searches List */}
                                <div className="results-container">
                                    <div className="row g-4">
                                        {filteredSearches.map((search, index) => (
                                            <div key={search.id} className="col-lg-6 col-12">
                                                <div className="card h-100 shadow-sm saved-search-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                                    <div className="card-body">
                                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                                            <div className="flex-grow-1 me-3">
                                                                <h5 className="card-title text-primary mb-1">
                                                                    {search.name}
                                                                </h5>
                                                                <p className="text-muted mb-1">
                                                                    <strong>Query:</strong> "{search.query}"
                                                                </p>
                                                                <p className="text-muted small mb-0">
                                                                    💾 Saved {new Date(search.savedAt).toLocaleDateString()} at {new Date(search.savedAt).toLocaleTimeString()}
                                                                </p>
                                                            </div>
                                                            
                                                            <div className="dropdown">
                                                                <button 
                                                                    className="btn btn-outline-secondary btn-sm dropdown-toggle"
                                                                    type="button"
                                                                    data-bs-toggle="dropdown"
                                                                    aria-expanded="false"
                                                                >
                                                                    Actions
                                                                </button>
                                                                <ul className="dropdown-menu">
                                                                    <li>
                                                                        <button 
                                                                            className="dropdown-item"
                                                                            onClick={() => handleApplySearch(search)}
                                                                        >
                                                                            🔍 Apply Search
                                                                        </button>
                                                                    </li>
                                                                    <li><hr className="dropdown-divider" /></li>
                                                                    <li>
                                                                        <button 
                                                                            className="dropdown-item text-danger"
                                                                            onClick={() => deleteSavedSearch(search.id)}
                                                                        >
                                                                            🗑️ Delete
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="mb-3">
                                                            <h6 className="small text-muted mb-2">Search Criteria:</h6>
                                                            <p className="small text-secondary">
                                                                {formatSearchCriteria(search)}
                                                            </p>
                                                        </div>
                                                        
                                                        <div className="d-flex gap-2">
                                                            <button 
                                                                className="btn btn-primary btn-sm flex-fill"
                                                                onClick={() => handleApplySearch(search)}
                                                            >
                                                                🔍 Apply Search
                                                            </button>
                                                            <button 
                                                                className="btn btn-outline-danger btn-sm"
                                                                onClick={() => deleteSavedSearch(search.id)}
                                                                title="Delete saved search"
                                                            >
                                                                🗑️
                                                            </button>
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
