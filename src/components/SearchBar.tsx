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
        <div className="w-full max-w-4xl mx-auto mb-8 sm:mb-12">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Search for repositories, topics, or languages..."
                    aria-label="Search GitHub repositories"
                    className="w-full px-6 py-4 pl-14 pr-12 text-gray-900 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all duration-300 text-base sm:text-lg shadow-lg hover:shadow-xl placeholder-gray-400"
                />
                {input && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-5">
                        <button
                            onClick={() => setInput('')}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                            aria-label="Clear search"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}