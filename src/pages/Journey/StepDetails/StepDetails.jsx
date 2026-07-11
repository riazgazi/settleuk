import React, { useState, useEffect, useRef } from "react";
import { useJourneyContext } from "../../../context/JourneyContext";
import { STAGES } from "../../../data/stages";
import { STAGE_UI_META } from "./stageDetails";
import "./StepDetails.css";

/* ============================================================
   StepDetails.jsx
   ONE reusable page for all 7 stages. Which stage renders is read
   from JourneyContext's `selectedStage` — not a prop, not a route.

   Simplified layout (per latest wireframe):
   Header -> Hero card (icon, description, progress bar) -> Tabs
   (Tasks, Documents, Tips, Mistakes, Overview — Tasks is default,
   Overview last) -> Next Stage / Finish Journey button.
   No separate Progress Insight Card, no Resources tab, no Continue
   Tasks / Previous buttons — removed on request.

   Reuses only what already exists:
   - useJourneyContext(): profile, taskDone, toggleTask, screen, setScreen,
     selectedStage, setSelectedStage
   - STAGES from data/stages.js (AUTO_ADVANCE is handled inside
     useJourney.js's toggleTask() already — StepDetails doesn't need it)
   - STAGE_UI_META from data/stageDetails.js (screen/color/icon mapping)

   Documents tab is intentionally left as a placeholder — see the comment
   in that tab below. Wire your real Documents component into that spot.

   Flow:
   - MyJourney sets selectedStage + setScreen("step-details") on tap.
   - App.js has a single case: case "step-details": return <StepDetails />;
   - Next Stage moves within the same screen via setSelectedStage(...) —
     it does NOT change `screen`.
   - Back button returns to the timeline: setScreen("journey").
   ============================================================ */

const TABS = [
    { key: "tasks", label: "Tasks" },
    { key: "documents", label: "Documents" },
    { key: "tips", label: "Tips" },
    { key: "mistakes", label: "Mistakes" },
    { key: "overview", label: "Overview" },
];

function urgencyLabel(deadlineUrgency) {
    switch (deadlineUrgency) {
        case "critical":
            return "Urgent";
        case "high":
            return "This Week";
        case "medium":
            return "This Month";
        default:
            return "Upcoming";
    }
}

const iconBase = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
};

function ChevronLeftIcon(props) {
    return (
        <svg {...iconBase} width={22} height={22} {...props}>
            <path d="M15 18l-6-6 6-6" />
        </svg>
    );
}

function StageIcon({ name, ...rest }) {
    const props = { ...iconBase, ...rest };
    switch (name) {
        case "search":
            return (
                <svg {...props}>
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.3-4.3" />
                </svg>
            );
        case "graduation":
            return (
                <svg {...props}>
                    <path d="M12 3l10 5-10 5L2 8z" />
                    <path d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" />
                </svg>
            );
        case "mail":
            return (
                <svg {...props}>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                </svg>
            );
        case "document":
            return (
                <svg {...props}>
                    <path d="M8 3h6l4 4v12a2 2 0 01-2 2H8a2 2 0 01-2-2V5a2 2 0 012-2z" />
                    <path d="M14 3v4h4" />
                    <path d="M9 13h6M9 17h6" />
                </svg>
            );
        case "passport":
            return (
                <svg {...props}>
                    <rect x="5" y="3" width="14" height="18" rx="2" />
                    <circle cx="12" cy="10" r="2.5" />
                    <path d="M9 16h6" />
                </svg>
            );
        case "suitcase":
            return (
                <svg {...props}>
                    <rect x="3" y="8" width="18" height="12" rx="2" />
                    <path d="M9 8V6a3 3 0 016 0v2" />
                    <path d="M3 13h18" />
                </svg>
            );
        case "flag":
            return (
                <svg {...props}>
                    <path d="M5 3v18" />
                    <path d="M5 4h13l-3 4 3 4H5" />
                </svg>
            );
        default:
            return (
                <svg {...props}>
                    <circle cx="12" cy="12" r="9" />
                </svg>
            );
    }
}

/**
 * Renders the stage found in JourneyContext's `selectedStage` (falling back
 * to the user's current in-progress stage if none is selected).
 *
 * No props needed. toggleTask() from useJourney.js already handles
 * AUTO_ADVANCE internally (it sets advancePrompt, which your existing
 * AdvanceModal reads) — so StepDetails just calls toggleTask() and lets
 * your existing flow take it from there.
 */
