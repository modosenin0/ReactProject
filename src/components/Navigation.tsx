import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
    const location = useLocation();
    
    const navItems = [
        { path: '/', label: 'Search', icon: '🔍' },
        { path: '/favorites', label: 'Favorites', icon: '⭐' },
        { path: '/trending', label: 'Trending', icon: '🔥' },
        { path: '/saved-searches', label: 'Saved Searches', icon: '💾' },
    ];
    
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4 shadow-sm">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold" to="/">
                    <span className="me-2">📁</span>
                    GitHub Explorer
                </Link>
                
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {navItems.map((item) => (
                            <li key={item.path} className="nav-item">
                                <Link 
                                    className={`nav-link ${location.pathname === item.path ? 'active fw-semibold' : ''}`}
                                    to={item.path}
                                >
                                    <span className="me-1">{item.icon}</span>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
