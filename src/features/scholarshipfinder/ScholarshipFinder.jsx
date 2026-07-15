import React, { useMemo, useState } from "react";
import {
    Search,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Landmark,
    Building2,
    Globe2,
    Star,
    Calendar,
    GraduationCap,
    Wallet,
    Compass,
} from "lucide-react";

/**
 * ============================================================
 * Scholarship Finder — Quick Tool
 * ============================================================
 * A pure information / front-end tool. No backend, no auth,
 * no database, no external API calls.
 *
 * STYLING NOTE
 * This component ships its own scoped CSS (see <style> block near
 * the bottom of the render) instead of relying on Tailwind utility
 * classes. That's intentional: if your app's Tailwind content
 * config doesn't scan this file's path, Tailwind classes silently
 * produce zero CSS and everything falls back to unstyled default
 * HTML. Scoped CSS guarantees this renders identically everywhere.
 * All classnames are prefixed with `sf-` so they won't collide
 * with the rest of your app.
 *
 * ADDING MORE SCHOLARSHIPS
 * Everything renders off the SCHOLARSHIPS array below. To add a
 * new scholarship, add another object — no UI code needs to change.
 *
 * DATA ACCURACY
 * Deadlines/amounts change year to year — descriptions below are
 * intentionally general; always confirm via the official website.
 * ============================================================
 */

const CATEGORIES = {
    ALL: "All",
    GOVERNMENT: "Government",
    UNIVERSITY: "University",
    EXTERNAL: "External",
    FEATURED: "Featured",
};

const TABS = [CATEGORIES.ALL, CATEGORIES.GOVERNMENT, CATEGORIES.UNIVERSITY, CATEGORIES.EXTERNAL, CATEGORIES.FEATURED];
const LEVEL_FILTERS = ["Bachelor's", "Master's", "PhD"];
const TYPE_FILTERS = ["Government", "University", "Fully Funded", "Partially Funded"];

