import React from "react";

interface StarsFilterProps {
    minStars: string;
    maxStars: string;
    setMinStars: (min: string) => void;
    setMaxStars: (max: string) => void;
}

export default function StarsFilter({ minStars, maxStars, setMinStars, setMaxStars }: StarsFilterProps) {
    return (
        <div className="col-lg-4 col-md-6 col-12 mb-3">
            <label className="form-label fw-medium">
                Filter by Stars
            </label>
            <div className="row g-2">
                <div className="col-6">
                    <input
                        type="number"
                        id="min-stars"
                        value={minStars}
                        onChange={(e) => setMinStars(e.target.value)}
                        className="form-control"
                        placeholder="Min stars"
                        min="0"
                        aria-label="Minimum star count"
                    />
                </div>
                <div className="col-6">
                    <input
                        type="number"
                        id="max-stars"
                        value={maxStars}
                        onChange={(e) => setMaxStars(e.target.value)}
                        className="form-control"
                        placeholder="Max stars"
                        min="0"
                        aria-label="Maximum star count"
                    />
                </div>
            </div>
            <div className="form-text">
                Enter minimum and/or maximum star counts to filter repositories
            </div>
        </div>
    );
}
