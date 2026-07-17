import React, { useRef, useState } from "react";
import { useJourneyContext } from "../context/JourneyContext";
import { STATUSES } from "../data/stages";
import { DOCS } from "../data/documents";
import { loadLS } from "../hooks/useLocalStorage";
import pkg from "../../package.json";
import "./Profile.css";

/*
 * ============================================================================
 * Profile page family — Profile, PersonalInformation, Settings — all in one
 * file (+ one Profile.css) per request. Three separate screens, wired in
 * App.js via screen="profile" / "personal-info" / "app-settings", same
 * pattern as "journey"/"tasks". Each is exported below; Profile is the
 * default export, PersonalInformation and Settings are named exports.
 *
 * UX: previously the avatar edit icon, the "Personal Information" row, AND
 * the header gear icon all opened the exact same Settings popup — three
 * entry points, one confusing destination, with fields that didn't belong
 * there anymore. Now:
 *   - Hero card / "Personal Information" -> PersonalInformation (the only
 *     place profile fields are edited; Hero card itself is read-only).
 *   - Header gear icon -> Settings (app preferences + Danger Zone only,
 *     no personal info).
 *
 * Note: this does NOT touch the app's original SettingsModal
 * (src/components/modals/SettingsModal.jsx) or the openSettings/
 * showSettings wiring in useJourney.js / App.js — Home's own header
 * (src/components/home/Header.jsx, a separate, untouched entry point)
 * still uses that exact modal for its own gear icon, unrelated to this
 * page family.
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

// Identical logic to HomeDashboard.jsx's getDaysLeft — duplicated locally
// since HomeDashboard.jsx is a final/untouched page and doesn't export it.
function getDaysLeft(arrival) {
    if (!arrival) return null;
    const arrivalDate = new Date(arrival);
    if (isNaN(arrivalDate.getTime())) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    arrivalDate.setHours(0, 0, 0, 0);
    const diffMs = arrivalDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

function formatIntake(arrival) {
    if (!arrival) return "Not set";
    const d = new Date(arrival);
    if (isNaN(d.getTime())) return "Not set";
    return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function getInitials(name) {
    if (!name || !name.trim()) return "?";
    const parts = name.trim().split(/\s+/);
    return parts.length === 1
        ? parts[0].slice(0, 2).toUpperCase()
        : (parts[0][0] + parts[1][0]).toUpperCase();
}

// Same WhatsApp community link ApplicationAssistant.jsx uses. That file
// doesn't export the constant, so the URL is duplicated here rather than
// touching ApplicationAssistant.jsx (an existing, untouched page).
const WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/your-invite-code";

const CURRENCY_KEY = "settleuk_currency_pref";
const LANGUAGE_KEY = "settleuk_language_pref";
const NOTIF_KEY = "settleuk_notifications_pref";

// Same intake options Onboarding.jsx offers (INTAKE_OPTIONS). That file
// doesn't export the list, so it's duplicated here rather than touching
// Onboarding.jsx (an existing, untouched flow).
const INTAKE_OPTIONS = ["January 2027", "May 2027", "September 2027", "January 2028"];

const STUDY_LEVELS = ["Foundation", "Undergraduate", "Postgraduate (Master's)", "PhD / Doctorate"];

// ---------------------------------------------------------------------------
// Profile — main screen. Read-only Hero card + "My Journey" list.
// ---------------------------------------------------------------------------
export default function Profile({ onBack }) {
    const { profile, setScreen, setTab, setView, docChecked } = useJourneyContext();

    const [notifOpen, setNotifOpen] = useState(false);
    const [notifPref] = useState(() => loadLS(NOTIF_KEY, true));

    const currentStatus = STATUSES[profile.statusId] ?? STATUSES[0];
    const progressPct = Math.round((profile.statusId / (STATUSES.length - 1)) * 100);
    const daysLeft = getDaysLeft(profile.arrival);

    const checkedDocs = Object.values(docChecked).filter(Boolean).length;
    const savedUniCount = loadLS("settleuk_saved_universities", []).length;
    const budgetEstimate = loadLS("settleuk_budget_estimate", null);

    function goToTab(tabKey) {
        setView("uk");
        setScreen("home");
        setTab(tabKey);
    }

    function handleBack() {
        if (onBack) onBack();
        else {
            setScreen("home");
            setTab("home");
        }
    }

    function openPersonalInformation() {
        setScreen("personal-info");
    }

    function openAppSettings() {
        setScreen("app-settings");
    }

    return (
        <div className="pf-page">
            {/* HEADER */}
            <div className="pf-header">
                <div className="pf-header-left">
                    <button type="button" className="pf-icon-btn" onClick={handleBack} aria-label="Back">
                        ←
                    </button>
                    <h1 className="pf-header-title">Profile</h1>
                </div>
                <div className="pf-header-right">
                    <div style={{ position: "relative" }}>
                        <button
                            type="button"
                            className="pf-icon-btn"
                            onClick={() => setNotifOpen((o) => !o)}
                            aria-label="Notifications"
                        >
                            🔔
                            {notifPref && <span className="pf-notif-dot" />}
                        </button>
                        {notifOpen && (
                            <div className="pf-notif-panel">You're all caught up! No new notifications.</div>
                        )}
                    </div>
                    {/* Opens the dedicated Settings page — app preferences +
                        Danger Zone only. Not Personal Information, and not
                        the old SettingsModal popup. */}
                    <button type="button" className="pf-icon-btn" onClick={openAppSettings} aria-label="Settings">
                        ⚙️
                    </button>
                </div>
            </div>

            {/* HERO CARD — fully read-only. Tap anywhere to edit in Personal
                Information; no separate edit icon on it anymore. */}
            <button type="button" className="pf-hero" onClick={openPersonalInformation}>
                <div className="pf-hero-top">
                    <div className="pf-avatar-wrap">
                        <div className="pf-avatar">
                            {profile.avatarUrl ? (
                                <img src={profile.avatarUrl} alt="" />
                            ) : (
                                getInitials(profile.name)
                            )}
                        </div>
                    </div>
                    <div className="pf-identity">
                        <div className="pf-name">{profile.name || "Your Name"}</div>
                        <div className="pf-email-display">{profile.email || "Add your email"}</div>
                    </div>
                    <span className="pf-hero-chevron">›</span>
                </div>

                <div className="pf-stage-chip">
                    <span>{currentStatus.emoji}</span>
                    <span>{currentStatus.label}</span>
                </div>

                <div className="pf-hero-stats">
                    <div className="pf-stat-block">
                        <div className="pf-stat-number">{daysLeft !== null ? daysLeft : "—"}</div>
                        <div className="pf-stat-label">Days Remaining</div>
                    </div>
                    <div className="pf-hero-divider" />
                    <div className="pf-progress-block">
                        <div className="pf-progress-label">
                            <span className="pf-progress-pct">{progressPct}%</span> Complete
                        </div>
                        <div className="pf-progress-track">
                            <div className="pf-progress-fill" style={{ width: `${progressPct}%` }} />
                        </div>
                    </div>
                </div>

                <div className="pf-hero-meta">
                    <div className="pf-meta-item">
                        Intake: <strong>{formatIntake(profile.arrival)}</strong>
                    </div>
                </div>
            </button>

            {/* MY JOURNEY */}
            <div className="pf-section">
                <div className="pf-section-title">My Journey</div>
                <div className="pf-card-list">
                    <button type="button" className="pf-row" onClick={openPersonalInformation}>
                        <div className="pf-row-icon">👤</div>
                        <div className="pf-row-body">
                            <div className="pf-row-title">Personal Information</div>
                            <div className="pf-row-sub">Name, email, study level & more</div>
                        </div>
                        <span className="pf-row-chevron">›</span>
                    </button>

                    <button type="button" className="pf-row" onClick={() => goToTab("docs")}>
                        <div className="pf-row-icon">🧳</div>
                        <div className="pf-row-body">
                            <div className="pf-row-title">Documents</div>
                            <div className="pf-row-sub">{checkedDocs}/{DOCS.length} prepared</div>
                        </div>
                        <span className="pf-row-chevron">›</span>
                    </button>

                    <button type="button" className="pf-row" onClick={() => goToTab("costs")}>
                        <div className="pf-row-icon">🧮</div>
                        <div className="pf-row-body">
                            <div className="pf-row-title">Budget Summary</div>
                            <div className="pf-row-sub">
                                {budgetEstimate?.grandTotal
                                    ? `£${Number(budgetEstimate.grandTotal).toLocaleString()} planned`
                                    : "Plan your total expenses"}
                            </div>
                        </div>
                        <span className="pf-row-chevron">›</span>
                    </button>

                    <button type="button" className="pf-row" onClick={() => goToTab("university-explorer")}>
                        <div className="pf-row-icon">🏛️</div>
                        <div className="pf-row-body">
                            <div className="pf-row-title">Saved Universities</div>
                            <div className="pf-row-sub">
                                {savedUniCount > 0 ? `${savedUniCount} saved` : "None saved yet"}
                            </div>
                        </div>
                        <span className="pf-row-chevron">›</span>
                    </button>

                    <button type="button" className="pf-row" onClick={() => goToTab("scholarship")}>
                        <div className="pf-row-icon">🎓</div>
                        <div className="pf-row-body">
                            <div className="pf-row-title">Saved Scholarships</div>
                            <div className="pf-row-sub">Explore UK scholarships</div>
                        </div>
                        <span className="pf-row-chevron">›</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// PersonalInformation — the one place profile fields are edited. Reached
