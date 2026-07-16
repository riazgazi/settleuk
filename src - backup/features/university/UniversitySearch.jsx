import React from "react";

/**
 * @param {string} value
 * @param {(value: string) => void} onChange
 */
function UniversitySearch({ value, onChange }) {
    return (
        <div className="ue-search">
            <span className="ue-search-icon" aria-hidden="true">
                🔍
            </span>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search university, city, or course..."
                aria-label="Search universities"
            />
        </div>
    );
}

export default UniversitySearch;
