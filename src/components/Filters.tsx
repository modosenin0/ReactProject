import React from "react";

interface FiltersProps {
    language: string;
    setLanguage: (language: string) => void;
}

export default function Filters({ language, setLanguage }: FiltersProps){

    return (
        <div className="space-y-4">
            <label htmlFor="language-select" className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                Language
            </label>
            <select 
                id="language-select"
                value={language} 
                onChange={(e) => setLanguage(e.target.value)} 
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 outline-none text-sm transition-all duration-300 bg-white/90 hover:bg-white font-medium shadow-lg hover:shadow-xl"
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