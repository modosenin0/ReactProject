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
        <div className="w-full max-w-2xl mx-auto mb-8">
            <div className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Search GitHub repositories..."
                    className="w-full px-4 py-3 pl-10 pr-4 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />

            </div>
        </div>
    )
}