import React from "react";
import "./FeaturePageHeader.css";

/**
 * Standard header for every feature page opened from Quick Tools
 * (Budget Calculator, Documents, CAS & UKVI, University Explorer, and
 * any future tool). One JSX definition, reused everywhere — per Layout
 * Standardization: "Do not duplicate header JSX."
 *
 * Back always returns to the Quick Tools screen (setTab("tools")),
 * never to Home directly and never via browser history — the caller
 * passes that in as onBack so this component stays free of navigation
 * assumptions.
 *
 * @param {string} title
 * @param {string} subtitle
 * @param {() => void} onBack
 */
function FeaturePageHeader({ title, subtitle, onBack }) {
    return (
        <header className="fph-header">
            <button type="button" className="fph-back-btn" onClick={onBack} aria-label="Back to Quick Tools">
                ←
            </button>
            <div className="fph-titles">
                <h1 className="fph-title">{title}</h1>
                {subtitle && <p className="fph-subtitle">{subtitle}</p>}
            </div>
        </header>
    );
}

export default FeaturePageHeader;
