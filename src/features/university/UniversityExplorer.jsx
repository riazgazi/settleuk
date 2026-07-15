import React, { useState, useMemo } from "react";
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
   Standard feature screen (Header -> Tabbed Content -> Bottom Nav).
   4 tabs: Universities (default), Compare, Saved, Links. Details is
   NOT a tab; it opens from a card tap, reusing the same
   FeaturePageHeader with its Back button repurposed to return to
   the tab list instead of leaving the screen.

   THIS PASS: the "Official Resources" callout is no longer tied to
   the empty state only. It's now a persistent, compact info banner
   that always sits below the filters and above the results —
   present whether the filtered list has matches or not. When there
   ARE zero matches, a short friendly line is added underneath the
   results-count area; the banner itself doesn't change or duplicate
   its button in that case.

   Reuses, unmodified:
   - loadLS/saveLS for the Saved list (same key as before).
   - UNIVERSITY_LIST / IELTS_OPTIONS from data/universities.js.
   - FeaturePageHeader — same header component every feature page uses.
   - UniversitySearch, UniversityFilters, UniversityCard,
     UniversityCompare, UniversityDetails — all untouched.
   - toggleSave / toggleCompare / details view / filteredUniversities
     logic (incl. the additive Course/Subject filter) — all untouched.

   Props:
   @param {object|null} savedAcademic - accepted for backwards
          compatibility with the parent; not used on this screen.
   @param {(profile: object) => void} onSaveProfile - accepted for the
          same reason; not called from here.
   @param {(tabKey: string) => void} setTab - Back returns to "tools".
   ============================================================ */

const SAVED_UNIS_KEY = "settleuk_saved_universities";
const MAX_SAVED = 10;
const MAX_COMPARE = 3;

const TABS = [
    { key: "universities", label: "🏛 Universities" },
    { key: "compare", label: "⚖ Compare" },
    { key: "saved", label: "❤️ Saved" },
    { key: "links", label: "🔗 Links" },
];

const RESOURCE_LINKS = [
    { name: "UCAS", desc: "Official UK undergraduate application service", url: "https://www.ucas.com/", icon: "🎓" },
    { name: "Study UK", desc: "British Council's official study-in-the-UK guide", url: "https://study-uk.britishcouncil.org/", icon: "🇬🇧" },
    { name: "British Council", desc: "UK's international culture & education body", url: "https://www.britishcouncil.org/", icon: "🏛" },
    { name: "Discover Uni", desc: "Official UK government course comparison tool", url: "https://discoveruni.gov.uk/", icon: "🔍" },
    { name: "FindAMasters", desc: "Search engine for Master's courses worldwide", url: "https://www.findamasters.com/", icon: "📘" },
    { name: "Hotcourses Abroad", desc: "IDP's global study-abroad course search", url: "https://www.hotcoursesabroad.com/", icon: "🌍" },
    { name: "SI-UK", desc: "Free UK university application consultancy", url: "https://www.studyin-uk.com/", icon: "🤝" },
    { name: "Postgraduate Search", desc: "Master's, PhD, MBA & Diploma course search", url: "https://www.postgraduatesearch.com/", icon: "🎯" },
];

// Small self-contained dark-theme palette for the new pieces only
// (Course/Subject filter input, info banner, Links tab cards).
// Existing ue-* classed elements keep whatever UniversityExplorer.css
// already defines — untouched.
const RC = {
    surface: "#161b22", surface2: "#1c2330", border: "#2a3441",
    green: "#00c896", greenDim: "rgba(0,200,150,0.12)",
    text: "#e6edf3", textMuted: "#7d8590", textDim: "#4d5560",
};