const SCHOLARSHIPS = [
    {
        id: "chevening", name: "Chevening Scholarship",
        description: "UK government global scholarship for future leaders to pursue a one-year master's degree.",
        category: CATEGORIES.GOVERNMENT, fundingType: "Fully Funded", fundingLevel: "Fully Funded",
        deadline: "Typically Sept–Nov (check official site for current cycle)", studyLevel: "Master's",
        website: "https://www.chevening.org/",
        overview: "Chevening is the UK government's international scholarship programme, funded by the Foreign, Commonwealth & Development Office and partner organisations, aimed at developing future leaders worldwide.",
        benefits: ["Full tuition fees for a one-year master's degree", "Monthly living allowance", "Return economy airfare to the UK", "Additional travel and arrival allowances"],
        eligibility: ["Citizen of a Chevening-eligible country", "At least two years of work experience", "Return to home country for at least two years after the award", "Meet the English language requirement"],
        documents: ["Valid passport", "Two references", "Degree certificate/transcripts", "Personal essays (as part of the online application)"],
        process: "Apply online through the Chevening website during the annual application window, complete required essays, and if shortlisted, attend an interview.",
        notes: "You must apply to your chosen universities separately from the Chevening application.",
    },
    {
        id: "commonwealth", name: "Commonwealth Scholarship",
        description: "Scholarships for citizens of Commonwealth countries to study master's or PhD programmes in the UK.",
        category: CATEGORIES.GOVERNMENT, fundingType: "Fully Funded", fundingLevel: "Fully Funded",
        deadline: "Typically Dec–Jan (check official site for current cycle)", studyLevel: "Master's / PhD",
        website: "https://cscuk.fcdo.gov.uk/",
        overview: "Administered by the Commonwealth Scholarship Commission in the UK, funded by UK aid, supporting students from Commonwealth countries to contribute to development in their home countries.",
        benefits: ["Full tuition fees", "Living allowance (stipend)", "Return airfare", "Other allowances such as thesis grants (for research awards)"],
        eligibility: ["Citizen of, or refugee residing in, an eligible Commonwealth country", "Hold a first degree of upper second-class (2:1) honours standard or above", "Unable to afford to study in the UK without this scholarship (for some award types)"],
        documents: ["Academic transcripts and certificates", "Two references", "Research proposal (for PhD/research routes)", "Passport-style photo"],
        process: "Applications are usually made through the nominating body in your home country (government, university, or approved agency), not directly to CSC.",
        notes: "Nomination routes vary by country — check what's available for your country of citizenship.",
    },
    {
        id: "great", name: "GREAT Scholarship",
        description: "Joint scholarships between the British Council and UK universities for master's study.",
        category: CATEGORIES.EXTERNAL, fundingType: "Partially Funded", fundingLevel: "Partially Funded",
        deadline: "Varies by partner university", studyLevel: "Master's",
        website: "https://study-uk.britishcouncil.org/scholarships/great-scholarships",
        overview: "The GREAT Scholarships scheme is a partnership between the British Council and UK universities, offering awards toward tuition fees for students from specific eligible countries.",
        benefits: ["Contribution toward tuition fees (commonly around £10,000, confirm current amount)", "Awarded per partner university and subject area"],
        eligibility: ["Citizen of an eligible GREAT Scholarship country", "Hold an offer (or apply for one) at a participating university", "Meet the specific university's entry requirements"],
        documents: ["University application/offer", "Academic transcripts", "Personal statement (as required by each university)"],
        process: "Apply directly to the participating university for both admission and the GREAT Scholarship, following that university's specific instructions.",
        notes: "Eligible countries and participating universities change each year — check the British Council page for the current list.",
    },
    {
        id: "british-council", name: "British Council Scholarships",
        description: "A collection of scholarship schemes supported by the British Council for women and international students.",
        category: CATEGORIES.EXTERNAL, fundingType: "Partially Funded", fundingLevel: "Partially Funded",
        deadline: "Varies by scheme", studyLevel: "Master's",
        website: "https://study-uk.britishcouncil.org/scholarships",
        overview: "The British Council supports and promotes several scholarship schemes (including GREAT and Women in STEM awards) that help international students study in the UK.",
        benefits: ["Varies by scheme — may include tuition contribution and/or living costs"],
        eligibility: ["Varies by specific scheme — check individual scheme requirements"],
        documents: ["University application/offer", "Scheme-specific application form"],
        process: "Browse current schemes on the Study UK website and follow each scheme's own application instructions.",
        notes: "This is best used as a directory to discover other schemes you may qualify for.",
    },
    {
        id: "birmingham", name: "University of Birmingham Scholarships",
        description: "Merit and country-specific scholarships offered directly by the University of Birmingham.",
        category: CATEGORIES.UNIVERSITY, fundingType: "Partially Funded", fundingLevel: "Partially Funded",
        deadline: "Varies by scholarship", studyLevel: "Bachelor's / Master's",
        website: "https://www.birmingham.ac.uk/students/finance/scholarships",
        overview: "The University of Birmingham offers a range of international scholarships, including merit-based, subject-specific, and country-specific awards.",
        benefits: ["Partial tuition fee reduction (amount varies by award)"],
        eligibility: ["Hold or apply for an offer at the University of Birmingham", "Meet the academic and country criteria for the specific award"],
        documents: ["University application/offer", "Academic transcripts"],
        process: "Most scholarships are automatically considered upon application, though some require a separate form — check each award's page.",
        notes: "Award availability and value can change each intake — confirm on the official page.",
    },
    {
        id: "glasgow", name: "University of Glasgow Scholarships",
        description: "International scholarships covering a range of subjects and study levels at the University of Glasgow.",
        category: CATEGORIES.UNIVERSITY, fundingType: "Partially Funded", fundingLevel: "Partially Funded",
        deadline: "Varies by scholarship", studyLevel: "Bachelor's / Master's",
        website: "https://www.gla.ac.uk/scholarships/",
        overview: "The University of Glasgow offers international undergraduate and postgraduate scholarships, including merit-based and country-specific awards.",
        benefits: ["Partial tuition fee reduction (amount varies by award)"],
        eligibility: ["Hold or apply for an offer at the University of Glasgow", "Meet the specific award's academic and nationality criteria"],
        documents: ["University application/offer", "Academic transcripts"],
        process: "Check eligibility on the scholarships page; some awards require a separate application, others are automatic.",
        notes: "Confirm current award value and deadlines on the official page.",
    },
    {
        id: "leeds", name: "University of Leeds Scholarships",
        description: "A range of international scholarships for undergraduate and postgraduate students at Leeds.",
        category: CATEGORIES.UNIVERSITY, fundingType: "Partially Funded", fundingLevel: "Partially Funded",
        deadline: "Varies by scholarship", studyLevel: "Bachelor's / Master's",
        website: "https://www.leeds.ac.uk/international-scholarships",
        overview: "The University of Leeds offers merit and country-specific scholarships to help reduce tuition costs for international students.",
        benefits: ["Partial tuition fee reduction (amount varies by award)"],
        eligibility: ["Hold or apply for an offer at the University of Leeds", "Meet the specific award's academic and nationality criteria"],
        documents: ["University application/offer", "Academic transcripts"],
        process: "Some scholarships are awarded automatically on application; others require a separate scholarship application form.",
        notes: "Confirm current award value and deadlines on the official page.",
    },
    {
        id: "portsmouth", name: "University of Portsmouth Scholarships",
        description: "International scholarships aimed at reducing tuition costs for eligible students at Portsmouth.",
        category: CATEGORIES.UNIVERSITY, fundingType: "Partially Funded", fundingLevel: "Partially Funded",
        deadline: "Varies by scholarship", studyLevel: "Bachelor's / Master's",
        website: "https://www.port.ac.uk/study/fees-and-funding/international-scholarships",
        overview: "The University of Portsmouth offers international scholarships designed to make study more affordable for overseas students.",
        benefits: ["Partial tuition fee reduction (amount varies by award)"],
        eligibility: ["Hold or apply for an offer at the University of Portsmouth", "Meet the specific award's academic and nationality criteria"],
        documents: ["University application/offer", "Academic transcripts"],
        process: "Check the scholarships page for whether the award is automatic or requires a separate application.",
        notes: "Confirm current award value and deadlines on the official page.",
    },
    {
        id: "aston", name: "Aston University Scholarships",
        description: "Scholarships for international students covering a portion of tuition fees at Aston University.",
        category: CATEGORIES.UNIVERSITY, fundingType: "Partially Funded", fundingLevel: "Partially Funded",
        deadline: "Varies by scholarship", studyLevel: "Bachelor's / Master's",
        website: "https://www.aston.ac.uk/study/international/scholarships",
        overview: "Aston University offers a number of international scholarships aimed at making study more accessible for overseas students.",
        benefits: ["Partial tuition fee reduction (amount varies by award)"],
        eligibility: ["Hold or apply for an offer at Aston University", "Meet the specific award's academic and nationality criteria"],
        documents: ["University application/offer", "Academic transcripts"],
        process: "Check the scholarships page for whether the award is automatic or requires a separate application.",
        notes: "Confirm current award value and deadlines on the official page.",
    },
    {
        id: "hertfordshire", name: "University of Hertfordshire Scholarships",
        description: "International scholarships supporting undergraduate and postgraduate students at Hertfordshire.",
        category: CATEGORIES.UNIVERSITY, fundingType: "Partially Funded", fundingLevel: "Partially Funded",
        deadline: "Varies by scholarship", studyLevel: "Bachelor's / Master's",
        website: "https://www.herts.ac.uk/international/fees-and-scholarships",
        overview: "The University of Hertfordshire offers a range of international scholarships to help reduce the overall cost of study.",
        benefits: ["Partial tuition fee reduction (amount varies by award)"],
        eligibility: ["Hold or apply for an offer at the University of Hertfordshire", "Meet the specific award's academic and nationality criteria"],
        documents: ["University application/offer", "Academic transcripts"],
        process: "Check the scholarships page for whether the award is automatic or requires a separate application.",
        notes: "Confirm current award value and deadlines on the official page.",
    },
];

