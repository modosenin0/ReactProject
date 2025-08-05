import React from "react";
import SearchPage from "./pages/SearchPage";
import { ThemeProvider } from "./contexts/ThemeContext";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App(){
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<SearchPage />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}