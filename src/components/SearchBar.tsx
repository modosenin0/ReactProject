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
        <div className="w-full max-w-3xl mx-auto mb-6 sm:mb-8">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Search GitHub repositories..."
                    aria-label="Search GitHub repositories"
                    className="w-full px-4 py-3 pl-10 pr-4 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm sm:text-base"
                />
                {input && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                            onClick={() => setInput('')}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Clear search"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}