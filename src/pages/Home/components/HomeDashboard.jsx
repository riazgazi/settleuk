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

/**
 * HomeDashboard
 *
 * Props (integration points — wire these to your existing App-level state,
 * since this app has no router and navigates via setTab / setScreen / modals):
 *
 * @param {(tabKey: string) => void} setTab - existing internal tab navigator
 * @param {(screenKey: string) => void} setScreen - existing screen-state navigator
 *        (used for the My Journey timeline page and stage detail screens)
 * @param {(currentStatusId: number, targetStatusId: number) => void} onSkipAheadDetected
 *        - existing "You're skipping ahead" confirmation flow. HomeDashboard
 *          does NOT implement or duplicate that modal — it only detects the
 *          skip and calls this callback. The existing flow is responsible for
 *          calling changeStatus(targetStatusId) itself if the user picks
 *          "Skip anyway", or doing nothing if "Go back" is chosen.
 */
export default function HomeDashboard({ setTab, setScreen, onSkipAheadDetected }) {
    const { profile, changeStatus } = useJourneyContext();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentStatus = STATUSES[profile.statusId];
    const currentStage = useMemo(
        () => STAGES.find((s) => s.id === profile.statusId),
        [profile.statusId]
    );

    const daysLeft = getDaysLeft(profile.arrival);
    const progressPct = Math.round((profile.statusId / (STATUSES.length - 1)) * 100);

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

    return (
        <div className="home-dashboard">
            {/* HEADER */}
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

            {/* YOUR JOURNEY CARD */}
            <div className="hd-card hd-journey-card">
                <div className="hd-card-header">
                    <div className="hd-card-title">Your Journey</div>
                    <button type="button" className="hd-link-btn" onClick={handleViewJourney}>
                        View journey <span className="hd-arrow">›</span>
                    </button>
                </div>

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

            {/* NEXT ACTION CARD */}
            {currentStage && (
                <div className="hd-card hd-next-action-card">
                    <div className="hd-card-header">
                        <div className="hd-card-title">Next Action</div>
                        <div className={`hd-urgency-pill hd-urgency-${currentStage.deadlineUrgency}`}>
                            {urgencyLabel(currentStage.deadlineUrgency)}
                        </div>
                    </div>

                    <div className="hd-next-action-body">
                        <div className="hd-next-action-icon">{currentStatus.emoji}</div>
                        <div>
                            <div className="hd-next-action-title">{currentStage.nextAction}</div>
                            <div className="hd-next-action-desc">{currentStage.deadline}</div>
                        </div>
                    </div>

                    <button type="button" className="hd-start-now-btn" onClick={handleStartNow}>
                        Start Now <span className="hd-arrow">→</span>
                    </button>
                </div>
            )}

            {/* QUICK TOOLS — single shared implementation, also used by the
                Bottom Navigation "Tools" tab. See components/quicktools/QuickTools.jsx */}
            <QuickTools setTab={setTab} variant="home" />

            {/* Bottom Navigation is intentionally NOT rendered here — it already
          exists elsewhere in the app and must not be duplicated/redesigned. */}
        </div>
    );
}
