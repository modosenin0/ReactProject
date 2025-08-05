import React from "react";
import { useEffect, useState } from "react";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps){
    const [input, setInput] = useState<string>("");

    useEffect(() => {
        // Don't search if input is empty
        if (!input.trim()) {
            return;
        }

        // Debounce the search call
        const timeoutId = setTimeout(() => {
            onSearch(input.trim());
        }, 500); // 500ms delay

        // Cleanup function to clear timeout if input changes before delay
        return () => clearTimeout(timeoutId);
    }, [input, onSearch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    return (
        <div className="w-full max-w-5xl mx-auto mb-12 sm:mb-16">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none z-10">
                    <svg className="w-7 h-7 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Search for repositories, topics, languages, or developers..."
                    aria-label="Search GitHub repositories"
                    className="w-full px-8 py-6 pl-16 pr-16 text-gray-900 bg-white/80 backdrop-blur-xl border-2 border-gray-200 rounded-3xl focus:ring-6 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all duration-500 text-lg sm:text-xl shadow-2xl hover:shadow-3xl placeholder-gray-400 font-medium hover:bg-white/90 focus:bg-white group-hover:border-blue-300"
                />
                {input && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-6 z-10">
                        <button
                            onClick={() => setInput('')}
                            className="text-gray-400 hover:text-gray-600 transition-all duration-300 p-2 rounded-full hover:bg-gray-100 hover:scale-110 transform"
                            aria-label="Clear search"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                
                {/* Enhanced search suggestions */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
            
            {/* Search tips */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
                <span className="flex items-center bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-200">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Try: "react hooks"
                </span>
                <span className="flex items-center bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-200">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Try: "machine learning"
                </span>
                <span className="flex items-center bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-200">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Try: "web framework"
                </span>
            </div>
        </div>
    )
}