import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    GraduationCap,
    ClipboardCheck,
    BellRing,
    FileCheck2,
    Calculator,
    Luggage,
    BookOpenCheck,
    Search,
    User,
    MapPinned,
    CalendarDays,
    ArrowRight,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Check,
} from "lucide-react";
import { useJourneyContext } from "../../context/JourneyContext";
import { STATUSES } from "../../data/stages"; // { id, label, sub, emoji } — confirmed against actual stages.js
import "./Onboarding.css";

// Plain data - not components, kept at module scope like any other constant.
const FEATURES = [
    { Icon: Search, label: "University Search" },
    { Icon: GraduationCap, label: "Compare Universities" },
    { Icon: ClipboardCheck, label: "Application Tracking" },
    { Icon: BellRing, label: "Smart Task Manager" },
    { Icon: FileCheck2, label: "CAS & UKVI" },
    { Icon: Calculator, label: "Budget Calculator" },
    { Icon: Luggage, label: "Packing Planner" },
    { Icon: BookOpenCheck, label: "UK Life Guides" },
];

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

const PHASE = {
    SPLASH: "splash",
    WELCOME: "welcome",
    SETUP: "setup",
};

const TOTAL_STEPS = 3;
const SPLASH_DURATION = 1200; // ms - change this in one place to retime the splash

/**
 * Onboarding
 * ------------------------------------------------------------------
 * ONE component, no helper components, no helper functions - every
 * piece of markup (splash, welcome, setup, dropdown, calendar,
 * illustrations) lives directly inside this single return().
 *
 * Mounting: App.js only renders <Onboarding /> when screen === "onboard",
 * which (per useJourney.js) only happens when there is no saved
 * profile.name yet. Returning users are routed straight to <Home />
 * by App.js and never reach this component - so there is no
 * "returning user" branch here, no isReturning check, and no splash
 * for returning users. This component always runs the full first-time
 * flow: Splash -> We'll Help You -> Quick Setup.
 *
 * Integration:
 *   - Reads/writes ONLY the existing JourneyContext via
 *     useJourneyContext(): profile, setProfile, setScreen.
 *   - Stage options come from the existing STATUSES in
 *     data/stages.js - not redefined here.
 *   - On submit: setProfile({ name, statusId, arrival, step: statusId })
 *     then setScreen("home") - exactly as specified, nothing else.
 * ------------------------------------------------------------------
 */
