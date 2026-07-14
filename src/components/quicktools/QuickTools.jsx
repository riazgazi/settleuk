import React from "react";
import "./QuickTools.css";

/*
 * Extracted from HomeDashboard.jsx so there's exactly ONE Quick Tools
 * implementation. Home Dashboard and the Bottom Navigation "Tools" tab
 * both render this same component — neither owns its own copy.
 *
 * All four tools now navigate the same way: setTab(...). University
 * Explorer used to be a special case (setShowUniFinder modal trigger);
 * now that it's a standard tab-based feature screen, it's just another
 * setTab(...) call like Budget Calculator / CAS & UKVI / Documents.
 */
const QUICK_TOOLS = [
    {
        key: "university-explorer",
        icon: "🏛️",
        iconClass: "qt-tool-icon-blue",
        title: "University Explorer",
        sub: "Find & shortlist the best",
        action: ({ setTab }) => setTab("university-explorer"),
    },
    {
        key: "costs",
        icon: "🧮",
        iconClass: "qt-tool-icon-teal",
        title: "Budget Calculator",
        sub: "Plan your total expenses",
        action: ({ setTab }) => setTab("costs"),
    },
    {
        key: "prep",
        icon: "📄",
        iconClass: "qt-tool-icon-purple",
        title: "CAS & UKVI Preparation",
        sub: "Guides, checklist & documents",
        action: ({ setTab }) => setTab("prep"),
    },
    {
        key: "docs",
        icon: "🧳",
        iconClass: "qt-tool-icon-orange",
        title: "Documents",
        sub: "Prepare for your journey",
        action: ({ setTab }) => setTab("docs"),
    },
    {
        key: "expense",
        icon: "💰",
        iconClass: "qt-tool-icon-green",
        title: "Expense Tracker",
        sub: "Track your UK journey expenses",
        action: ({ setTab }) => setTab("expense"),
    },
];

/**
 * @param {(tabKey: string) => void} setTab
 * @param {"home"|"tools"|"home-scroll"} [variant] - which context this is
 *        rendered in. Controls heading visibility and grid/scroll layout.
 *        Defaults to "home".
 */
function QuickTools({ setTab, variant = "home" }) {
    const showHeading = variant === "home";

    return (
        <div className={`qt-wrap qt-wrap--${variant}`}>
            {showHeading && (
                <div className="qt-header">
                    <div className="qt-header-title">Quick Tools</div>
                </div>
            )}

            <div className={`qt-grid qt-grid--${variant}`}>
                {QUICK_TOOLS.map((tool) => (
                    <button
                        key={tool.key}
                        type="button"
                        className="qt-card"
                        onClick={() => tool.action({ setTab })}
                    >
                        <div className={`qt-icon ${tool.iconClass}`}>{tool.icon}</div>
                        <div className="qt-title">{tool.title}</div>
                        <div className="qt-sub">{tool.sub}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default QuickTools;
