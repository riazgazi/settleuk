import React from 'react';
import BottomNav from '../home/BottomNav';

/*
 * Shared shell for every primary screen (Home, My Journey, Step Details).
 * Now rendered once at the App level (App.js) instead of inside Home, so
 * the Bottom Navigation stays persistent across all three — per Layout
 * Standardization, only Onboarding and modals sit outside this shell.
 *
 * The old per-tab `Header` component (with its own redundant 7-item tab
 * row) has been removed entirely. Each screen now supplies its own header:
 * HomeDashboard has its own dashboard header, feature pages use
 * FeaturePageHeader, and My Journey / Step Details keep their existing
 * headers untouched.
 */
const AppLayout = ({ children, screen, setScreen, tab, setTab, view, onToggleView }) => {
    // HomeDashboard, FeaturePageHeader-wrapped pages, UniversityExplorer,
    // MyJourney, and StepDetails all manage their own internal padding now.
    // HomeTasks/PackingTab/HomeGuides weren't part of this pass (their code
    // wasn't reviewed) and likely still assume the old AppLayout padding —
    // keep it for just those three so they don't suddenly look broken.
    const needsLegacyPadding = screen === "home" && ["tasks", "packing", "guides"].includes(tab);

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #011936 0%, #0A2348 50%, #0F2D5C 100%)", fontFamily: "Arial, sans-serif", color: "#F0F4FF", paddingBottom: "calc(80px + var(--safe-bottom))", width: "100%" }}>
            <style>{`* { -webkit-tap-highlight-color: transparent; }`}</style>

            <div style={{ maxWidth: "var(--content-max-width)", width: "100%", margin: "0 auto", padding: needsLegacyPadding ? "var(--spacing-md) var(--page-gutter)" : 0 }}>
                {children}
            </div>

            <BottomNav
                screen={screen}
                setScreen={setScreen}
                tab={tab}
                setTab={setTab}
                view={view}
                onToggleView={onToggleView}
            />
        </div>
    );
};

export default AppLayout;
