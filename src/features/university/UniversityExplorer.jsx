import React, { useState, useMemo } from "react";
import UniversityFinder from "./UniversityFinder";
import UniversitySearch from "./UniversitySearch";
import UniversityFilters from "./UniversityFilters";
import UniversityCard from "./UniversityCard";
import UniversityCompare from "./UniversityCompare";
import UniversityDetails from "./UniversityDetails";
import { UNIVERSITY_LIST, IELTS_OPTIONS } from "../../data/universities";
import { loadLS, saveLS } from "../../hooks/useLocalStorage";
import FeaturePageHeader from "../../components/layout/FeaturePageHeader";
import "./UniversityExplorer.css";

/* ============================================================
   UniversityExplorer.jsx
   Standard feature screen (Header -> Tabbed Content -> Bottom Nav,
   same architecture as every other feature page) — NOT a modal
   anymore. 4 tabs: Profile, Universities, Compare, Saved. Details
   is NOT a tab; it opens from a card tap, reusing the same
   FeaturePageHeader with its Back button repurposed to return to
   the tab list instead of leaving the screen.

   Reuses:
   - UniversityFinder AS-IS for the Profile tab (savedAcademic /
     onSaveProfile passed straight through, form not touched). It
     keeps its own full-screen dark modal styling when active —
     that's an existing, unmodified interaction, not part of this
     screen's own layout.
   - loadLS/saveLS (same helpers useJourney.js uses) for the Saved
     list — new key, no new storage system.
   - UNIVERSITY_LIST / filter constants from data/universities.js.
   - FeaturePageHeader — same header component every feature page uses.

   Props:
   @param {object|null} savedAcademic
   @param {(profile: object) => void} onSaveProfile
   @param {(tabKey: string) => void} setTab - Back returns to "tools",
          the app's standard navigation (no browser history, no onClose).
   ============================================================ */

const SAVED_UNIS_KEY = "settleuk_saved_universities";
const MAX_SAVED = 10;
const MAX_COMPARE = 3;

const TABS = [
    { key: "profile", label: "👤 Profile" },
    { key: "universities", label: "🏛 Universities" },
    { key: "compare", label: "⚖ Compare" },
    { key: "saved", label: "❤️ Saved" },
];

