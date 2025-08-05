import React from "react";

interface FiltersProps {
    language: string;
    setLanguage: (language: string) => void;
}

export default function Filters({ language, setLanguage }: FiltersProps){

    return (
        <div className="space-y-2">
            <label htmlFor="language-select" className="block text-sm font-medium text-gray-700">
                Programming Language
            </label>
            <select 
                id="language-select"
                value={language} 
                onChange={(e) => setLanguage(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all duration-200"
                aria-label="Filter repositories by programming language"
            >
                <option value="">All Languages</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="cpp">C++</option>
                <option value="csharp">C#</option>
                <option value="php">PHP</option>
                <option value="ruby">Ruby</option>
                <option value="swift">Swift</option>
                <option value="kotlin">Kotlin</option>
            </select>
        </div>
    )
}