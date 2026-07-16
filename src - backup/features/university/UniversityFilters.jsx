import React from "react";
import { COUNTRIES, STUDY_LEVELS, IELTS_OPTIONS, INTAKES } from "../../data/universities";

/**
 * @param {object} filters - { country, level, ielts, intake, tuitionSort }
 * @param {(patch: object) => void} onChange - merges patch into filters
 */
function UniversityFilters({ filters, onChange }) {
    function toggle(key, value) {
        onChange({ [key]: filters[key] === value ? null : value });
    }

    return (
        <div className="ue-filters">
            <div className="ue-filter-group">
                <span className="ue-filter-label">Country</span>
                <div className="ue-filter-chips">
                    {COUNTRIES.map((c) => (
                        <button
                            key={c}
                            type="button"
                            className={`ue-chip ${filters.country === c ? "ue-chip--active" : ""}`}
                            onClick={() => toggle("country", c)}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            <div className="ue-filter-group">
                <span className="ue-filter-label">Study Level</span>
                <div className="ue-filter-chips">
                    {STUDY_LEVELS.map((l) => (
                        <button
                            key={l.id}
                            type="button"
                            className={`ue-chip ${filters.level === l.id ? "ue-chip--active" : ""}`}
                            onClick={() => toggle("level", l.id)}
                        >
                            {l.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="ue-filter-group">
                <span className="ue-filter-label">IELTS</span>
                <div className="ue-filter-chips">
                    {IELTS_OPTIONS.map((opt) => (
                        <button
                            key={opt.id}
                            type="button"
                            className={`ue-chip ${filters.ielts === opt.id ? "ue-chip--active" : ""}`}
                            onClick={() => toggle("ielts", opt.id)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="ue-filter-group">
                <span className="ue-filter-label">Intake</span>
                <div className="ue-filter-chips">
                    {INTAKES.map((i) => (
                        <button
                            key={i}
                            type="button"
                            className={`ue-chip ${filters.intake === i ? "ue-chip--active" : ""}`}
                            onClick={() => toggle("intake", i)}
                        >
                            {i}
                        </button>
                    ))}
                </div>
            </div>

            <div className="ue-filter-group">
                <span className="ue-filter-label">Tuition</span>
                <div className="ue-filter-chips">
                    <button
                        type="button"
                        className={`ue-chip ${filters.tuitionSort === "lowest" ? "ue-chip--active" : ""}`}
                        onClick={() => toggle("tuitionSort", "lowest")}
                    >
                        Lowest
                    </button>
                    <button
                        type="button"
                        className={`ue-chip ${filters.tuitionSort === "highest" ? "ue-chip--active" : ""}`}
                        onClick={() => toggle("tuitionSort", "highest")}
                    >
                        Highest
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UniversityFilters;
