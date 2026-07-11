import React from "react";

/**
 * One university card. Pure presentational — all data/state via props.
 *
 * @param {object} university - record from UNIVERSITY_LIST
 * @param {boolean} isSaved
 * @param {(id: string) => void} onToggleSave
 * @param {boolean} isCompareSelected
 * @param {(id: string) => void} onToggleCompare
 * @param {(id: string) => void} onOpenDetails
 */
function UniversityCard({
    university,
    isSaved,
    onToggleSave,
    isCompareSelected,
    onToggleCompare,
    onOpenDetails,
}) {
    return (
        <div className="ue-card" onClick={() => onOpenDetails(university.id)}>
            <div className="ue-card-top">
                <div className="ue-card-logo" aria-hidden="true">
                    {university.logo}
                </div>
                <div className="ue-card-info">
                    <h3 className="ue-card-name">{university.name}</h3>
                    <p className="ue-card-location">
                        {university.city}, {university.country}
                    </p>
                </div>
                <button
                    type="button"
                    className={`ue-save-btn ${isSaved ? "ue-save-btn--active" : ""}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(university.id);
                    }}
                    aria-label={isSaved ? "Remove from saved" : "Save university"}
                >
                    {isSaved ? "❤️" : "🤍"}
                </button>
            </div>

            <div className="ue-card-meta">
                <span className="ue-meta-pill">{university.ranking}</span>
                <span className="ue-meta-pill">£{university.tuitionPerYear.toLocaleString()}/yr</span>
                <span className="ue-meta-pill">
                    {university.duration[university.studyLevels[0]] || "—"}
                </span>
            </div>

            <p className="ue-card-entry">{university.entryRequirement}</p>

            <div className="ue-card-actions">
                <button
                    type="button"
                    className={`ue-compare-toggle ${isCompareSelected ? "ue-compare-toggle--active" : ""}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleCompare(university.id);
                    }}
                >
                    {isCompareSelected ? "✓ Added to Compare" : "⚖ Compare"}
                </button>
            </div>
        </div>
    );
}

export default UniversityCard;
