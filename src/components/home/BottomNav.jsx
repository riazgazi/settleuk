import React from 'react';

/*
 * Bottom Navigation — 5 items: Home, My Journey, Switch, Tasks, Profile.
 *
 * "Tools" was previously here as a 4th primary item; per the new nav
 * redesign it's been replaced by two new items:
 *   - Switch: toggles the Home area between the normal "Journey to UK"
 *     dashboard and the "Welcome to UK" placeholder screen. Purely a
 *     `view` toggle in useJourney.js, doesn't touch `screen`/`tab`.
 *   - Tasks: consolidated all-stages task list, its own `screen` value
 *     ("tasks"), same pattern as "journey"/"step-details".
 *
 * Journey uses `screen`/`setScreen` (My Journey + Step Details live outside
 * Home's tab system). Home/Tools use `tab`/`setTab` (Home's internal tab
 * state, lifted into useJourney.js so this shell-level component can reach
 * it). Profile also uses `screen`/`setScreen` — screen="profile" renders
 * the full-screen Profile page (src/pages/Profile.jsx) via App.js, the
 * same pattern as "journey"/"tasks". It replaced the old floating Settings
 * modal popup that used to open here.
 */
const BottomNav = ({ screen, setScreen, tab, setTab, view, onToggleView }) => {
    const isHome = screen === "home" && tab === "home";
    const isJourney = screen === "journey" || screen === "step-details";
    const isTasks = screen === "tasks";
    const isProfile = screen === "profile";
    const isSwitchActive = view === "welcome";

    const items = [
        {
            id: "home",
            icon: "🏠",
            label: "Home",
            active: isHome,
            onClick: () => { setScreen("home"); setTab("home"); },
        },
        {
            id: "journey",
            icon: "🗺",
            label: "My Journey",
            active: isJourney,
            onClick: () => setScreen("journey"),
        },
        {
            id: "switch",
            label: "Switch",
            active: isSwitchActive,
            onClick: onToggleView,
        },
        {
            id: "tasks",
            icon: "📋",
            label: "Tasks",
            active: isTasks,
            onClick: () => setScreen("tasks"),
        },
        {
            id: "profile",
            icon: "👤",
            label: "Profile",
            active: isProfile,
            onClick: () => setScreen("profile"),
        },
    ];

    return (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(8,17,28,0.96)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.07)", zIndex: 100, paddingBottom: "var(--safe-bottom)" }}>
            <div style={{ display: "flex", maxWidth: "var(--content-max-width)", margin: "0 auto", padding: "8px 4px 14px" }}>
                {items.map((item) => {
                    if (item.id === "switch") {
                        return (
                            <button
                                key={item.id}
                                className="jtu-bottom-nav-btn"
                                onClick={item.onClick}
                                aria-label="Switch view"
                                style={{ flex: 1, background: "transparent", border: "none", cursor: "pointer", padding: "0", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 0 }}
                            >
                                <span
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: "50%",
                                        background: "#0F6E56",
                                        border: item.active ? "2px solid #F0A93A" : "2px solid transparent",
                                        boxShadow: item.active ? "0 0 10px rgba(240,169,58,0.45)" : "none",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 2,
                                        marginTop: -8,
                                        flexShrink: 0,
                                    }}
                                >
                                    <span style={{ fontSize: 13, lineHeight: 1 }}>🇧🇩</span>
                                    <span style={{ fontSize: 9, lineHeight: 1, color: "rgba(255,255,255,0.8)" }}>⇄</span>
                                    <span style={{ fontSize: 13, lineHeight: 1 }}>🇬🇧</span>
                                </span>
                                <span className="jtu-bottom-nav-label" style={{ fontSize: "clamp(9px, 2.4vw, 10px)", fontWeight: 600, color: item.active ? "#F0A93A" : "rgba(255,255,255,0.28)", whiteSpace: "nowrap" }}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    }

                    return (
                        <button key={item.id} className="jtu-bottom-nav-btn" onClick={item.onClick} style={{ flex: 1, background: "transparent", border: "none", cursor: "pointer", padding: "4px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 0 }}>
                            <span className="jtu-bottom-nav-icon" style={{ fontSize: "clamp(18px, 4.5vw, 20px)" }}>{item.icon}</span>
                            <span className="jtu-bottom-nav-label" style={{ fontSize: "clamp(9px, 2.4vw, 10px)", fontWeight: 600, color: item.active ? "#3B82F6" : "rgba(255,255,255,0.28)", whiteSpace: "nowrap" }}>{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
