import React, { useEffect } from "react";

interface FiltersProps {
    language: string;
    setLanguage: (language: string) => void;
}

export default function Filters({ language, setLanguage }: FiltersProps){
    const [languages, setLanguages] = React.useState<{ name: string; color: string }[]>([]);

    useEffect(() => {
        fetch('https://api.github.com/repos/microsoft/vscode/languages')
            .then((res) => res.json())
            .then((data) => {
                const languageList = Object.keys(data).map((key) => ({
                    name: key,
                    color: data[key],
                }));
                setLanguages(languageList);
            })
            .catch((error) => {
                console.error('Error fetching languages:', error);
            });
    }, []);



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
                {languages.map((lang) => (
                    <option key={lang.name} value={lang.name}>
                        <span style={{ color: lang.color }}>{lang.name}</span>
                    </option>
                ))}
            </select>
        </div>
    )
}
    