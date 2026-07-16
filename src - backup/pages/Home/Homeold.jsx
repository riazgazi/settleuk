import React, { useState, useEffect } from "react";
import { useJourneyContext } from "../../context/JourneyContext";
import { STAGES } from "../../data/stages";

import AppLayout from "../../components/layout/AppLayout";
import HomeDashboard from "./components/HomeDashboard";
import HomeTasks from "./components/HomeTasks";
import HomeGuides from "./components/HomeGuides";

import CostsTab from "../../features/costs/CostsTab";
import PrepTab from "../../features/cas/PrepTab";
import PackingTab from "../../features/packing/PackingTab";
import Documents from "../../features/documents/Documents";
import UniversityFinder from "../../features/university/UniversityFinder";
import StageInfoModal from "../../components/home/StageInfoModal";

const Home = () => {
    const { profile, taskDone, toggleTask, academicProfile, setAcademicProfile, changeStatus, showToast, setScreen } = useJourneyContext();

    const [tab, setTab] = useState("home");
    const [stageInfoId, setStageInfoId] = useState(null);
    const [showUniFinder, setShowUniFinder] = useState(false);

    const statusId = profile.statusId || 0;
    const sg = STAGES[statusId];
    const stIdx = statusId;
    const arrivalDays = profile.arrival ? Math.ceil((new Date(profile.arrival + "T12:00:00") - new Date()) / (1000 * 60 * 60 * 24)) : null;
    const packingAutoVisible = statusId === 4 || statusId === 5;

    useEffect(() => {
        if (statusId === 0 && !academicProfile) {
            setShowUniFinder(true);
        }
    }, [statusId, academicProfile]);

    return (
        <>
            <AppLayout
                profile={profile}
                arrivalDays={arrivalDays}
                changeStatus={changeStatus}
                tab={tab}
                setTab={setTab}
                packingAutoVisible={packingAutoVisible}
            >
                {tab === "home" && (
                    <HomeDashboard
                        stIdx={stIdx}
                        sg={sg}
                        arrivalDays={arrivalDays}
                        statusId={statusId}
                        academicProfile={academicProfile}
                        setTab={setTab}
                        setScreen={setScreen}
                        setShowUniFinder={setShowUniFinder}
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

                {tab === "costs" && <CostsTab />}
                {tab === "prep" && <PrepTab />}
                {tab === "docs" && <Documents />}
                {tab === "packing" && packingAutoVisible && <PackingTab />}
                {tab === "guides" && <HomeGuides />}
            </AppLayout>

            {showToast && (
                <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", background: "#1D9E6A", color: "#08111C", padding: "10px 24px", borderRadius: 30, fontSize: 13, fontWeight: 700, boxShadow: "0 4px 20px rgba(0,0,0,0.4)", whiteSpace: "nowrap", zIndex: 300 }}>
                    {showToast}
                </div>
            )}

            {showUniFinder && (
                <UniversityFinder savedAcademic={academicProfile} onSaveProfile={(data) => setAcademicProfile(data)} onClose={() => setShowUniFinder(false)} />
            )}

            {stageInfoId !== null && (
                <StageInfoModal stage={STAGES[stageInfoId]} onClose={() => setStageInfoId(null)} />
            )}
        </>
    );
};

export default Home;
