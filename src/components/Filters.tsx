import React from "react";

interface FiltersProps {
    language: string;
    setLanguage: (language: string) => void;
}

export default function Filters({ language, setLanguage }: FiltersProps){

    return (
        <div className="col-lg-4 col-md-6 col-12 mb-3">
            <label htmlFor="language-select" className="form-label fw-medium">
                Programming Language
            </label>
            <select 
                id="language-select"
                value={language} 
                onChange={(e) => setLanguage(e.target.value)} 
                className="form-select"
                aria-label="Filter repositories by programming language"
            >
                <option value="">🌐 All Languages</option>
                <option value="javascript">🟨 JavaScript</option>
                <option value="typescript">🔷 TypeScript</option>
                <option value="python">🐍 Python</option>
                <option value="java">☕ Java</option>
                <option value="go">🐹 Go</option>
                <option value="rust">🦀 Rust</option>
                <option value="cpp">⚡ C++</option>
                <option value="csharp">🔵 C#</option>
                <option value="php">🐘 PHP</option>
                <option value="ruby">💎 Ruby</option>
                <option value="swift">🍎 Swift</option>
                <option value="kotlin">🎯 Kotlin</option>
            </select>
        </div>
    )
}