export default function Onboarding() {
    const { setProfile, setScreen } = useJourneyContext();

    const [phase, setPhase] = useState(PHASE.SPLASH);
    const [direction, setDirection] = useState("forward");
    const [form, setForm] = useState({ name: "", statusId: null, arrival: "" });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    // Dropdown / calendar open-state and calendar month view - kept as
    // plain state on this same component since there is no separate
    // dropdown/calendar component to own them.
    const [stageOpen, setStageOpen] = useState(false);
    const [dateOpen, setDateOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date());

    const timers = useRef([]);
    const stageWrapRef = useRef(null);
    const dateWrapRef = useRef(null);

    useEffect(() => {
        const splashTimer = setTimeout(() => {
            setPhase(PHASE.WELCOME);
        }, SPLASH_DURATION);

        timers.current.push(splashTimer);

        return () => {
            timers.current.forEach(clearTimeout);
        };
    }, []);

    // Close whichever popover is open when clicking outside of it.
    useEffect(() => {
        function onOutside(e) {
            if (stageWrapRef.current && !stageWrapRef.current.contains(e.target)) setStageOpen(false);
            if (dateWrapRef.current && !dateWrapRef.current.contains(e.target)) setDateOpen(false);
        }
        document.addEventListener("mousedown", onOutside);
        return () => document.removeEventListener("mousedown", onOutside);
    }, []);

    function validate() {
        const next = {};
        if (!form.name.trim()) next.name = "Please tell us your name.";
        if (form.statusId === null || form.statusId === undefined) next.statusId = "Please pick your current stage.";
        if (!form.arrival) next.arrival = "Please choose a planned arrival date.";
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    function handleStartJourney() {
        if (!validate()) return;
        setSaving(true);
        setProfile({
            name: form.name.trim(),
            statusId: form.statusId,
            arrival: form.arrival,
            step: form.statusId,
        });
        setTimeout(() => {
            setScreen("home");
        }, 500);
    }

    const arrivalDateObj = form.arrival ? new Date(form.arrival + "T00:00:00") : null;

    const arrivalLabel = useMemo(() => {
        if (!arrivalDateObj) return "";
        return arrivalDateObj.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
    }, [form.arrival]); // eslint-disable-line react-hooks/exhaustive-deps

    const stageLabel = form.statusId === null ? "" : (STATUSES.find((s) => s.id === form.statusId)?.label || "");

    // Calendar grid math for the currently viewed month.
    const calYear = viewDate.getFullYear();
    const calMonth = viewDate.getMonth();
    const calFirstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
    const calDaysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const calCells = [];
    for (let i = 0; i < calFirstDayOfWeek; i++) calCells.push(null);
    for (let d = 1; d <= calDaysInMonth; d++) calCells.push(d);

    return (
        <div className="ob-root">
            {/* ============================== SPLASH ============================== */}
            {phase === PHASE.SPLASH && (
                <div className="ob-screen ob-splash ob-fade-in">
                    <div className="ob-splash-glow ob-splash-glow-a" />
                    <div className="ob-splash-glow ob-splash-glow-b" />
                    <div className="ob-splash-particles">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <span key={i} className={`ob-particle ob-particle-${i}`} />
                        ))}
                    </div>

                    <div className="ob-splash-sky">
                        <svg viewBox="0 0 400 220" className="ob-skyline-svg" preserveAspectRatio="xMidYMax slice">
                            <defs>
                                <linearGradient id="obSkyGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#EEF0FF" stopOpacity="0" />
                                    <stop offset="55%" stopColor="#F3E8FF" />
                                    <stop offset="100%" stopColor="#FDEFF3" />
                                </linearGradient>
                            </defs>
                            <rect width="400" height="220" fill="url(#obSkyGrad)" />

                            <g className="ob-cloud ob-cloud-a" opacity="0.9">
                                <ellipse cx="70" cy="40" rx="26" ry="10" fill="#fff" />
                                <ellipse cx="92" cy="36" rx="18" ry="9" fill="#fff" />
                            </g>
                            <g className="ob-cloud ob-cloud-b" opacity="0.85">
                                <ellipse cx="300" cy="60" rx="22" ry="9" fill="#fff" />
                                <ellipse cx="320" cy="56" rx="15" ry="7" fill="#fff" />
                            </g>

                            <g className="ob-plane" transform="translate(40,30)">
                                <path
                                    d="M0 6 L18 6 L26 0 L30 0 L24 6 L34 6 L38 3 L41 3 L38 8 L41 13 L38 13 L34 10 L24 10 L30 16 L26 16 L18 10 L0 10 Z"
                                    fill="#6C63FF"
                                />
                            </g>

                            <g fill="#C9BCEE" opacity="0.55">
                                <rect x="0" y="150" width="30" height="70" />
                                <rect x="35" y="130" width="18" height="90" />
                                <rect x="340" y="140" width="24" height="80" />
                                <rect x="368" y="120" width="16" height="100" />
                            </g>

                            <g transform="translate(120,110)">
                                <rect x="10" y="30" width="18" height="80" fill="#7C6FE0" />
                                <polygon points="4,30 34,30 19,10" fill="#6C63FF" />
                                <rect x="16" y="16" width="6" height="10" fill="#6C63FF" />
                                <circle cx="19" cy="45" r="5" fill="#F4F1FF" />
                            </g>

                            <g transform="translate(220,150)">
                                <circle cx="35" cy="35" r="34" fill="none" stroke="#A79AE6" strokeWidth="4" />
                                <circle cx="35" cy="35" r="3" fill="#A79AE6" />
                                <line x1="35" y1="1" x2="35" y2="69" stroke="#A79AE6" strokeWidth="1.5" />
                                <line x1="1" y1="35" x2="69" y2="35" stroke="#A79AE6" strokeWidth="1.5" />
                                <line x1="11" y1="11" x2="59" y2="59" stroke="#A79AE6" strokeWidth="1.5" />
                                <line x1="59" y1="11" x2="11" y2="59" stroke="#A79AE6" strokeWidth="1.5" />
                                <rect x="30" y="65" width="10" height="14" fill="#A79AE6" />
                            </g>

                            <rect x="0" y="215" width="400" height="5" fill="#8B7BE0" opacity="0.25" />
                        </svg>
                    </div>

                    <div className="ob-splash-content">
                        <div className="ob-logo-badge">
                            <span>GB</span>
                        </div>
                        <h1 className="ob-splash-title">Journey to UK</h1>
                        <p className="ob-splash-tagline">
                            From Dream to Destination,
                            <br />
                            <span className="ob-accent-text">From Destination to Success</span>
                        </p>
                    </div>

                    <div className="ob-splash-footer">
                        <div className="ob-loading-bar">
                            <div className="ob-loading-bar-fill" />
                        </div>
                        <p className="ob-loading-text">Preparing your journey...</p>
                    </div>
                </div>
            )}

            {/* ============================== WELCOME ============================== */}
            {phase === PHASE.WELCOME && (
                <div className={`ob-screen ob-welcome ob-slide-${direction}`}>
                    <div className="ob-welcome-scroll">
                        <div className="ob-progress" role="progressbar" aria-valuenow={2} aria-valuemin={1} aria-valuemax={TOTAL_STEPS}>
                            <span className="ob-dot ob-dot-done" />
                            <span className="ob-dot ob-dot-active" />
                            <span className="ob-dot ob-dot-upcoming" />
                            <span className="ob-progress-label">2 / {TOTAL_STEPS}</span>
                        </div>

                        <h1 className="ob-title">
                            We&apos;ll help you on every step of your UK journey <span className="ob-emoji">🚀</span>
                        </h1>
                        <p className="ob-subtitle">Everything you need, all in one place.</p>

                        <div className="ob-feature-grid">
                            {FEATURES.map(({ Icon, label }) => (
                                <div className="ob-feature-chip" key={label}>
                                    <span className="ob-feature-icon">
                                        <Icon size={17} strokeWidth={2} />
                                    </span>
                                    <span className="ob-feature-label">{label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="ob-illustration-row">
                            <svg viewBox="0 0 340 150" className="ob-cluster-svg">
                                <g transform="translate(0,58)">
                                    <rect x="0" y="12" width="56" height="42" rx="8" fill="#8B7BE6" />
                                    <rect x="17" y="0" width="22" height="17" rx="5" fill="#8B7BE6" />
                                    <rect x="6" y="30" width="44" height="5" fill="#F4F1FF" opacity="0.7" />
                                </g>
                                <g transform="translate(74,64)">
                                    <rect x="0" y="0" width="34" height="46" rx="4" fill="#4F46E5" />
                                    <circle cx="17" cy="18" r="7" fill="#F4F1FF" opacity="0.85" />
                                    <line x1="7" y1="32" x2="27" y2="32" stroke="#F4F1FF" strokeWidth="2" opacity="0.85" />
                                </g>
                                <g transform="translate(128,2)">
                                    <polygon points="52,0 104,20 52,40 0,20" fill="#4F46E5" />
                                    <rect x="46" y="22" width="12" height="32" fill="#4F46E5" />
                                    <circle cx="52" cy="56" r="5.5" fill="#F4B400" />
                                </g>
                                <g transform="translate(258,46)">
                                    <rect x="0" y="0" width="44" height="58" rx="5" fill="#fff" stroke="#B9AEEE" strokeWidth="2.5" />
                                    <line x1="8" y1="14" x2="36" y2="14" stroke="#B9AEEE" strokeWidth="2.5" />
                                    <line x1="8" y1="24" x2="36" y2="24" stroke="#B9AEEE" strokeWidth="2.5" />
                                    <line x1="8" y1="34" x2="26" y2="34" stroke="#B9AEEE" strokeWidth="2.5" />
                                </g>
                                <g transform="translate(155,96)">
                                    <circle cx="19" cy="19" r="19" fill="#fff" stroke="#D6D0F5" strokeWidth="2.5" />
                                    <path d="M5 19 H33 M19 5 V33 M8 8 L30 30 M30 8 L8 30" stroke="#4F46E5" strokeWidth="2.5" />
                                </g>
                            </svg>
                        </div>
                    </div>

                    <div className="ob-cta-area">
                        <button
                            className="ob-primary-btn"
                            onClick={() => {
                                setDirection("forward");
                                setPhase(PHASE.SETUP);
                            }}
                            aria-label="Continue to journey setup"
                        >
                            Build My Journey <ArrowRight size={18} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            )}

            {/* ============================== SETUP ============================== */}
            {phase === PHASE.SETUP && (
                <div className={`ob-screen ob-setup ob-slide-${direction}`}>
                    <div className="ob-setup-scroll">
                        <div className="ob-progress" role="progressbar" aria-valuenow={3} aria-valuemin={1} aria-valuemax={TOTAL_STEPS}>
                            <span className="ob-dot ob-dot-done" />
                            <span className="ob-dot ob-dot-done" />
                            <span className="ob-dot ob-dot-active" />
                            <span className="ob-progress-label">3 / {TOTAL_STEPS}</span>
                        </div>

                        <h1 className="ob-title">
                            Let&apos;s personalise your journey <span className="ob-emoji">🎉</span>
                        </h1>
                        <p className="ob-subtitle">This helps us build your personalized roadmap.</p>

                        <div className="ob-card">
                            {/* ---- name ---- */}
                            <div className="ob-field">
                                <label className="ob-label" htmlFor="ob-name">What&apos;s your name?</label>
                                <div className="ob-input-wrap">
                                    <User size={18} className="ob-input-icon" />
                                    <input
                                        id="ob-name"
                                        type="text"
                                        className="ob-input"
                                        placeholder="e.g. Riaz Hossain"
                                        autoComplete="name"
                                        aria-label="Your name"
                                        value={form.name}
                                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                    />
                                </div>
                                {errors.name && <p className="ob-error">{errors.name}</p>}
                            </div>

                            <div className="ob-divider" />

                            {/* ---- stage (custom dropdown, inline) ---- */}
                            <div className="ob-field">
                                <label className="ob-label" htmlFor="ob-stage">Which stage are you in now?</label>
                                <div className="ob-dropdown" ref={stageWrapRef}>
                                    <button
                                        id="ob-stage"
                                        type="button"
                                        className="ob-input ob-dropdown-trigger"
                                        onClick={() => setStageOpen((o) => !o)}
                                        aria-haspopup="listbox"
                                        aria-expanded={stageOpen}
                                    >
                                        <MapPinned size={18} className="ob-input-icon" />
                                        <span className={`ob-dropdown-value ${!stageLabel ? "ob-dropdown-placeholder" : ""}`}>
                                            {stageLabel || "Select your stage"}
                                        </span>
                                        <ChevronDown size={16} className={`ob-dropdown-chevron ${stageOpen ? "ob-dropdown-chevron-open" : ""}`} />
                                    </button>

                                    {stageOpen && (
                                        <ul className="ob-dropdown-panel" role="listbox">
                                            {STATUSES.map((opt) => (
                                                <li
                                                    key={opt.id}
                                                    role="option"
                                                    aria-selected={opt.id === form.statusId}
                                                    className={`ob-dropdown-option ${opt.id === form.statusId ? "ob-dropdown-option-active" : ""}`}
                                                    onClick={() => {
                                                        setForm((f) => ({ ...f, statusId: opt.id }));
                                                        setStageOpen(false);
                                                    }}
                                                >
                                                    <span>{opt.label}</span>
                                                    {opt.id === form.statusId && <Check size={16} />}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                {errors.statusId && <p className="ob-error">{errors.statusId}</p>}
                            </div>

                            <div className="ob-divider" />

                            {/* ---- arrival date (custom calendar, inline) ---- */}
                            <div className="ob-field ob-field-last">
                                <label className="ob-label" htmlFor="ob-date">When are you planning to go?</label>
                                <div className="ob-dropdown" ref={dateWrapRef}>
                                    <button
                                        id="ob-date"
                                        type="button"
                                        className="ob-input ob-dropdown-trigger"
                                        onClick={() => setDateOpen((o) => !o)}
                                        aria-haspopup="dialog"
                                        aria-expanded={dateOpen}
                                    >
                                        <CalendarDays size={18} className="ob-input-icon" />
                                        <span className={`ob-dropdown-value ${!arrivalDateObj ? "ob-dropdown-placeholder" : ""}`}>
                                            {arrivalDateObj ? arrivalLabel : "Select a date"}
                                        </span>
                                        <ChevronDown size={16} className={`ob-dropdown-chevron ${dateOpen ? "ob-dropdown-chevron-open" : ""}`} />
                                    </button>

                                    {dateOpen && (
                                        <div className="ob-calendar-panel" role="dialog" aria-label="Choose arrival date">
                                            <div className="ob-calendar-header">
                                                <button
                                                    type="button"
                                                    className="ob-calendar-nav"
                                                    onClick={() => setViewDate(new Date(calYear, calMonth - 1, 1))}
                                                    aria-label="Previous month"
                                                >
                                                    <ChevronLeft size={16} />
                                                </button>
                                                <span className="ob-calendar-month">{MONTH_NAMES[calMonth]} {calYear}</span>
                                                <button
                                                    type="button"
                                                    className="ob-calendar-nav"
                                                    onClick={() => setViewDate(new Date(calYear, calMonth + 1, 1))}
                                                    aria-label="Next month"
                                                >
                                                    <ChevronRight size={16} />
                                                </button>
                                            </div>

                                            <div className="ob-calendar-weekdays">
                                                {WEEKDAY_LABELS.map((w, i) => (
                                                    <span key={i}>{w}</span>
                                                ))}
                                            </div>

                                            <div className="ob-calendar-grid">
                                                {calCells.map((day, i) => {
                                                    if (!day) return <span key={i} className="ob-calendar-cell ob-calendar-cell-empty" />;
                                                    const cellDate = new Date(calYear, calMonth, day);
                                                    const isSelected =
                                                        arrivalDateObj &&
                                                        cellDate.getFullYear() === arrivalDateObj.getFullYear() &&
                                                        cellDate.getMonth() === arrivalDateObj.getMonth() &&
                                                        cellDate.getDate() === arrivalDateObj.getDate();
                                                    return (
                                                        <button
                                                            type="button"
                                                            key={i}
                                                            className={`ob-calendar-cell ${isSelected ? "ob-calendar-cell-selected" : ""}`}
                                                            onClick={() => {
                                                                const y = cellDate.getFullYear();
                                                                const m = String(cellDate.getMonth() + 1).padStart(2, "0");
                                                                const d = String(cellDate.getDate()).padStart(2, "0");
                                                                setForm((f) => ({ ...f, arrival: `${y}-${m}-${d}` }));
                                                                setDateOpen(false);
                                                            }}
                                                        >
                                                            {day}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {errors.arrival && <p className="ob-error">{errors.arrival}</p>}
                                {arrivalDateObj && !errors.arrival && <p className="ob-hint">Arriving {arrivalLabel}</p>}
                            </div>
                        </div>

                        <div className="ob-plane-path">
                            <svg viewBox="0 0 300 60" className="ob-plane-path-svg">
                                <path
                                    d="M10 45 C 80 10, 160 60, 260 15"
                                    fill="none"
                                    stroke="#C9BCEE"
                                    strokeWidth="2"
                                    strokeDasharray="4 6"
                                />
                                <g className="ob-plane-path-plane" transform="translate(245,8) rotate(-18)">
                                    <path
                                        d="M0 5 L14 5 L20 0 L23 0 L19 5 L27 5 L30 2 L32 2 L30 6 L32 10 L30 10 L27 7 L19 7 L23 12 L20 12 L14 7 L0 7 Z"
                                        fill="#6C63FF"
                                    />
                                </g>
                            </svg>
                        </div>
                    </div>

                    <div className="ob-cta-area ob-cta-area-split">
                        <button
                            className="ob-secondary-btn"
                            onClick={() => {
                                setDirection("back");
                                setPhase(PHASE.WELCOME);
                            }}
                            aria-label="Go back to previous step"
                        >
                            Back
                        </button>
                        <button
                            className="ob-primary-btn"
                            onClick={handleStartJourney}
                            disabled={saving}
                            aria-label="Save details and start journey"
                        >
                            {saving ? "Saving..." : "Start My Journey"} <ArrowRight size={18} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