function UniversityExplorer({ savedAcademic, onSaveProfile, setTab }) {
    const [activeTab, setActiveTab] = useState(savedAcademic ? "universities" : "profile");
    const [editingProfile, setEditingProfile] = useState(!savedAcademic);
    const [detailsId, setDetailsId] = useState(null);

    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        country: null,
        level: null,
        ielts: null,
        intake: null,
        tuitionSort: null,
    });

    const [savedIds, setSavedIds] = useState(() => loadLS(SAVED_UNIS_KEY, []));
    const [compareIds, setCompareIds] = useState([]);

    function persistSaved(next) {
        setSavedIds(next);
        saveLS(SAVED_UNIS_KEY, next);
    }

    function toggleSave(id) {
        if (savedIds.includes(id)) {
            persistSaved(savedIds.filter((s) => s !== id));
            return;
        }
        if (savedIds.length >= MAX_SAVED) {
            window.alert(`You can save up to ${MAX_SAVED} universities. Remove one first.`);
            return;
        }
        persistSaved([...savedIds, id]);
    }

    function toggleCompare(id) {
        setCompareIds((prev) => {
            if (prev.includes(id)) return prev.filter((c) => c !== id);
            if (prev.length >= MAX_COMPARE) {
                window.alert(`You can compare up to ${MAX_COMPARE} universities at a time.`);
                return prev;
            }
            return [...prev, id];
        });
    }

    function handleFiltersChange(patch) {
        setFilters((prev) => ({ ...prev, ...patch }));
    }

    function handleProfileSaved(profileData) {
        onSaveProfile(profileData);
        setEditingProfile(false);
        setActiveTab("universities");
    }

    function handleProfileFormClosed() {
        // Covers both "Skip for Now" and closing without changes — either way,
        // stop showing the form and fall back to whatever profile already
        // existed (or none, if this was a first-time skip).
        setEditingProfile(false);
    }

    const filteredUniversities = useMemo(() => {
        let list = UNIVERSITY_LIST.filter((u) => {
            if (search.trim()) {
                const q = search.trim().toLowerCase();
                const matches =
                    u.name.toLowerCase().includes(q) ||
                    u.city.toLowerCase().includes(q) ||
                    u.courses.some((c) => c.toLowerCase().includes(q));
                if (!matches) return false;
            }
            if (filters.country && u.country !== filters.country) return false;
            if (filters.level && !u.studyLevels.includes(filters.level)) return false;
            if (filters.intake && !u.intakes.includes(filters.intake)) return false;
            if (filters.ielts) {
                const opt = IELTS_OPTIONS.find((o) => o.id === filters.ielts);
                if (opt && u.ieltsMin < opt.min) return false;
            }
            return true;
        });

        if (filters.tuitionSort === "lowest") {
            list = [...list].sort((a, b) => a.tuitionPerYear - b.tuitionPerYear);
        } else if (filters.tuitionSort === "highest") {
            list = [...list].sort((a, b) => b.tuitionPerYear - a.tuitionPerYear);
        }

        return list;
    }, [search, filters]);

    const savedUniversities = UNIVERSITY_LIST.filter((u) => savedIds.includes(u.id));
    const compareUniversities = UNIVERSITY_LIST.filter((u) => compareIds.includes(u.id));
    const detailsUniversity = detailsId ? UNIVERSITY_LIST.find((u) => u.id === detailsId) : null;

    function handleHeaderBack() {
        if (detailsUniversity) {
            setDetailsId(null);
            return;
        }
        // Standard navigation architecture: feature pages return to Quick Tools.
        setTab("tools");
    }

    // Profile tab, showing the reused UniversityFinder form (first-time or
    // editing). Left exactly as its own full-screen modal — untouched.
    if (editingProfile) {
        return (
            <UniversityFinder
                savedAcademic={savedAcademic}
                onSaveProfile={handleProfileSaved}
                onClose={handleProfileFormClosed}
            />
        );
    }

    return (
        <div className="ue-page">
            <FeaturePageHeader
                title={detailsUniversity ? detailsUniversity.name : "University Explorer"}
                subtitle={detailsUniversity ? undefined : "Search, compare and shortlist UK universities."}
                onBack={handleHeaderBack}
            />

            <div className="ue-content">
                {detailsUniversity ? (
                    <UniversityDetails
                        university={detailsUniversity}
                        isSaved={savedIds.includes(detailsUniversity.id)}
                        onToggleSave={toggleSave}
                        isCompareSelected={compareIds.includes(detailsUniversity.id)}
                        onToggleCompare={toggleCompare}
                    />
                ) : (
                    <>
                        <div className="ue-tabs">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    className={`ue-tab-btn ${activeTab === tab.key ? "ue-tab-btn--active" : ""}`}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="ue-tab-panel" key={activeTab}>
                            {activeTab === "profile" && (
                                <div className="ue-profile-summary">
                                    {savedAcademic ? (
                                        <>
                                            <div className="ue-profile-row">
                                                <span className="ue-profile-label">Level</span>
                                                <span className="ue-profile-value">
                                                    {savedAcademic.level === "masters" ? "Master's" : "Bachelor's"}
                                                </span>
                                            </div>
                                            {savedAcademic.level === "masters" ? (
                                                <div className="ue-profile-row">
                                                    <span className="ue-profile-label">CGPA</span>
                                                    <span className="ue-profile-value">{savedAcademic.cgpa}</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="ue-profile-row">
                                                        <span className="ue-profile-label">SSC GPA</span>
                                                        <span className="ue-profile-value">{savedAcademic.ssc}</span>
                                                    </div>
                                                    <div className="ue-profile-row">
                                                        <span className="ue-profile-label">HSC GPA</span>
                                                        <span className="ue-profile-value">{savedAcademic.hsc}</span>
                                                    </div>
                                                </>
                                            )}
                                            <div className="ue-profile-row">
                                                <span className="ue-profile-label">IELTS</span>
                                                <span className="ue-profile-value">{savedAcademic.ielts || "—"}</span>
                                            </div>
                                            <div className="ue-profile-row">
                                                <span className="ue-profile-label">Preferred Course</span>
                                                <span className="ue-profile-value">{savedAcademic.course || "—"}</span>
                                            </div>
                                            <div className="ue-profile-row">
                                                <span className="ue-profile-label">Budget/year</span>
                                                <span className="ue-profile-value">
                                                    {savedAcademic.budget ? `£${savedAcademic.budget}` : "—"}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="ue-profile-empty">No academic profile yet.</p>
                                    )}
                                    <button
                                        type="button"
                                        className="ue-edit-profile-full-btn"
                                        onClick={() => setEditingProfile(true)}
                                    >
                                        {savedAcademic ? "Edit Profile" : "Complete Profile"}
                                    </button>
                                </div>
                            )}

                            {activeTab === "universities" && (
                                <>
                                    <UniversitySearch value={search} onChange={setSearch} />
                                    <UniversityFilters filters={filters} onChange={handleFiltersChange} />
                                    <p className="ue-results-count">
                                        {filteredUniversities.length} universit
                                        {filteredUniversities.length === 1 ? "y" : "ies"} found
                                    </p>
                                    {filteredUniversities.length === 0 ? (
                                        <div className="ue-empty-state">No universities match your filters.</div>
                                    ) : (
                                        filteredUniversities.map((u) => (
                                            <UniversityCard
                                                key={u.id}
                                                university={u}
                                                isSaved={savedIds.includes(u.id)}
                                                onToggleSave={toggleSave}
                                                isCompareSelected={compareIds.includes(u.id)}
                                                onToggleCompare={toggleCompare}
                                                onOpenDetails={setDetailsId}
                                            />
                                        ))
                                    )}
                                </>
                            )}

                            {activeTab === "compare" && (
                                <UniversityCompare universities={compareUniversities} onRemove={toggleCompare} />
                            )}

                            {activeTab === "saved" && (
                                <>
                                    {savedUniversities.length === 0 ? (
                                        <div className="ue-empty-state">
                                            No saved universities yet. Tap 🤍 on a card to save it.
                                        </div>
                                    ) : (
                                        savedUniversities.map((u) => (
                                            <UniversityCard
                                                key={u.id}
                                                university={u}
                                                isSaved={true}
                                                onToggleSave={toggleSave}
                                                isCompareSelected={compareIds.includes(u.id)}
                                                onToggleCompare={toggleCompare}
                                                onOpenDetails={setDetailsId}
                                            />
                                        ))
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default UniversityExplorer;
