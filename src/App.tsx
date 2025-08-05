import React from "react";
import SearchPage from "./pages/SearchPage";
import FavoritesPage from "./pages/FavoritesPage";
import TrendingPage from "./pages/TrendingPage";
import SavedSearchesPage from "./pages/SavedSearchesPage";
import Navigation from "./components/Navigation";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SavedSearchesProvider } from "./contexts/SavedSearchesContext";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App(){
    return (
        <ThemeProvider>
            <SavedSearchesProvider>
                <BrowserRouter>
                    <Navigation />
                    <Routes>
                        <Route path="/" element={<SearchPage />} />
                        <Route path="/favorites" element={<FavoritesPage />} />
                        <Route path="/trending" element={<TrendingPage />} />
                        <Route path="/saved-searches" element={<SavedSearchesPage />} />
                    </Routes>
                </BrowserRouter>
            </SavedSearchesProvider>
        </ThemeProvider>
    );
}