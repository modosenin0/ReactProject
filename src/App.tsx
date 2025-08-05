import React from "react";
import SearchPage from "./pages/SearchPage";
import { ThemeProvider } from "./contexts/ThemeContext";

export default function App(){
    return (
        <ThemeProvider>
            <SearchPage/>
        </ThemeProvider>
    );
}