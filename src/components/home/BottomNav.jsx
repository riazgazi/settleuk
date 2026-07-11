import React from 'react';
import { useJourneyContext } from '../../context/JourneyContext';

/*
 * Replaces the old 7-item feature-based Bottom Navigation. Now represents
 * only the app's 4 PRIMARY sections. Quick Tools (University Explorer,
 * Budget Calculator, Documents, CAS & UKVI, UK Guides) are no longer opened
 * directly from here — only through the Tools section itself, per Layout
 * Standardization.
 *
 * Journey uses `screen`/`setScreen` (My Journey + Step Details live outside
 * Home's tab system). Home/Tools use `tab`/`setTab` (Home's internal tab
 * state, lifted into useJourney.js so this shell-level component can reach
 * it). Profile reuses the existing Settings modal — openSettings() pulled
 * straight from context, same as Header.jsx already did.
 */
const BottomNav = ({ screen, setScreen, tab, setTab }) => {
    const { openSettings } = useJourneyContext();

    const isHome = screen === "home" && tab === "home";
    const isJourney = screen === "journey" || screen === "step-details";
    const isTools = screen === "home" && ["tools", "costs", "prep", "docs", "university-explorer"].includes(tab);

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
            label: "Journey",
            active: isJourney,
            onClick: () => setScreen("journey"),
        },
        {
            id: "tools",
            icon: "🧰",
            label: "Tools",
            active: isTools,
            onClick: () => { setScreen("home"); setTab("tools"); },
        },
        {
            id: "profile",
            icon: "👤",
            label: "Profile",
            active: false,
            onClick: () => openSettings(),
        },
    ];

    return (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(8,17,28,0.96)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", padding: "8px 0 14px", zIndex: 100 }}>
            {items.map((item) => (
                <button key={item.id} className="jtu-bottom-nav-btn" onClick={item.onClick} style={{ flex: 1, background: "transparent", border: "none", cursor: "pointer", padding: "4px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 0 }}>
                    <span className="jtu-bottom-nav-icon" style={{ fontSize: 20 }}>{item.icon}</span>
                    <span className="jtu-bottom-nav-label" style={{ fontSize: 10, fontWeight: 600, color: item.active ? "#3B82F6" : "rgba(255,255,255,0.28)", whiteSpace: "nowrap" }}>{item.label}</span>
                </button>
            ))}
        </div>
    );
};

export default BottomNav;
