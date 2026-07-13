// src/hooks/useJourney.js
import { useState, useEffect, useCallback } from "react";
import { STAGES, AUTO_ADVANCE } from "../data/stages";
import { loadLS, saveLS } from "./useLocalStorage";

export const useJourney = () => {
    const [screen, setScreen] = useState(() => {
        const s = loadLS("settleuk_profile", null);
        return s && s.name ? "home" : "onboard";
    });

    const [profile, setProfile] = useState(() => loadLS("settleuk_profile", { name: "", statusId: 0, arrival: "", step: 0 }));
    const [taskDone, setTaskDone] = useState(() => loadLS("settleuk_tasks", {}));
    const [docChecked, setDocChecked] = useState(() => loadLS("settleuk_docs", {}));
    const [academicProfile, setAcademicProfile] = useState(() => loadLS("settleuk_academic", null));

    // Which stage StepDetails should render. Not persisted to localStorage —
    // it's just "where in My Journey the user tapped", not journey progress
    // data, so it resets to null on reload like showSettings/showToast do.
    const [selectedStage, setSelectedStage] = useState(null);

    // Home's internal tab (home/tasks/tools/costs/prep/docs/packing/guides/
    // university-explorer). Lifted here from Home.jsx's local useState so
    // the persistent BottomNav (now rendered at the App shell level,
    // outside Home) can read and set it — e.g. tapping "Tools" needs to
    // set both screen="home" AND tab="tools". Not persisted, same reasoning
    // as selectedStage above.
    const [tab, setTab] = useState("home");

    const [showSettings, setShowSettings] = useState(false);
    const [editProfile, setEditProfile] = useState({ name: "", arrival: "" });
    const [showToast, setShowToast] = useState("");

    const [advancePrompt, setAdvancePrompt] = useState(null);
    const [skipWarning, setSkipWarning] = useState(null);

    useEffect(() => { saveLS("settleuk_profile", profile); }, [profile]);
    useEffect(() => { saveLS("settleuk_tasks", taskDone); }, [taskDone]);
    useEffect(() => { saveLS("settleuk_docs", docChecked); }, [docChecked]);
    useEffect(() => { if (academicProfile) saveLS("settleuk_academic", academicProfile); }, [academicProfile]);

    const toggleDoc = useCallback((id) => {
        setDocChecked(p => ({ ...p, [id]: !p[id] }));
    }, []);

    const changeStatus = useCallback((toId) => {
        const currentId = profile.statusId || 0;
        if (toId > currentId + 1) {
            const incomplete = [];
            for (let s = currentId; s < toId; s++) {
                STAGES[s].tasks
                    .filter(t => t.priority && !taskDone[t.id])
                    .forEach(t => incomplete.push({ stage: STAGES[s].name, text: t.text }));
            }
            if (incomplete.length > 0) {
                setSkipWarning({ toId, incompleteTasks: incomplete });
                return;
            }
        }
        setProfile(p => ({ ...p, statusId: toId }));
    }, [profile.statusId, taskDone]);

    const toggleTask = useCallback((id) => {
        const nowDone = !taskDone[id];
        setTaskDone(p => ({ ...p, [id]: nowDone }));

        if (nowDone && AUTO_ADVANCE[id] !== undefined) {
            const toStatus = AUTO_ADVANCE[id];
            if (toStatus > (profile.statusId || 0)) {
                let taskText = "";
                for (const s of STAGES) {
                    const t = s.tasks.find(t => t.id === id);
                    if (t) { taskText = t.text; break; }
                }
                setAdvancePrompt({ taskId: id, toStatusId: toStatus, taskText });
            }
        }

        if (!nowDone && AUTO_ADVANCE[id] !== undefined && profile.statusId === AUTO_ADVANCE[id]) {
            setProfile(p => ({ ...p, statusId: AUTO_ADVANCE[id] - 1 }));
        }
    }, [taskDone, profile.statusId]);

    const confirmAdvance = useCallback(() => {
        if (advancePrompt) {
            setProfile(p => ({ ...p, statusId: advancePrompt.toStatusId }));
            setShowToast("🎉 Status updated automatically!");
            setTimeout(() => setShowToast(""), 2500);
        }
        setAdvancePrompt(null);
    }, [advancePrompt]);

    const confirmSkip = useCallback(() => {
        if (skipWarning) {
            setProfile(p => ({ ...p, statusId: skipWarning.toId }));
            setShowToast("⚠️ Skipped — complete missed tasks when you can!");
            setTimeout(() => setShowToast(""), 3000);
        }
        setSkipWarning(null);
    }, [skipWarning]);

    const openSettings = useCallback(() => {
        setEditProfile({ name: profile.name, arrival: profile.arrival });
        setShowSettings(true);
    }, [profile.name, profile.arrival]);

    const saveProfileChanges = useCallback(() => {
        if (editProfile.name.trim()) {
            setProfile(p => ({ ...p, ...editProfile }));
            setShowToast("✓ Changes Saved");
            setTimeout(() => {
                setShowToast("");
                setShowSettings(false);
            }, 1100);
        }
    }, [editProfile]);

    const resetAllProgress = useCallback(() => {
        if (window.confirm("Are you sure? This will permanently delete all your progress.")) {
            [
                "settleuk_profile",
                "settleuk_tasks",
                "settleuk_docs",
                "settleuk_academic",
                "settleuk_packing_checked",
                "settleuk_packing_custom",
                "settleuk_luggage_preset",
                "settleuk_luggage_custom",
                "settleuk_expenses",
                "settleuk_pdfs_meta"
            ].forEach(k => localStorage.removeItem(k));

            window.location.reload();
        }
    }, []);

    return {
        screen, setScreen,
        profile, setProfile,
        taskDone, toggleTask,
        docChecked, toggleDoc,
        academicProfile, setAcademicProfile,
        changeStatus,

        selectedStage, setSelectedStage,
        tab, setTab,

        showSettings, setShowSettings,
        editProfile, setEditProfile,
        openSettings, saveProfileChanges,
        resetAllProgress,

        showToast, setShowToast,

        advancePrompt, confirmAdvance, setAdvancePrompt,
        skipWarning, confirmSkip, setSkipWarning
    };
};
