// src/components/modals/SettingsModal.jsx
import React from 'react';
import { useJourneyContext } from '../../context/JourneyContext';

const SettingsModal = () => {
    const { showSettings, setShowSettings, profile, editProfile, setEditProfile, saveProfileChanges, resetAllProgress } = useJourneyContext();
    if (!showSettings) return null;

    const inputStyle = { width: "100%", padding: "12px 16px", marginBottom: 16, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#fff", fontSize: 15, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
    const btnStyle = (bg) => ({ width: "100%", padding: "14px 0", background: bg, border: "none", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" });
    const isChanged = editProfile.name !== profile.name || editProfile.arrival !== profile.arrival;

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "Arial, sans-serif" }}>
            <div style={{ width: "100%", maxWidth: 420, background: "#0A2545", borderRadius: 24, padding: "32px 28px", border: "1px solid rgba(255,255,255,0.1)", color: "#F0F4FF" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>⚙️ Settings</h2>
                    <button onClick={() => setShowSettings(false)} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 20 }}>✕</button>
                </div>
                <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Your Name</label>
                <input value={editProfile.name} onChange={e => setEditProfile(p => ({ ...p, name: e.target.value }))} placeholder="Enter your name" style={inputStyle} />
                <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>📅 UK Arrival Date (estimated)</label>
                <input type="date" value={editProfile.arrival} onChange={e => setEditProfile(p => ({ ...p, arrival: e.target.value }))} style={inputStyle} />

                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 20, padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
                    💡 Change your journey stage anytime using the status pill in the top-right corner.
                </div>

                <button disabled={!editProfile.name.trim() || !isChanged} onClick={saveProfileChanges} style={btnStyle(editProfile.name.trim() && isChanged ? "#1D9E6A" : "#333")}>
                    Save Changes ✓
                </button>
                <button onClick={() => setShowSettings(false)} style={{ ...btnStyle("transparent"), marginTop: 10, border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)" }}>Cancel</button>

                <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "24px 0" }} />

                <button onClick={resetAllProgress} style={{ width: "100%", padding: "12px 0", background: "transparent", border: "1px solid rgba(232,91,91,0.35)", borderRadius: 12, color: "#CF142B", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                    Reset All Progress
                </button>
            </div>
        </div>
    );
};

export default SettingsModal;