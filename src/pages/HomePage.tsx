import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="text-center mb-5">
                        <h1 className="display-4 fw-bold mb-3">
                            📁 GitHub Explorer
                        </h1>
                        <p className="lead text-muted">
                            Discover, save, and explore GitHub repositories with advanced filtering and favorites
                        </p>
                    </div>
                    
                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="card h-100 shadow-sm feature-card">
                                <div className="card-body text-center">
                                    <div className="display-1 mb-3">🔍</div>
                                    <h5 className="card-title">Search Repositories</h5>
                                    <p className="card-text">
                                        Search GitHub repositories with advanced filters, sorting, and debounced API calls
                                    </p>
                                    <Link to="/" className="btn btn-primary">
                                        Start Searching
                                    </Link>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-6">
                            <div className="card h-100 shadow-sm feature-card">
                                <div className="card-body text-center">
                                    <div className="display-1 mb-3">⭐</div>
                                    <h5 className="card-title">Your Favorites</h5>
                                    <p className="card-text">
                                        Keep track of your favorite repositories and access them quickly
                                    </p>
                                    <Link to="/favorites" className="btn btn-warning">
                                        View Favorites
                                    </Link>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-6">
                            <div className="card h-100 shadow-sm feature-card">
                                <div className="card-body text-center">
                                    <div className="display-1 mb-3">🔥</div>
                                    <h5 className="card-title">Trending Repos</h5>
                                    <p className="card-text">
                                        Discover trending repositories by timeframe and programming language
                                    </p>
                                    <Link to="/trending" className="btn btn-danger">
                                        See Trending
                                    </Link>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-6">
                            <div className="card h-100 shadow-sm feature-card">
                                <div className="card-body text-center">
                                    <div className="display-1 mb-3">💾</div>
                                    <h5 className="card-title">Saved Searches</h5>
                                    <p className="card-text">
                                        Save your search configurations and apply them with one click
                                    </p>
                                    <Link to="/saved-searches" className="btn btn-success">
                                        Manage Searches
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="alert alert-info mt-5">
                        <h6 className="alert-heading">🚀 Features Highlights:</h6>
                        <ul className="mb-0">
                            <li><strong>Advanced Search:</strong> Filter by language, stars, and more</li>
                            <li><strong>Smart Pagination:</strong> Navigate through results with numbered pages</li>
                            <li><strong>Debounced API:</strong> Efficient search with request cancellation</li>
                            <li><strong>Favorites Management:</strong> Save and organize your favorite repos</li>
                            <li><strong>Saved Searches:</strong> Quickly apply your frequently used search filters</li>
                            <li><strong>Trending Discovery:</strong> Find hot repositories by timeframe</li>
                            <li><strong>Responsive Design:</strong> Works perfectly on all devices</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
