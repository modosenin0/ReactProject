import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface SavedSearch {
    id: string;
    name: string;
    query: string;
    language: string;
    minStars: string;
    maxStars: string;
    sort: string;
    order: string;
    savedAt: string;
}

export interface FavoriteRepo {
    id: number;
    name: string;
    full_name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    updated_at: string;
    topics: string[];
    savedAt: string;
}

interface SavedSearchesContextType {
    savedSearches: SavedSearch[];
    favoriteRepos: FavoriteRepo[];
    saveSearch: (search: Omit<SavedSearch, 'id' | 'savedAt'>) => void;
    deleteSavedSearch: (id: string) => void;
    addToFavorites: (repo: Omit<FavoriteRepo, 'savedAt'>) => void;
    removeFromFavorites: (id: number) => void;
    isFavorite: (id: number) => boolean;
    applySavedSearch: (search: SavedSearch) => void;
}

const SavedSearchesContext = createContext<SavedSearchesContextType | undefined>(undefined);

export function SavedSearchesProvider({ children }: { children: ReactNode }) {
    const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
    const [favoriteRepos, setFavoriteRepos] = useState<FavoriteRepo[]>([]);
    
    // Load saved data from localStorage on mount
    useEffect(() => {
        const savedSearchesData = localStorage.getItem('savedSearches');
        const favoriteReposData = localStorage.getItem('favoriteRepos');
        
        if (savedSearchesData) {
            try {
                setSavedSearches(JSON.parse(savedSearchesData));
            } catch (error) {
                console.error('Error loading saved searches:', error);
            }
        }
        
        if (favoriteReposData) {
            try {
                setFavoriteRepos(JSON.parse(favoriteReposData));
            } catch (error) {
                console.error('Error loading favorite repos:', error);
            }
        }
    }, []);
    
    // Save to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
    }, [savedSearches]);
    
    useEffect(() => {
        localStorage.setItem('favoriteRepos', JSON.stringify(favoriteRepos));
    }, [favoriteRepos]);
    
    const saveSearch = (search: Omit<SavedSearch, 'id' | 'savedAt'>) => {
        const newSearch: SavedSearch = {
            ...search,
            id: Date.now().toString(),
            savedAt: new Date().toISOString(),
        };
        setSavedSearches(prev => [newSearch, ...prev]);
    };
    
    const deleteSavedSearch = (id: string) => {
        setSavedSearches(prev => prev.filter(search => search.id !== id));
    };
    
    const addToFavorites = (repo: Omit<FavoriteRepo, 'savedAt'>) => {
        const favoriteRepo: FavoriteRepo = {
            ...repo,
            savedAt: new Date().toISOString(),
        };
        setFavoriteRepos(prev => {
            // Check if already exists
            if (prev.some(fav => fav.id === repo.id)) {
                return prev;
            }
            return [favoriteRepo, ...prev];
        });
    };
    
    const removeFromFavorites = (id: number) => {
        setFavoriteRepos(prev => prev.filter(repo => repo.id !== id));
    };
    
    const isFavorite = (id: number): boolean => {
        return favoriteRepos.some(repo => repo.id === id);
    };
    
    const applySavedSearch = (search: SavedSearch) => {
        // This will be implemented in the SearchPage component
        // For now, we'll dispatch a custom event
        window.dispatchEvent(new CustomEvent('applySavedSearch', { detail: search }));
    };
    
    return (
        <SavedSearchesContext.Provider value={{
            savedSearches,
            favoriteRepos,
            saveSearch,
            deleteSavedSearch,
            addToFavorites,
            removeFromFavorites,
            isFavorite,
            applySavedSearch,
        }}>
            {children}
        </SavedSearchesContext.Provider>
    );
}

export function useSavedSearches() {
    const context = useContext(SavedSearchesContext);
    if (!context) {
        throw new Error('useSavedSearches must be used within a SavedSearchesProvider');
    }
    return context;
}
