import React, { useState, useMemo, useRef, useEffect } from "react";
import { useJourneyContext } from "../../../context/JourneyContext";
import { STATUSES, STAGES, ALL_STAGE_NAMES } from "../../../data/stages";
// stageDetails.js lives alongside StepDetails.jsx per App.js's import path
// (src/pages/Journey/StepDetails/StepDetails.jsx). If you move either file,
// update this path to match.

import QuickTools from "../../../components/quicktools/QuickTools";
import "./HomeDashboard.css";

// Same color mapping StepDetails.css uses for its .sd-hero--{color} variants,
// adapted for the dark Current Focus card. Not a new design decision — just
// reusing the existing per-stage color language on this card's icon tile.


// Same icon paths StepDetails.jsx already renders for each stage (search,
// graduation, mail, document, passport, suitcase, flag) — duplicated here
// rather than imported, since StepDetails.jsx doesn't export its icon
// component. If you'd rather share one component, export StageIcon from
// StepDetails.jsx (or a shared file) and swap this out for that import.


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
    const { profile, changeStatus, taskDone, toggleTask, setSelectedStage } = useJourneyContext();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentStatus = STATUSES[profile.statusId] ?? STATUSES[0];
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




    // Current Focus card's "Stage Details" button opens the real Stage
    // Details page (same pattern MyJourney.jsx uses when a stage is tapped:
    // set which stage, then switch screens) instead of the old setTab-based
    // Continue/handleStartNow flow.
    function handleOpenStageDetails() {
        if (!currentStage) return;
        setSelectedStage(currentStage.id);
        setScreen("step-details");
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
                        <div className="hd-days-label">Days Left</div>
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
                                <div
                                    className={`hd-timeline-circle ${isDone ? "is-done" : ""} ${isCurrent ? "is-current is-pulsing" : ""
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
                taskDone / toggleTask as before; this is a pure markup/CSS
                trim of THIS card only. No task cards, no checklist
                container, no counters — just icon + title + subtitle, a
                plain 3-line task list, and a small bottom-right "Stage
                Details" button that opens the real Stage Details page
                (handleOpenStageDetails: setSelectedStage + setScreen
                ("step-details")) where the full task list, documents, and
                tips live. handleStartNow/setTab is no longer used by this
                button, but is left untouched below in case anything else
                still calls it. */}
            {currentStage && (
                <div className="hd-card hd-next-action-card hd-focus-compact">
                    <div className="hd-focus-row">
                        <div className="hd-next-action-icon">{currentStatus.emoji}</div>
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
                            onClick={handleOpenStageDetails}
                        >
                            Stage Details <span className="hd-arrow">→</span>
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
