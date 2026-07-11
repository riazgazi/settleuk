import React from "react";

/**
 * Opens as an overlay on top of whichever tab was active, per spec
 * ("Details is NOT another tab — it opens from the selected card").
 *
 * @param {object} university
 * @param {boolean} isSaved
 * @param {(id: string) => void} onToggleSave
 * @param {boolean} isCompareSelected
 * @param {(id: string) => void} onToggleCompare
 * @param {() => void} onBack
 */
function UniversityDetails({
    university,
    isSaved,
    onToggleSave,
    isCompareSelected,
    onToggleCompare,
    onBack,
}) {
    return (
        <div className="ue-tab-panel">
            <div className="ue-details-hero">
                <div className="ue-details-hero-emoji" aria-hidden="true">
                    {university.logo}
                </div>
                <p className="ue-details-hero-name">{university.name}</p>
                <p className="ue-details-hero-meta">
                    {university.ranking} · {university.city}, {university.country}
                </p>
            </div>

            <div className="ue-details-section">
                <p className="ue-details-section-title">About</p>
                <p className="ue-details-section-text">{university.about}</p>
            </div>

            <div className="ue-details-section">
                <p className="ue-details-section-title">Available Courses</p>
                <ul className="ue-details-list">
                    {university.courses.map((c) => (
                        <li key={c}>{c}</li>
                    ))}
                </ul>
            </div>

            <div className="ue-details-section">
                <p className="ue-details-section-title">Tuition & Living Cost</p>
                <p className="ue-details-section-text">
                    Tuition: £{university.tuitionPerYear.toLocaleString()}/year
                    <br />
                    Living cost: £{university.livingCostPerYear.toLocaleString()}/year
                </p>
            </div>

            <div className="ue-details-section">
                <p className="ue-details-section-title">Scholarships</p>
                <ul className="ue-details-list">
                    {university.scholarships.map((s) => (
                        <li key={s}>{s}</li>
                    ))}
                </ul>
            </div>

            <div className="ue-details-section">
                <p className="ue-details-section-title">Entry Requirements</p>
                <p className="ue-details-section-text">{university.entryRequirement}</p>
            </div>

            <div className="ue-details-section">
                <p className="ue-details-section-title">Official Website</p>
                <a
                    href={university.website}
                    target="_blank"
                    rel="noreferrer"
                    className="ue-details-link"
                >
                    {university.website} ↗
                </a>
            </div>

            <div className="ue-details-section">
                <p className="ue-details-section-title">Notes</p>
                <p className="ue-details-section-text" style={{ fontStyle: "italic", color: "#9498a8" }}>
                    Personal notes for this university are coming in a future update.
                </p>
            </div>

            <button
                type="button"
                className={`ue-compare-toggle ${isCompareSelected ? "ue-compare-toggle--active" : ""}`}
                style={{ width: "100%", marginBottom: 10 }}
                onClick={() => onToggleCompare(university.id)}
            >
                {isCompareSelected ? "✓ Added to Compare" : "⚖ Add to Compare"}
            </button>

            <button type="button" className="ue-details-save-btn" onClick={() => onToggleSave(university.id)}>
                {isSaved ? "❤️ Saved — tap to remove" : "🤍 Save University"}
            </button>
        </div>
    );
}

export default UniversityDetails;
