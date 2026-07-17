import React from 'react';
import { useJourneyContext } from '../../context/JourneyContext';
import { STAGES } from '../../data/stages';
import { STAGE_UI_META } from './StepDetails/stageDetails';
import './MyJourney.css';

/* ============================================================
   MyJourney.jsx
   Everything in ONE file: icons, TimelineNode, JourneyCard, page.

   CHANGED (per integration instructions):
   - Stage cards no longer setScreen(meta.screen) to seven different
     screen names. They now do:
       setSelectedStage(stage.id);
       setScreen("step-details");
     StepDetails.jsx reads selectedStage from context to know which
     stage to render.
   - STAGE_UI_META now imported from data/stageDetails.js (shared with
     StepDetails.jsx) instead of being defined locally, so there's one
     source of truth for stage color/icon.
   ============================================================ */

/* ---------- ICONS ---------- */

const iconBase = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
};

function ChevronLeftIcon(props) {
    return (
        <svg {...iconBase} width={22} height={22} {...props}>
            <path d="M15 18l-6-6 6-6" />
        </svg>
    );
}

function ChevronRightIcon(props) {
    return (
        <svg {...iconBase} width={16} height={16} {...props}>
            <path d="M9 18l6-6-6-6" />
        </svg>
    );
}

function InfoIcon(props) {
    return (
        <svg {...iconBase} width={20} height={20} {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5" />
            <circle cx="12" cy="8" r="0.5" fill="currentColor" />
        </svg>
    );
}

function CheckIcon(props) {
    return (
        <svg {...iconBase} width={16} height={16} stroke="#fff" {...props}>
            <path d="M20 6L9 17l-5-5" />
        </svg>
    );
}

function StageIcon({ name, ...rest }) {
    const props = { ...iconBase, ...rest };
    switch (name) {
        case 'search':
            return (
                <svg {...props}>
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.3-4.3" />
                </svg>
            );
        case 'graduation':
            return (
                <svg {...props}>
                    <path d="M12 3l10 5-10 5L2 8z" />
                    <path d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" />
                </svg>
            );
        case 'mail':
            return (
                <svg {...props}>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                </svg>
            );
        case 'document':
            return (
                <svg {...props}>
                    <path d="M8 3h6l4 4v12a2 2 0 01-2 2H8a2 2 0 01-2-2V5a2 2 0 012-2z" />
                    <path d="M14 3v4h4" />
                    <path d="M9 13h6M9 17h6" />
                </svg>
            );
        case 'passport':
            return (
                <svg {...props}>
                    <rect x="5" y="3" width="14" height="18" rx="2" />
                    <circle cx="12" cy="10" r="2.5" />
                    <path d="M9 16h6" />
                </svg>
            );
        case 'suitcase':
            return (
                <svg {...props}>
                    <rect x="3" y="8" width="18" height="12" rx="2" />
                    <path d="M9 8V6a3 3 0 016 0v2" />
                    <path d="M3 13h18" />
                </svg>
            );
        case 'flag':
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

/* ---------- TIMELINE NODE (left rail) ----------
   ALIGNMENT FIX v2: the connector is split into an "upper" half
   (row-top boundary -> node center) and a "lower" half (node center
   -> row-bottom boundary). The first row skips its upper half
   (nothing above it to connect to) and the last row skips its lower
   half (nothing below it to connect to) — this is what stops the
   line from poking out above the first circle or stopping short of
   the last one. Each half is colored independently so the gradient
   still correctly reflects "completed" state segment by segment.
   ------------------------------------------------------------ */

function TimelineNode({ color, icon, status, isFirst, isLast, prevCompleted }) {
    const isCompleted = status === 'completed';
    const isCurrent = status === 'current';

    return (
        <div className="timeline-node-col">
            {!isFirst && (
                <div
                    className={`timeline-connector timeline-connector--upper${prevCompleted ? ' timeline-connector--filled' : ''}`}
                    aria-hidden="true"
                />
            )}

            <div
                className={`timeline-node timeline-node--${color} timeline-node--${status}`}
                aria-hidden="true"
            >
                {isCurrent && <span className="timeline-node-pulse" />}
                <span className="timeline-node-icon">
                    {isCompleted ? <CheckIcon /> : <StageIcon name={icon} />}
                </span>
            </div>

            {!isLast && (
                <div
                    className={`timeline-connector timeline-connector--lower${isCompleted ? ' timeline-connector--filled' : ''}`}
                    aria-hidden="true"
                />
            )}
        </div>
    );
}

/* ---------- JOURNEY CARD (right side) ---------- */

const STATUS_LABEL = {
    completed: 'Completed',
    current: 'Current',
    waiting: 'Waiting',
    upcoming: 'Upcoming',
};

function JourneyCard({ title, description, status, progressText, color, onClick }) {
    return (
        <button type="button" className={`journey-card journey-card--${status}`} onClick={onClick}>
            <div className="journey-card-top">
                <h3 className="journey-card-title">{title}</h3>
                <span className={`journey-badge journey-badge--${status} journey-badge--${color}`}>
                    {STATUS_LABEL[status]}
                </span>
            </div>

            <p className="journey-card-desc">{description}</p>

            {status === 'current' && progressText && (
                <p className="journey-card-meta journey-card-meta--current">{progressText}</p>
            )}

            <ChevronRightIcon className="journey-card-chevron" />
        </button>
    );
}

/* ---------- MAIN PAGE ---------- */

function getStageStatus(stageId, currentStatusId) {
    if (stageId < currentStatusId) return 'completed';
    if (stageId === currentStatusId) return 'current';
    if (stageId === currentStatusId + 1) return 'waiting';
    return 'upcoming';
}

function MyJourney() {
    const { profile, taskDone, setScreen, setSelectedStage } = useJourneyContext();
    const currentStatusId = profile.statusId;

    function handleOpenStage(stageId) {
        setSelectedStage(stageId);
        setScreen('step-details');
    }

    return (
        <div className="journey-page">
            <header className="journey-header">
                <button
                    type="button"
                    className="journey-back-btn"
                    onClick={() => setScreen('home')}
                    aria-label="Go back"
                >
                    <ChevronLeftIcon />
                </button>

                <div className="journey-header-titles">
                    <h1 className="journey-header-title">My Journey</h1>
                    <p className="journey-header-subtitle">Track every milestone of your UK journey</p>
                </div>

                <button type="button" className="journey-info-btn" aria-label="Journey info">
                    <InfoIcon />
                </button>
            </header>

            <div className="journey-timeline">
                {STAGES.map((stage, index) => {
                    const meta = STAGE_UI_META[stage.id];
                    if (!meta) return null;

                    const status = getStageStatus(stage.id, currentStatusId);
                    const isLast = index === STAGES.length - 1;
                    const isFirst = index === 0;
                    const prevCompleted =
                        index > 0 &&
                        getStageStatus(STAGES[index - 1].id, currentStatusId) === 'completed';

                    let progressText = null;
                    if (status === 'current') {
                        const total = stage.tasks.length;
                        const done = stage.tasks.filter((t) => taskDone[t.id]).length;
                        progressText = `${done} of ${total} tasks completed`;
                    }

                    return (
                        <div className="journey-row" key={stage.id}>
                            <TimelineNode
                                color={meta.color}
                                icon={meta.icon}
                                status={status}
                                isFirst={isFirst}
                                isLast={isLast}
                                prevCompleted={prevCompleted}
                            />
                            <JourneyCard
                                title={stage.name}
                                description={stage.nextAction}
                                status={status}
                                progressText={progressText}
                                color={meta.color}
                                onClick={() => handleOpenStage(stage.id)}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MyJourney;
