import React, { useState, useMemo, useRef, useEffect } from "react";
import { useJourneyContext } from "../../../context/JourneyContext";
import { STATUSES, STAGES, ALL_STAGE_NAMES } from "../../../data/stages";
import QuickTools from "../../../components/quicktools/QuickTools";
import "./HomeDashboard.css";

function getDaysLeft(arrival) {
    if (!arrival) return null;
    const arrivalDate = new Date(arrival);
    if (isNaN(arrivalDate.getTime())) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    arrivalDate.setHours(0, 0, 0, 0);
    const diffMs = arrivalDate.getTime() - today.getTime();
    // Clamp to 0 so a passed arrival date never shows a negative "days left".
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

/**
 * HomeDashboard
 *
 * UI-redesign pass only — no architecture, routing, state management, or
 * business-logic changes. All handlers below (handleViewJourney,
 * handleSelectStage, handleStartNow) are unchanged from the previous
 * version; only labels/placement changed where noted.
 *
 * Props (unchanged):
 * @param {(tabKey: string) => void} setTab - existing internal tab navigator
 * @param {(screenKey: string) => void} setScreen - existing screen-state navigator
 * @param {(currentStatusId: number, targetStatusId: number) => void} onSkipAheadDetected
 *        - existing "You're skipping ahead" confirmation flow (untouched).
 */
export default function HomeDashboard({ setTab, setScreen, onSkipAheadDetected }) {
    const { profile, changeStatus, taskDone, toggleTask } = useJourneyContext();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentStatus = STATUSES[profile.statusId];
    const currentStage = useMemo(
        () => STAGES.find((s) => s.id === profile.statusId),
        [profile.statusId]
    );

    const daysLeft = getDaysLeft(profile.arrival);
    const progressPct = Math.round((profile.statusId / (STATUSES.length - 1)) * 100);

    // Current Focus card shows a short checklist (priority tasks first,
    // capped at 3) pulled straight from the existing stage.tasks data and
    // the existing taskDone/toggleTask state — same source StepDetails.jsx
    // and HomeTasks.jsx already use. The full task list still lives on the
    // stage detail screen; this is just a compact preview.
    const focusTasks = useMemo(() => {
        if (!currentStage) return [];
        const sorted = [...currentStage.tasks].sort((a, b) => {
            if (!!a.priority === !!b.priority) return 0;
            return a.priority ? -1 : 1;
        });
        return sorted.slice(0, 3);
    }, [currentStage]);

    // Close the status dropdown when the user clicks/taps outside of it.
    useEffect(() => {
        if (!dropdownOpen) return;

        function handleOutsideClick(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("touchstart", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("touchstart", handleOutsideClick);
        };
    }, [dropdownOpen]);

    function handleViewJourney() {
        if (setScreen) {
            setScreen("journey");
        }
    }

    function handleSelectStage(newId) {
        setDropdownOpen(false);
        if (newId === profile.statusId) return;

        const isSkipAhead = newId > profile.statusId + 1;

        if (isSkipAhead) {
            if (typeof onSkipAheadDetected === "function") {
                onSkipAheadDetected(profile.statusId, newId);
            }
            // No integration point wired yet — silently do nothing rather than
            // apply a non-sequential stage change without confirmation.
            return;
        }

        // Next sequential stage, or moving back to an earlier stage — apply directly.
        changeStatus(newId);
    }

    function handleStartNow() {
        if (!currentStage?.destination) return;

        // University Explorer is now a standard tab-based feature screen
        // (was a modal via setShowUniFinder before layout standardization).
        if (currentStage.destination === "academic_profile") {
            setTab("university-explorer");
            return;
        }

        setTab(currentStage.destination);
    }

    // "Show All" reuses the same destination as the Bottom Navigation
    // "Tools" tab (per the existing QuickTools variant="tools" usage) —
    // not a new destination.
    function handleShowAllTools() {
        setTab("tools");
    }

    return (
        <div className="home-dashboard">
            {/* HEADER — unchanged */}
            <div className="hd-header">
                <div className="hd-header-left">
                    <div className="hd-logo">GB</div>
                    <div>
                        <div className="hd-app-title">Journey to UK</div>
                        <div className="hd-greeting">Hello, {profile.name} 👋</div>
                    </div>
                </div>

                <div className="hd-header-right" ref={dropdownRef}>
                    <button
                        type="button"
                        className="hd-status-pill"
                        onClick={() => setDropdownOpen((open) => !open)}
                    >
                        <span>{currentStatus.emoji}</span>
                        <span>{currentStatus.label}</span>
                        <span className={`hd-chevron ${dropdownOpen ? "hd-chevron-open" : ""}`}>▾</span>
                    </button>
                    <div className="hd-tap-to-change">tap to change</div>

                    {dropdownOpen && (
                        <div className="hd-dropdown">
                            {STATUSES.map((status) => (
                                <button
                                    key={status.id}
                                    type="button"
                                    className={`hd-dropdown-item ${status.id === profile.statusId ? "hd-dropdown-item-active" : ""
                                        }`}
                                    onClick={() => handleSelectStage(status.id)}
                                >
                                    <span>{status.emoji}</span>
                                    <span>{status.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* YOUR JOURNEY CARD — compacted: just days-left + progress now.
                The timeline moved into its own "Your Journey Roadmap" card
                below, and "View journey" moved there too as "View All" so
                the link isn't duplicated across two cards. */}
            <div className="hd-card hd-journey-card">
                <div className="hd-journey-stats">
                    <div className="hd-days-left">
                        <div className="hd-days-number">{daysLeft !== null ? daysLeft : "—"}</div>
                        <div className="hd-days-label">
                            <span className="hd-days-label-icon">📅</span>Days Left
                        </div>
                    </div>
                    <div className="hd-divider" />
                    <div className="hd-progress-block">
                        <div className="hd-progress-label">
                            <span className="hd-progress-pct">{progressPct}%</span> Complete
                        </div>
                        <div className="hd-progress-track">
                            <div className="hd-progress-fill" style={{ width: `${progressPct}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* YOUR JOURNEY ROADMAP CARD — new section, same timeline data/
                logic (ALL_STAGE_NAMES + profile.statusId) that used to live
                inside the journey card above. "View All" calls the same
                handleViewJourney handler the old "View journey" link used. */}
            <div className="hd-card hd-roadmap-card">
                <div className="hd-card-header">
                    <div className="hd-card-title">Your Journey Roadmap</div>
                    <button type="button" className="hd-link-btn" onClick={handleViewJourney}>
                        View All <span className="hd-arrow">›</span>
                    </button>
                </div>

                <div className="hd-timeline">
                    <div className="hd-timeline-track">
                        <div className="hd-timeline-track-fill" style={{ width: `${progressPct}%` }} />
                    </div>
                    {ALL_STAGE_NAMES.map((label, idx) => {
                        const isDone = idx < profile.statusId;
                        const isCurrent = idx === profile.statusId;
                        return (
                            <div key={label} className="hd-timeline-step">
                                {isCurrent && <div className="hd-timeline-current-tag">Current</div>}
                                <div
                                    className={`hd-timeline-circle ${isDone ? "is-done" : ""} ${isCurrent ? "is-current" : ""
                                        }`}
                                >
                                    {isDone ? "✓" : idx + 1}
                                </div>
                                <div
                                    className={`hd-timeline-label ${isDone || isCurrent ? "hd-timeline-label-active" : ""
                                        }`}
                                >
                                    {label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CURRENT FOCUS CARD — compact preview only. Same currentStage /
                taskDone / toggleTask / handleStartNow as before; this is a
                pure markup/CSS trim of THIS card only. No task cards, no
                checklist container, no counters — just icon + title + step
                badge + subtitle, a plain 3-line task list, and a small
                right-aligned Continue button. Clicking Continue still opens
                the existing Step Details screen (handleStartNow, unchanged)
                where the full task list, documents, and tips live. */}
            {currentStage && (
                <div className="hd-card hd-next-action-card hd-focus-compact">
                    <div className="hd-focus-row">
                        <div className="hd-next-action-icon">
                            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 2.5h8.5L20 8v13a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 6 21V4a1.5 1.5 0 0 1 1.5-1.5z" fill="url(#hdFocusIconGrad)" />
                                <path d="M14.5 2.5V7a1 1 0 0 0 1 1H20" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.2" strokeLinejoin="round" />
                                <path d="M9 13.5l2 2 4-4.2" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                <defs>
                                    <linearGradient id="hdFocusIconGrad" x1="6" y1="2.5" x2="20" y2="22.5" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#8b7bff" />
                                        <stop offset="1" stopColor="#4a3fd8" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className="hd-focus-info">
                            <div className="hd-focus-title-row">
                                <span className="hd-focus-title">{currentStage.name}</span>
                            </div>
                            <div className="hd-focus-subtitle">{currentStage.deadline}</div>
                        </div>
                    </div>

                    {focusTasks.length > 0 && (
                        <div className="hd-focus-tasklist">
                            {focusTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="hd-focus-task-line"
                                    onClick={() => toggleTask(task.id)}
                                >
                                    <span className="hd-focus-task-icon">
                                        {taskDone[task.id] ? "✓" : "○"}
                                    </span>
                                    <span
                                        className={`hd-focus-task-text ${taskDone[task.id] ? "is-done" : ""
                                            }`}
                                    >
                                        {task.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="hd-focus-continue-row">
                        <button
                            type="button"
                            className="hd-continue-btn"
                            onClick={handleStartNow}
                        >
                            Continue <span className="hd-arrow">→</span>
                        </button>
                    </div>
                </div>
            )}

            {/* QUICK TOOLS — same shared QuickTools component. Heading now
                lives here (with "Show All") instead of inside QuickTools,
                using a new "home-scroll" variant so the "home" and "tools"
                variants used elsewhere stay exactly as they were. */}
            <div className="hd-quick-tools-header">
                <div className="hd-card-title">Quick Tools</div>
                <button type="button" className="hd-link-btn" onClick={handleShowAllTools}>
                    Show All <span className="hd-arrow">›</span>
                </button>
            </div>

            <QuickTools setTab={setTab} variant="home-scroll" />

            {/* Bottom Navigation is intentionally NOT rendered here — it already
          exists elsewhere in the app and must not be duplicated/redesigned. */}
        </div>
    );
}
