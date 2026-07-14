import React, { useState, useEffect } from "react";
import { useJourneyContext } from "../../context/JourneyContext";
import { STAGES } from "../../data/stages";

import FeaturePageHeader from "../../components/layout/FeaturePageHeader";
import HomeDashboard from "./components/HomeDashboard";
import HomeTasks from "./components/HomeTasks";
import HomeGuides from "./components/HomeGuides";

import CostsTab from "../../features/costs/CostsTab";
import ExpenseTracker from "../../features/expenses/ExpenseTracker";
import PrepTab from "../../features/cas/PrepTab";
import PackingTab from "../../features/packing/PackingTab";
import Documents from "../../features/documents/Documents";
import UniversityExplorer from "../../features/university/UniversityExplorer";
import StageInfoModal from "../../components/home/StageInfoModal";
import QuickTools from "../../components/quicktools/QuickTools";

/*
 * NOTE: Home no longer renders its own <AppLayout>. The persistent Bottom
 * Navigation now lives at the App shell level (App.js), wrapping Home,
 * MyJourney, and StepDetails together — so "tab" moved from Home's local
 * state into useJourney.js, where the shell's BottomNav can also reach it.
 * Home now just renders whichever tab's content is active; AppLayout (in
 * App.js) supplies the surrounding chrome + bottom nav.
 */
const Home = () => {
    const {
        profile,
        taskDone,
        toggleTask,
        academicProfile,
        setAcademicProfile,
        showToast,
        setScreen,
        tab,
        setTab,
    } = useJourneyContext();

    const [stageInfoId, setStageInfoId] = useState(null);

    const statusId = profile.statusId || 0;
    const sg = STAGES[statusId];
    const stIdx = statusId;
    const arrivalDays = profile.arrival ? Math.ceil((new Date(profile.arrival + "T12:00:00") - new Date()) / (1000 * 60 * 60 * 24)) : null;
    const packingAutoVisible = statusId === 4 || statusId === 5;

    // University Explorer is now a standard tab-based feature screen — was
    // a modal (setShowUniFinder) before layout standardization.
    useEffect(() => {
        if (statusId === 0 && !academicProfile) {
            setTab("university-explorer");
        }
    }, [statusId, academicProfile, setTab]);

    // Every feature page opened from Quick Tools returns to "tools", not
    // "home" — the app's standard Back destination per Layout Standardization.
    const backToTools = () => setTab("tools");

    return (
        <>
            {tab === "home" && (
                <HomeDashboard
                    stIdx={stIdx}
                    sg={sg}
                    arrivalDays={arrivalDays}
                    statusId={statusId}
                    academicProfile={academicProfile}
                    setTab={setTab}
                    setScreen={setScreen}
                    setStageInfoId={setStageInfoId}
                />
            )}

            {tab === "tasks" && (
                <HomeTasks
                    sg={sg}
                    taskDone={taskDone}
                    toggleTask={toggleTask}
                    statusId={statusId}
                    setTab={setTab}
                />
            )}

            {tab === "tools" && (
                <QuickTools setTab={setTab} variant="tools" />
            )}

            {/* University Explorer manages its own FeaturePageHeader
                internally (it needs a dynamic title for the Details
                sub-view), so it is NOT wrapped here — wrapping it too
                would stack two headers. */}
            {tab === "university-explorer" && (
                <UniversityExplorer
                    savedAcademic={academicProfile}
                    onSaveProfile={(data) => setAcademicProfile(data)}
                    setTab={setTab}
                />
            )}

            {tab === "costs" && (
                <>
                    <FeaturePageHeader
                        title="Budget Calculator"
                        subtitle="Estimate your UK study budget"
                        onBack={backToTools}
                    />
                    <div style={{ padding: "0 16px 24px" }}>
                        <CostsTab />
                    </div>
                </>
            )}
            {tab === "expense" && (
                <>
                    <FeaturePageHeader
                        title="Expense Tracker"
                        subtitle="Track your UK journey expenses"
                        onBack={backToTools}
                    />
                    <div style={{ padding: "0 16px 24px" }}>
                        <ExpenseTracker />
                    </div>
                </>
            )}

            {tab === "prep" && (
                <>
                    <FeaturePageHeader
                        title="CAS & UKVI Preparation"
                        subtitle="Prepare your CAS and UK visa application"
                        onBack={backToTools}
                    />
                    <div style={{ padding: "0 16px 24px" }}>
                        <PrepTab />
                    </div>
                </>
            )}

            {tab === "docs" && (
                <>
                    <FeaturePageHeader
                        title="Documents"
                        subtitle="Manage all your study documents"
                        onBack={backToTools}
                    />
                    <div style={{ padding: "0 16px 24px" }}>
                        <Documents />
                    </div>
                </>
            )}

            {tab === "packing" && packingAutoVisible && <PackingTab />}
            {tab === "guides" && <HomeGuides />}

            {showToast && (
                <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", background: "#1D9E6A", color: "#08111C", padding: "10px 24px", borderRadius: 30, fontSize: 13, fontWeight: 700, boxShadow: "0 4px 20px rgba(0,0,0,0.4)", whiteSpace: "nowrap", zIndex: 300 }}>
                    {showToast}
                </div>
            )}

            {stageInfoId !== null && (
                <StageInfoModal stage={STAGES[stageInfoId]} onClose={() => setStageInfoId(null)} />
            )}
        </>
    );
};

export default Home;
