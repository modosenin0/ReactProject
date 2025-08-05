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
        <div className="container-fluid mb-4">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10 col-12">
                    <div className="position-relative">
                        <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
                            <svg className="text-muted" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Search GitHub repositories..."
                            aria-label="Search GitHub repositories"
                            className="form-control form-control-lg ps-5 pe-5"
                            style={{ paddingLeft: '3rem', paddingRight: input ? '3rem' : '1rem' }}
                        />
                        {input && (
                            <div className="position-absolute top-50 end-0 translate-middle-y pe-3">
                                <button
                                    onClick={() => setInput('')}
                                    className="btn btn-sm btn-outline-secondary border-0 p-1"
                                    aria-label="Clear search"
                                    type="button"
                                >
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}