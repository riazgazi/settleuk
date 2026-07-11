// stageDetails.js
//
// This file holds ONLY presentation/navigation metadata per stage —
// which screen a stage opens, its accent color, and its icon name.
// It does NOT duplicate anything from data/stages.js (name, tasks,
// nextAction, deadline, insights all stay there and are read directly).
//
// Both MyJourney.jsx and StepDetails.jsx should import STAGE_UI_META
// from here instead of each defining their own copy, so there's a
// single source of truth for "stage id -> screen/color/icon".

export const STAGE_UI_META = {
    0: { color: "green", icon: "search", screen: "research" },
    1: { color: "blue", icon: "graduation", screen: "university" },
    2: { color: "orange", icon: "mail", screen: "offer" },
    3: { color: "purple", icon: "document", screen: "cas" },
    4: { color: "indigo", icon: "passport", screen: "visa" },
    5: { color: "violet", icon: "suitcase", screen: "predeparture" },
    6: { color: "darkblue", icon: "flag", screen: "arrival" },
};

// Convenience lookup: screen key -> stage id, built from the map above
// so the two can never drift out of sync.
export const SCREEN_TO_STAGE_ID = Object.entries(STAGE_UI_META).reduce(
    (acc, [id, meta]) => {
        acc[meta.screen] = Number(id);
        return acc;
    },
    {}
);