function StepDetails() {
    const { profile, taskDone, toggleTask, setScreen, selectedStage, setSelectedStage } =
        useJourneyContext();

    const stage =
        STAGES.find((s) => s.id === selectedStage) || STAGES[profile.statusId];
    const meta = stage ? STAGE_UI_META[stage.id] : null;

    const [activeTab, setActiveTab] = useState("tasks");
    const [showCelebration, setShowCelebration] = useState(false);
    const wasFullyDoneRef = useRef(false);

    // Computed with safe fallbacks (stage may briefly be undefined on the
    // very first render) so every hook below always runs — hooks must never
    // be skipped based on a condition, so the early "no stage" return has to
    // come AFTER every useState/useRef/useEffect call, not before.
    const tasks = stage ? stage.tasks : [];
    const totalCount = tasks.length;
    const doneCount = tasks.filter((t) => taskDone[t.id]).length;
    const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

    const requiredTasks = tasks.filter((t) => t.priority);
    const requiredDoneCount = requiredTasks.filter((t) => taskDone[t.id]).length;
    const allRequiredDone = requiredTasks.length > 0 && requiredDoneCount === requiredTasks.length;

    const nextStage = stage ? STAGES.find((s) => s.id === stage.id + 1) : undefined;
    const isFinalStage = !nextStage;

    // Fire the celebration once when all required tasks flip to done —
    // guarded by a ref so it doesn't re-fire on every re-render.
    useEffect(() => {
        if (!stage) return;
        if (allRequiredDone && !wasFullyDoneRef.current) {
            wasFullyDoneRef.current = true;
            setShowCelebration(true);
        }
        if (!allRequiredDone) {
            wasFullyDoneRef.current = false;
        }
    }, [allRequiredDone, stage]);

    if (!stage || !meta) {
        // Only reachable if STAGES itself is empty/misconfigured.
        return (
            <div className="sd-page">
                <p>No stage selected.</p>
                <button type="button" className="sd-btn sd-btn--primary" onClick={() => setScreen("journey")}>
                    Back to My Journey
                </button>
            </div>
        );
    }

    const isCurrentStage = profile.statusId === stage.id;

    function handleToggleTask(taskId) {
        toggleTask(taskId);
    }

    function handleBackToJourney() {
        setScreen("journey");
    }

    function handleGoNextStage() {
        if (isFinalStage) {
            // "Finish Journey" — hook up Life in UK Mode here later.
            setScreen("home");
            return;
        }
        if (nextStage && allRequiredDone) {
            setSelectedStage(nextStage.id);
            setActiveTab("tasks");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    const tips = (stage.insights || []).filter((i) => i.type === "tip" || i.type === "info");
    const mistakes = (stage.insights || []).filter((i) => i.type === "warn");

    return (
        <div className="sd-page">
            <header className="sd-header">
                <button
                    type="button"
                    className="sd-back-btn"
                    onClick={handleBackToJourney}
                    aria-label="Back to My Journey"
                >
                    <ChevronLeftIcon />
                </button>
                <h1 className="sd-title">{stage.name}</h1>
                {isCurrentStage && <span className="sd-current-badge">Current Step</span>}
            </header>

            {/* HERO / PROGRESS CARD */}
            <div className={`sd-hero sd-hero--${meta.color}`}>
                <div className="sd-hero-icon">
                    <StageIcon name={meta.icon} />
                </div>
                <p className="sd-hero-desc">{stage.emotion}</p>
                <div className="sd-hero-progress-track">
                    <div className="sd-hero-progress-fill" style={{ width: `${progressPct}%` }} />
                </div>
                <div className="sd-hero-progress-label">
                    <span>{progressPct}% Progress</span>
                    <span>
                        {doneCount}/{totalCount} Completed
                    </span>
                </div>
            </div>

            {/* TAB NAV */}
            <div className="sd-tabs">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        className={`sd-tab-btn ${activeTab === tab.key ? "sd-tab-btn--active" : ""}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* TAB CONTENT — key={activeTab} re-mounts the panel so the
          fade/slide CSS animation replays on every tab switch */}
            <div className="sd-tab-panel" key={activeTab}>
                {activeTab === "tasks" && (
                    <div className="sd-section">
                        {tasks.map((t) => (
                            <div className="sd-task-row" key={t.id}>
                                <input
                                    type="checkbox"
                                    className="sd-task-checkbox"
                                    checked={!!taskDone[t.id]}
                                    onChange={() => handleToggleTask(t.id)}
                                    id={`task-${t.id}`}
                                />
                                <label htmlFor={`task-${t.id}`} className="sd-task-label">
                                    <div className="sd-task-top">
                                        <span className="sd-task-text">{t.text}</span>
                                        <div className="sd-task-badges">
                                            {t.priority && <span className="sd-badge sd-badge--priority">High priority</span>}
                                            {t.autoAdvance && <span className="sd-badge sd-badge--auto">Auto advance</span>}
                                        </div>
                                    </div>
                                    {t.desc && <p className="sd-task-desc">{t.desc}</p>}
                                    {t.link && (
                                        <a href={t.link} target="_blank" rel="noreferrer" className="sd-task-link">
                                            Learn more →
                                        </a>
                                    )}
                                </label>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "documents" && (
                    <div className="sd-section">
                        {/*
              INTEGRATION POINT — not built yet on purpose.
              This app already has a Documents feature
              (features/documents/Documents.jsx) rendered elsewhere as a
              full tab. Rather than guess its props and risk a second,
              conflicting document-tracking system, this panel is left as
              a placeholder. Share Documents.jsx's props/interface and
              this gets wired to show only this stage's required documents.
            */}
                        <p className="sd-section-text sd-placeholder-text">
                            Document tracking for this stage will use your existing Documents
                            feature — not built here yet, pending its component interface.
                        </p>
                    </div>
                )}

                {activeTab === "tips" && (
                    <div className="sd-section">
                        {tips.length === 0 && <p className="sd-section-text">No tips for this stage yet.</p>}
                        {tips.map((tip, i) => (
                            <div className="sd-insight-block sd-insight-block--tip" key={i}>
                                <p className="sd-insight-block-title">{tip.title}</p>
                                <p className="sd-insight-block-sub">{tip.sub}</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "mistakes" && (
                    <div className="sd-section">
                        {mistakes.length === 0 && (
                            <p className="sd-section-text">No common mistakes flagged for this stage.</p>
                        )}
                        {mistakes.map((m, i) => (
                            <div className="sd-insight-block sd-insight-block--warn" key={i}>
                                <p className="sd-insight-block-title">{m.title}</p>
                                <p className="sd-insight-block-sub">{m.sub}</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "overview" && (
                    <div className="sd-section">
                        <h3 className="sd-section-title">About this stage</h3>
                        <p className="sd-section-text">{stage.emotion}</p>

                        <h4 className="sd-subheading">Objectives</h4>
                        <ul className="sd-list">
                            {requiredTasks.map((t) => (
                                <li key={t.id}>{t.text}</li>
                            ))}
                        </ul>

                        <h4 className="sd-subheading">Timeline</h4>
                        <p className="sd-section-text">
                            {stage.deadline} · <span className="sd-urgency-inline">{urgencyLabel(stage.deadlineUrgency)}</span>
                        </p>

                        <h4 className="sd-subheading">Current status</h4>
                        <p className="sd-section-text">
                            {isCurrentStage
                                ? `In progress — ${doneCount} of ${totalCount} tasks done.`
                                : stage.id < profile.statusId
                                    ? "Completed."
                                    : "Not started yet."}
                        </p>
                    </div>
                )}
            </div>

            {/* BOTTOM ACTION / NEXT STAGE NAVIGATION */}
            <div className="sd-bottom-actions">
                {isFinalStage ? (
                    <button type="button" className="sd-btn sd-btn--primary" onClick={handleGoNextStage}>
                        Finish Journey
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            className="sd-btn sd-btn--primary"
                            onClick={handleGoNextStage}
                            disabled={!allRequiredDone}
                        >
                            Next Stage →
                        </button>
                        {!allRequiredDone && (
                            <p className="sd-lock-hint">Complete required tasks to unlock the next stage.</p>
                        )}
                    </>
                )}
            </div>

            {/* STAGE COMPLETION CELEBRATION */}
            {showCelebration && (
                <div className="sd-celebration-overlay">
                    <div className="sd-celebration-card">
                        <p className="sd-celebration-emoji">🎉</p>
                        <p className="sd-celebration-title">{stage.name} Completed!</p>
                        <p className="sd-celebration-sub">
                            Great job! You're ready for the{" "}
                            {nextStage ? nextStage.name : "next chapter of your journey"}.
                        </p>
                        <div className="sd-celebration-actions">
                            {!isFinalStage && (
                                <button
                                    type="button"
                                    className="sd-btn sd-btn--primary"
                                    onClick={() => {
                                        setShowCelebration(false);
                                        handleGoNextStage();
                                    }}
                                >
                                    Go to Next Stage
                                </button>
                            )}
                            <button
                                type="button"
                                className="sd-btn sd-btn--secondary"
                                onClick={() => {
                                    setShowCelebration(false);
                                    handleBackToJourney();
                                }}
                            >
                                Back to My Journey
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StepDetails;