// from the Hero card or the "Personal Information" row above.
// ---------------------------------------------------------------------------
export function PersonalInformation({ onBack }) {
    const { profile, setProfile } = useJourneyContext();
    const fileInputRef = useRef(null);

    const [draft, setDraft] = useState({
        name: profile.name || "",
        email: profile.email || "",
        studyLevel: profile.studyLevel || "",
        arrival: profile.arrival || "",
        nationality: profile.nationality || "",
        phone: profile.phone || "",
        avatarUrl: profile.avatarUrl || "",
    });
    const [saved, setSaved] = useState(false);

    const intakeOptions = INTAKE_OPTIONS.includes(draft.arrival) || !draft.arrival
        ? INTAKE_OPTIONS
        : [draft.arrival, ...INTAKE_OPTIONS];

    function update(field, value) {
        setDraft((d) => ({ ...d, [field]: value }));
        setSaved(false);
    }

    function handlePhotoPick(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => update("avatarUrl", reader.result);
        reader.readAsDataURL(file);
    }

    function handleSave() {
        if (!draft.name.trim()) return;
        setProfile((p) => ({
            ...p,
            name: draft.name.trim(),
            email: draft.email.trim(),
            studyLevel: draft.studyLevel,
            arrival: draft.arrival,
            nationality: draft.nationality.trim(),
            phone: draft.phone.trim(),
            avatarUrl: draft.avatarUrl,
        }));
        setSaved(true);
        setTimeout(() => {
            if (onBack) onBack();
        }, 700);
    }

    function handleBack() {
        if (onBack) onBack();
    }

    return (
        <div className="pf-page">
            <div className="pf-header">
                <div className="pf-header-left">
                    <button type="button" className="pf-icon-btn" onClick={handleBack} aria-label="Back">
                        ←
                    </button>
                    <h1 className="pf-header-title">Personal Information</h1>
                </div>
            </div>

            {/* Profile picture */}
            <div className="pi-avatar-block">
                <div className="pi-avatar">
                    {draft.avatarUrl ? <img src={draft.avatarUrl} alt="" /> : getInitials(draft.name)}
                </div>
                <button type="button" className="pi-avatar-btn" onClick={() => fileInputRef.current?.click()}>
                    📷 Change Photo
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handlePhotoPick}
                />
            </div>

            {/* Form */}
            <div className="pf-section">
                <div className="pf-card-list pi-form-card">
                    <div className="pi-field">
                        <label className="pi-label" htmlFor="pi-name">Full Name</label>
                        <input
                            id="pi-name"
                            className="pi-input"
                            type="text"
                            value={draft.name}
                            onChange={(e) => update("name", e.target.value)}
                            placeholder="Your full name"
                        />
                    </div>

                    <div className="pi-field">
                        <label className="pi-label" htmlFor="pi-email">Email</label>
                        <input
                            id="pi-email"
                            className="pi-input"
                            type="email"
                            value={draft.email}
                            onChange={(e) => update("email", e.target.value)}
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="pi-field">
                        <label className="pi-label" htmlFor="pi-study-level">Study Level</label>
                        <select
                            id="pi-study-level"
                            className="pi-select"
                            value={draft.studyLevel}
                            onChange={(e) => update("studyLevel", e.target.value)}
                        >
                            <option value="">Select study level</option>
                            {STUDY_LEVELS.map((lvl) => (
                                <option key={lvl} value={lvl}>{lvl}</option>
                            ))}
                        </select>
                    </div>

                    <div className="pi-field">
                        <label className="pi-label" htmlFor="pi-intake">Target Intake</label>
                        <select
                            id="pi-intake"
                            className="pi-select"
                            value={draft.arrival}
                            onChange={(e) => update("arrival", e.target.value)}
                        >
                            <option value="">Select intake</option>
                            {intakeOptions.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    <div className="pi-field">
                        <label className="pi-label" htmlFor="pi-nationality">Nationality</label>
                        <input
                            id="pi-nationality"
                            className="pi-input"
                            type="text"
                            value={draft.nationality}
                            onChange={(e) => update("nationality", e.target.value)}
                            placeholder="e.g. Bangladeshi"
                        />
                    </div>

                    <div className="pi-field pi-field-last">
                        <label className="pi-label" htmlFor="pi-phone">Phone Number <span className="pi-optional">(optional)</span></label>
                        <input
                            id="pi-phone"
                            className="pi-input"
                            type="tel"
                            value={draft.phone}
                            onChange={(e) => update("phone", e.target.value)}
                            placeholder="+880 1XXX-XXXXXX"
                        />
                    </div>
                </div>
            </div>

            <button
                type="button"
                className="pf-primary-btn"
                onClick={handleSave}
                disabled={!draft.name.trim()}
            >
                {saved ? "✓ Saved" : "Save Changes"}
            </button>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Settings — app preferences only (no personal information). Reached from
// the Profile header's gear icon.
// ---------------------------------------------------------------------------
export function Settings({ onBack }) {
    const { resetAllProgress } = useJourneyContext();

    const [currencyOpen, setCurrencyOpen] = useState(false);
    const [currency, setCurrency] = useState(() => loadLS(CURRENCY_KEY, "GBP"));
    const [languageOpen, setLanguageOpen] = useState(false);
    const [language, setLanguage] = useState(() => loadLS(LANGUAGE_KEY, "English"));
    const [notifPref, setNotifPref] = useState(() => loadLS(NOTIF_KEY, true));
    const [expandedInfo, setExpandedInfo] = useState(null); // "privacy" | "about" | null
    const [toast, setToast] = useState("");

    function showToast(msg) {
        setToast(msg);
        setTimeout(() => setToast(""), 2200);
    }

    function handleBack() {
        if (onBack) onBack();
    }

    function toggleCurrency(code) {
        setCurrency(code);
        localStorage.setItem(CURRENCY_KEY, JSON.stringify(code));
        setCurrencyOpen(false);
    }

    function toggleLanguage(lang) {
        setLanguage(lang);
        localStorage.setItem(LANGUAGE_KEY, JSON.stringify(lang));
        setLanguageOpen(false);
    }

    function toggleNotifPref() {
        const next = !notifPref;
        setNotifPref(next);
        localStorage.setItem(NOTIF_KEY, JSON.stringify(next));
    }

    return (
        <div className="pf-page">
            <div className="pf-header">
                <div className="pf-header-left">
                    <button type="button" className="pf-icon-btn" onClick={handleBack} aria-label="Back">
                        ←
                    </button>
                    <h1 className="pf-header-title">Settings</h1>
                </div>
            </div>

            {/* PREFERENCES */}
            <div className="pf-section">
                <div className="pf-section-title">Preferences</div>

                <div className="pf-card-list" style={{ marginBottom: "var(--spacing-sm)" }}>
                    <div className="pf-row" style={{ cursor: "default" }}>
                        <div className="pf-row-icon">🌙</div>
                        <div className="pf-row-body">
                            <div className="pf-row-title">Dark Mode</div>
                            <div className="pf-row-sub">Always on for the best experience</div>
                        </div>
                        <button type="button" className="pf-switch is-on is-disabled" disabled aria-label="Dark mode always on">
                            <span className="pf-switch-knob" />
                        </button>
                    </div>
                </div>

                <div className="pf-card-list" style={{ marginBottom: "var(--spacing-sm)" }}>
                    <div className="pf-row" style={{ cursor: "default" }}>
                        <div className="pf-row-icon">🔔</div>
                        <div className="pf-row-body">
                            <div className="pf-row-title">Notifications</div>
                            <div className="pf-row-sub">Reminders & journey updates</div>
                        </div>
                        <button
                            type="button"
                            className={`pf-switch ${notifPref ? "is-on" : ""}`}
                            onClick={toggleNotifPref}
                            aria-label="Toggle notifications"
                        >
                            <span className="pf-switch-knob" />
                        </button>
                    </div>
                </div>

                <div className="pf-card-list" style={{ marginBottom: "var(--spacing-sm)" }}>
                    <button type="button" className="pf-row" onClick={() => setCurrencyOpen((o) => !o)}>
                        <div className="pf-row-icon">💷</div>
                        <div className="pf-row-body">
                            <div className="pf-row-title">Currency</div>
                            <div className="pf-row-sub">Used across budget & expense tools</div>
                        </div>
                        <span className="pf-row-value">{currency}</span>
                    </button>
                    {currencyOpen && (
                        <div className="pf-option-panel">
                            {["GBP", "BDT", "USD"].map((code) => (
                                <button
                                    key={code}
                                    type="button"
                                    className={`pf-option-pill ${currency === code ? "is-active" : ""}`}
                                    onClick={() => toggleCurrency(code)}
                                >
                                    {code}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pf-card-list">
                    <button type="button" className="pf-row" onClick={() => setLanguageOpen((o) => !o)}>
                        <div className="pf-row-icon">🌐</div>
                        <div className="pf-row-body">
                            <div className="pf-row-title">Language</div>
                            <div className="pf-row-sub">App display language</div>
                        </div>
                        <span className="pf-row-value">{language}</span>
                    </button>
                    {languageOpen && (
                        <div className="pf-option-panel">
                            {["English", "বাংলা"].map((lang) => (
                                <button
                                    key={lang}
                                    type="button"
                                    className={`pf-option-pill ${language === lang ? "is-active" : ""}`}
                                    onClick={() => toggleLanguage(lang)}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* SUPPORT */}
            <div className="pf-section">
                <div className="pf-section-title">Support</div>
                <div className="pf-card-list">
                    <button
                        type="button"
                        className="pf-row"
                        onClick={() => setExpandedInfo((v) => (v === "privacy" ? null : "privacy"))}
                    >
                        <div className="pf-row-icon">🔒</div>
                        <div className="pf-row-body">
                            <div className="pf-row-title">Privacy Policy</div>
                        </div>
                        <span className="pf-row-chevron">{expandedInfo === "privacy" ? "⌄" : "›"}</span>
                    </button>
                    {expandedInfo === "privacy" && (
                        <div className="pf-expand-panel">
                            Your journey data (name, arrival date, tasks, documents, expenses) is stored only on
                            this device and is never uploaded to a server. Clearing your browser data or using
                            "Reset All Progress" below will permanently erase it.
                        </div>
                    )}

                    <button
                        type="button"
                        className="pf-row"
                        onClick={() => setExpandedInfo((v) => (v === "about" ? null : "about"))}
                    >
                        <div className="pf-row-icon">ℹ️</div>
                        <div className="pf-row-body">
                            <div className="pf-row-title">About Journey to UK</div>
                        </div>
                        <span className="pf-row-chevron">{expandedInfo === "about" ? "⌄" : "›"}</span>
                    </button>
                    {expandedInfo === "about" && (
                        <div className="pf-expand-panel">
                            Journey to UK helps Bangladeshi students plan every step of studying in the UK —
                            from research and IELTS to visa, packing, and arrival — all in one place.
                        </div>
                    )}

                    <div className="pf-row" style={{ cursor: "default" }}>
                        <div className="pf-row-icon">📦</div>
                        <div className="pf-row-body">
                            <div className="pf-row-title">App Version</div>
                        </div>
                        <span className="pf-row-value">v{pkg.version}</span>
                    </div>

                    <button
                        type="button"
                        className="pf-row"
                        onClick={() => showToast("Thanks for the love! Rating coming soon 🌟")}
                    >
                        <div className="pf-row-icon">⭐</div>
                        <div className="pf-row-body">
                            <div className="pf-row-title">Rate this App</div>
                        </div>
                        <span className="pf-row-chevron">›</span>
                    </button>

                    <button
                        type="button"
                        className="pf-row"
                        onClick={() => window.open(WHATSAPP_COMMUNITY_URL, "_blank", "noopener,noreferrer")}
                    >
                        <div className="pf-row-icon">🤝</div>
                        <div className="pf-row-body">
                            <div className="pf-row-title">Join WhatsApp Community</div>
                        </div>
                        <span className="pf-row-chevron">›</span>
                    </button>
                </div>
            </div>

            {/* DANGER ZONE */}
            <div className="pf-section">
                <div className="pf-section-title">Danger Zone</div>
                <div className="pf-danger-card">
                    <button type="button" className="pf-danger-btn" onClick={resetAllProgress}>
                        Reset All Progress
                    </button>
                    <div className="pf-danger-note">
                        This permanently deletes your saved progress, tasks, documents, and expenses from this
                        device. You'll be asked to confirm before anything is removed.
                    </div>
                </div>
            </div>

            <div className="pf-version">Journey to UK · v{pkg.version}</div>

            {toast && <div className="pf-toast">{toast}</div>}
        </div>
    );
}