function UniversityExplorer({ savedAcademic, onSaveProfile, setTab }) {
    const [activeTab, setActiveTab] = useState("universities");
    const [detailsId, setDetailsId] = useState(null);

    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        country: null,
        level: null,
        ielts: null,
        intake: null,
        tuitionSort: null,
    });
    // Additive-only filter — does not touch the `filters` object above.
    const [courseFilter, setCourseFilter] = useState("");

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
            if (courseFilter.trim()) {
                const cq = courseFilter.trim().toLowerCase();
                if (!u.courses.some((c) => c.toLowerCase().includes(cq))) return false;
            }
            return true;
        });

        if (filters.tuitionSort === "lowest") {
            list = [...list].sort((a, b) => a.tuitionPerYear - b.tuitionPerYear);
        } else if (filters.tuitionSort === "highest") {
            list = [...list].sort((a, b) => b.tuitionPerYear - a.tuitionPerYear);
        }

        return list;
    }, [search, filters, courseFilter]);

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
                            {activeTab === "universities" && (
                                <>
                                    <UniversitySearch value={search} onChange={setSearch} />
                                    <UniversityFilters filters={filters} onChange={handleFiltersChange} />

                                    {/* Course / Subject — additive optional filter, kept close to the
                                        existing filters panel but implemented locally. */}
                                    <div style={{ marginBottom: 12 }}>
                                        <div style={{ fontSize: 11, color: RC.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                            Course / Subject <span style={{ textTransform: "none", color: RC.textDim, fontWeight: 400 }}>(optional)</span>
                                        </div>
                                        <input
                                            value={courseFilter}
                                            onChange={(e) => setCourseFilter(e.target.value)}
                                            placeholder="e.g. Computer Science, MBA, Textile Engineering"
                                            style={{
                                                width: "100%", background: RC.surface2, border: `1px solid ${RC.border}`, borderRadius: 8,
                                                color: RC.text, fontSize: 13, padding: "9px 12px", fontFamily: "inherit", outline: "none",
                                            }}
                                        />
                                    </div>

                                    {/* Persistent info banner — always visible below filters, above results.
                                        A helpful notice, not an error state; same whether or not there are matches. */}
                                    <div style={{
                                        display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
                                        background: RC.surface, border: `1px solid ${RC.border}`, borderRadius: 12,
                                        padding: "12px 14px", marginBottom: 14,
                                    }}>
                                        <div style={{ fontSize: 20, flexShrink: 0 }}>ℹ️</div>
                                        <div style={{ flex: 1, minWidth: 200 }}>
                                            <div style={{ fontSize: 12.5, color: RC.text, lineHeight: 1.55 }}>
                                                SettleUK currently includes a curated selection of UK universities. For a complete university and course search, explore the official UK resources.
                                            </div>
                                            <div style={{ fontSize: 10.5, color: RC.textDim, marginTop: 4 }}>
                                                Database updated regularly. More UK universities will be added over time.
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("links")}
                                            style={{
                                                background: RC.greenDim, border: `1px solid ${RC.green}55`, color: RC.green,
                                                borderRadius: 10, padding: "9px 16px", fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                                                whiteSpace: "nowrap", flexShrink: 0,
                                            }}
                                        >
                                            Explore Official UK Resources →
                                        </button>
                                    </div>

                                    <p className="ue-results-count">
                                        {filteredUniversities.length} universit
                                        {filteredUniversities.length === 1 ? "y" : "ies"} found
                                    </p>

                                    {filteredUniversities.length === 0 ? (
                                        <div style={{ textAlign: "center", padding: "18px 16px", color: RC.textMuted, fontSize: 12.5, lineHeight: 1.6 }}>
                                            No matching university was found in our current database.<br />
                                            Try adjusting your filters or explore the official resources above.
                                        </div>
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

                            {activeTab === "links" && (
                                <div>
                                    <p style={{ fontSize: 12.5, color: RC.textMuted, lineHeight: 1.6, marginBottom: 14 }}>
                                        Official UK education resources — useful when you can't find what you're looking for in our curated list above.
                                    </p>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        {RESOURCE_LINKS.map((link) => (
                                            <a
                                                key={link.name}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    display: "flex", alignItems: "center", gap: 12, textDecoration: "none",
                                                    background: RC.surface, border: `1px solid ${RC.border}`, borderRadius: 12, padding: "12px 14px",
                                                }}
                                            >
                                                <div style={{ width: 38, height: 38, borderRadius: 10, background: RC.greenDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{link.icon}</div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: 13.5, fontWeight: 700, color: RC.text }}>{link.name}</div>
                                                    <div style={{ fontSize: 11.5, color: RC.textMuted, marginTop: 1 }}>{link.desc}</div>
                                                </div>
                                                <span style={{ color: RC.textMuted, fontSize: 16, flexShrink: 0 }}>↗</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default UniversityExplorer;