const FEATURED_IDS = new Set(["chevening", "commonwealth", "great"]);

const OFFICIAL_LINKS = [
    { name: "Chevening", url: "https://www.chevening.org/" },
    { name: "British Council", url: "https://www.britishcouncil.org/" },
    { name: "Study UK", url: "https://study-uk.britishcouncil.org/" },
    { name: "Commonwealth Scholarship Commission", url: "https://cscuk.fcdo.gov.uk/" },
];

function categoryIcon(category) {
    switch (category) {
        case CATEGORIES.GOVERNMENT: return Landmark;
        case CATEGORIES.UNIVERSITY: return Building2;
        case CATEGORIES.EXTERNAL: return Globe2;
        default: return Star;
    }
}

function Pill({ children }) {
    return <span className="sf-pill">{children}</span>;
}

function ScholarshipCard({ scholarship, isExpanded, onToggle }) {
    const Icon = categoryIcon(scholarship.category);

    return (
        <div className="sf-card">
            <div className="sf-card-body">
                <div className="sf-card-top">
                    <div className="sf-card-icon">
                        <Icon size={20} strokeWidth={2} color="#22c55e" />
                    </div>
                    <div className="sf-card-headtext">
                        <h3 className="sf-card-title">{scholarship.name}</h3>
                        <p className="sf-card-desc">{scholarship.description}</p>
                    </div>
                </div>

                <div className="sf-pill-row">
                    <Pill>{scholarship.fundingType}</Pill>
                    <Pill>{scholarship.studyLevel}</Pill>
                    <Pill>{scholarship.category}</Pill>
                </div>

                <div className="sf-deadline">
                    <Calendar size={14} strokeWidth={2} color="#71717a" />
                    <span>{scholarship.deadline}</span>
                </div>

                <div className="sf-actions">
                    <a href={scholarship.website} target="_blank" rel="noopener noreferrer" className="sf-btn-primary">
                        Official Website
                        <ExternalLink size={14} strokeWidth={2.5} />
                    </a>
                    <button onClick={onToggle} className="sf-btn-secondary">
                        {isExpanded ? "Collapse" : "Expand"}
                        {isExpanded ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="sf-expanded">
                    <div className="sf-expand-block">
                        <h4 className="sf-expand-label">Overview</h4>
                        <p className="sf-expand-text">{scholarship.overview}</p>
                    </div>
                    <div className="sf-expand-block">
                        <h4 className="sf-expand-label">Benefits</h4>
                        <ul className="sf-expand-list">
                            {scholarship.benefits.map((item) => (
                                <li key={item}><span className="sf-expand-dot" />{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="sf-expand-block">
                        <h4 className="sf-expand-label">Eligibility</h4>
                        <ul className="sf-expand-list">
                            {scholarship.eligibility.map((item) => (
                                <li key={item}><span className="sf-expand-dot" />{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="sf-expand-block">
                        <h4 className="sf-expand-label">Required Documents</h4>
                        <ul className="sf-expand-list">
                            {scholarship.documents.map((item) => (
                                <li key={item}><span className="sf-expand-dot" />{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="sf-expand-block">
                        <h4 className="sf-expand-label">Application Process</h4>
                        <p className="sf-expand-text">{scholarship.process}</p>
                    </div>
                    <div className="sf-expand-block">
                        <h4 className="sf-expand-label">Important Notes</h4>
                        <p className="sf-expand-text">{scholarship.notes}</p>
                    </div>
                    <div className="sf-actions">
                        <a href={scholarship.website} target="_blank" rel="noopener noreferrer" className="sf-btn-primary">
                            Official Website
                            <ExternalLink size={14} strokeWidth={2.5} />
                        </a>
                        <button onClick={onToggle} className="sf-btn-secondary">
                            Collapse
                            <ChevronUp size={14} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ScholarshipFinder() {
    const [activeTab, setActiveTab] = useState(CATEGORIES.ALL);
    const [query, setQuery] = useState("");
    const [activeFilters, setActiveFilters] = useState([]);
    const [expandedId, setExpandedId] = useState(null);

    const toggleFilter = (filter) => {
        setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]));
    };

    const filtered = useMemo(() => {
        return SCHOLARSHIPS.filter((s) => {
            if (activeTab === CATEGORIES.FEATURED) {
                if (!FEATURED_IDS.has(s.id)) return false;
            } else if (activeTab !== CATEGORIES.ALL) {
                if (s.category !== activeTab) return false;
            }
            if (query.trim()) {
                const q = query.trim().toLowerCase();
                const haystack = `${s.name} ${s.description} ${s.category}`.toLowerCase();
                if (!haystack.includes(q)) return false;
            }
            if (activeFilters.length > 0) {
                const matchesAll = activeFilters.every((f) => {
                    if (LEVEL_FILTERS.includes(f)) return s.studyLevel.includes(f.replace("'s", "")) || s.studyLevel.includes(f);
                    if (f === "Government" || f === "University") return s.category === f;
                    if (f === "Fully Funded" || f === "Partially Funded") return s.fundingLevel === f;
                    return true;
                });
                if (!matchesAll) return false;
            }
            return true;
        });
    }, [activeTab, query, activeFilters]);

    return (
        <div className="sf-page">
            <div className="sf-container">
                <header className="sf-header">
                    <h1 className="sf-title">Scholarship Finder</h1>
                    <p className="sf-subtitle">Explore scholarships available for international students studying in the UK.</p>
                </header>

                <div className="sf-search-wrap">
                    <Search size={16} color="#71717a" className="sf-search-icon" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name, university, or keyword"
                        className="sf-search-input"
                    />
                </div>

                <div className="sf-tabs">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`sf-tab ${activeTab === tab ? "sf-tab-active" : ""}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="sf-filter-block">
                    <div className="sf-filter-label">
                        <Compass size={14} strokeWidth={2} />
                        Filter
                    </div>
                    <div className="sf-filter-row">
                        {[...LEVEL_FILTERS, ...TYPE_FILTERS].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => toggleFilter(filter)}
                                className={`sf-chip ${activeFilters.includes(filter) ? "sf-chip-active" : ""}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {filtered.length > 0 ? (
                    <div className="sf-list">
                        {filtered.map((scholarship) => (
                            <ScholarshipCard
                                key={scholarship.id}
                                scholarship={scholarship}
                                isExpanded={expandedId === scholarship.id}
                                onToggle={() => setExpandedId((prev) => (prev === scholarship.id ? null : scholarship.id))}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="sf-empty">
                        <div className="sf-empty-icon">
                            <GraduationCap size={24} strokeWidth={2} color="#22c55e" />
                        </div>
                        <p className="sf-empty-text">No scholarship matches your search.</p>
                        <a
                            href="https://study-uk.britishcouncil.org/scholarships"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sf-btn-primary sf-empty-btn"
                        >
                            Browse Official Scholarship Websites
                            <ExternalLink size={14} strokeWidth={2.5} />
                        </a>
                    </div>
                )}

                <section className="sf-links-section">
                    <h2 className="sf-section-label">Official Resources</h2>
                    <div className="sf-links-card">
                        {OFFICIAL_LINKS.map((link) => (
                            <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="sf-link-row">
                                <div className="sf-link-left">
                                    <div className="sf-link-icon">
                                        <Wallet size={16} strokeWidth={2} color="#22c55e" />
                                    </div>
                                    <span>{link.name}</span>
                                </div>
                                <ExternalLink size={16} strokeWidth={2} color="#71717a" />
                            </a>
                        ))}
                    </div>
                </section>
            </div>

            <style>{`
        .sf-page {
          min-height: 100vh;
          background: #0a0a0f;
          color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .sf-container { max-width: 480px; margin: 0 auto; padding: 24px 16px 64px; box-sizing: border-box; }
        .sf-header { margin-bottom: 20px; }
        .sf-title { font-size: 26px; font-weight: 700; margin: 0; letter-spacing: -0.02em; }
        .sf-subtitle { font-size: 14px; color: #a1a1aa; margin: 8px 0 0; line-height: 1.5; }

        .sf-search-wrap { position: relative; margin-bottom: 16px; }
        .sf-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); }
        .sf-search-input {
          width: 100%; box-sizing: border-box; background: #16161d; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; color: #ffffff; font-size: 14px; padding: 13px 16px 13px 38px; outline: none;
        }
        .sf-search-input::placeholder { color: #71717a; }
        .sf-search-input:focus { border-color: rgba(34,197,94,0.5); box-shadow: 0 0 0 3px rgba(34,197,94,0.15); }

        .sf-tabs { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 16px; scrollbar-width: none; }
        .sf-tabs::-webkit-scrollbar { display: none; }
        .sf-tab {
          flex-shrink: 0; border-radius: 999px; padding: 9px 16px; font-size: 12px; font-weight: 600;
          background: #16161d; color: #a1a1aa; border: 1px solid rgba(255,255,255,0.08); cursor: pointer;
        }
        .sf-tab-active { background: #22c55e; color: #0a0a0a; border-color: #22c55e; }

        .sf-filter-block { margin-bottom: 20px; }
        .sf-filter-label { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #71717a; font-weight: 600; margin-bottom: 8px; }
        .sf-filter-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .sf-chip {
          border-radius: 999px; padding: 7px 12px; font-size: 11px; font-weight: 500; cursor: pointer;
          background: #16161d; color: #a1a1aa; border: 1px solid rgba(255,255,255,0.08);
        }
        .sf-chip-active { background: rgba(34,197,94,0.15); border-color: rgba(34,197,94,0.4); color: #4ade80; }

        .sf-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
        .sf-card { border-radius: 20px; background: #16161d; border: 1px solid rgba(255,255,255,0.08); overflow: hidden; }
        .sf-card-body { padding: 16px; }
        .sf-card-top { display: flex; align-items: flex-start; gap: 12px; }
        .sf-card-icon {
          width: 40px; height: 40px; border-radius: 12px; background: rgba(34,197,94,0.12);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .sf-card-headtext { min-width: 0; }
        .sf-card-title { font-size: 14px; font-weight: 600; margin: 0; line-height: 1.3; }
        .sf-card-desc { font-size: 12px; color: #a1a1aa; margin: 4px 0 0; line-height: 1.5; }

        .sf-pill-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
        .sf-pill { background: #232329; color: #d4d4d8; font-size: 11px; font-weight: 500; border-radius: 999px; padding: 4px 10px; }

        .sf-deadline { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #71717a; margin-top: 12px; }

        .sf-actions { display: flex; gap: 8px; margin-top: 16px; }
        .sf-btn-primary {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
          background: #22c55e; color: #0a0a0a; font-weight: 700; font-size: 12px; border: none;
          border-radius: 14px; padding: 11px 12px; cursor: pointer; text-decoration: none; box-sizing: border-box;
        }
        .sf-btn-primary:hover { background: #16a34a; }
        .sf-btn-secondary {
          display: flex; align-items: center; justify-content: center; gap: 4px;
          border: 1px solid rgba(255,255,255,0.15); color: #d4d4d8; background: transparent;
          border-radius: 14px; padding: 11px 14px; font-size: 12px; font-weight: 500; cursor: pointer; white-space: nowrap;
        }
        .sf-btn-secondary:hover { background: rgba(255,255,255,0.06); }

        .sf-expanded { border-top: 1px solid rgba(255,255,255,0.08); background: rgba(0,0,0,0.25); padding: 16px; }
        .sf-expand-block { margin-bottom: 16px; }
        .sf-expand-block:last-of-type { margin-bottom: 0; }
        .sf-expand-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: #22c55e; margin: 0 0 6px; }
        .sf-expand-text { font-size: 12px; color: #a1a1aa; line-height: 1.6; margin: 0; }
        .sf-expand-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
        .sf-expand-list li { font-size: 12px; color: #a1a1aa; display: flex; align-items: flex-start; gap: 8px; line-height: 1.5; }
        .sf-expand-dot { width: 4px; height: 4px; border-radius: 50%; background: #22c55e; margin-top: 6px; flex-shrink: 0; }

        .sf-empty { border-radius: 20px; background: #16161d; border: 1px solid rgba(255,255,255,0.08); padding: 28px 20px; text-align: center; margin-bottom: 32px; }
        .sf-empty-icon {
          width: 48px; height: 48px; border-radius: 16px; background: rgba(34,197,94,0.12);
          display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;
        }
        .sf-empty-text { font-size: 14px; color: #d4d4d8; margin: 0 0 16px; }
        .sf-empty-btn { display: inline-flex; flex: none; padding: 11px 18px; }

        .sf-section-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #22c55e; margin: 0 0 12px; }
        .sf-links-card { border-radius: 20px; background: #16161d; border: 1px solid rgba(255,255,255,0.08); overflow: hidden; }
        .sf-link-row {
          display: flex; align-items: center; justify-content: space-between; padding: 14px 16px;
          text-decoration: none; color: inherit; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .sf-link-row:last-child { border-bottom: none; }
        .sf-link-row:hover { background: rgba(255,255,255,0.04); }
        .sf-link-left { display: flex; align-items: center; gap: 12px; }
        .sf-link-left span { font-size: 14px; font-weight: 500; color: #ffffff; }
        .sf-link-icon { width: 32px; height: 32px; border-radius: 10px; background: rgba(34,197,94,0.12); display: flex; align-items: center; justify-content: center; }
      `}</style>
        </div>
    );
}
