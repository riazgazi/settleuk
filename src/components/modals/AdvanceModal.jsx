// src/components/modals/AdvanceModal.jsx
import React from 'react';
import { useJourneyContext } from '../../context/JourneyContext';
import { STATUSES } from '../../data/stages';

const AdvanceModal = () => {
    const { advancePrompt, confirmAdvance, setAdvancePrompt } = useJourneyContext();
    if (!advancePrompt) return null;

    const next = STATUSES[advancePrompt.toStatusId];
    const btnStyle = (bg) => ({ width: "100%", padding: "14px 0", background: bg, border: "none", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" });

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "Arial, sans-serif" }}>
            <div style={{ width: "100%", maxWidth: 380, background: "#0A2545", borderRadius: 22, padding: "28px 24px", border: "1px solid rgba(61,184,139,0.3)" }}>
                <div style={{ fontSize: 38, marginBottom: 12, textAlign: "center" }}>🎯</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#F0F4FF", marginBottom: 8, textAlign: "center" }}>Ready to move forward?</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 20, textAlign: "center" }}>
                    You completed:<br />
                    <strong style={{ color: "#F0F4FF" }}>"{advancePrompt.taskText.slice(0, 55)}"</strong><br /><br />
                    Update your status to:<br />
                    <span style={{ color: "#1D9E6A", fontWeight: 800, fontSize: 15 }}>{next.emoji} {next.label}</span>?
                </div>
                <button onClick={confirmAdvance} style={{ ...btnStyle("#1D9E6A"), marginBottom: 10 }}>Yes, update my status ✓</button>
                <button onClick={() => setAdvancePrompt(null)} style={{ ...btnStyle("transparent"), border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }}>No, I'll update manually</button>
            </div>
        </div>
    );
};

export default AdvanceModal;