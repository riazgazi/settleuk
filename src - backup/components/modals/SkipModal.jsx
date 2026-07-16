// src/components/modals/SkipModal.jsx
import React from 'react';
import { useJourneyContext } from '../../context/JourneyContext';
import { STATUSES } from '../../data/stages';

const SkipModal = () => {
    const { skipWarning, confirmSkip, setSkipWarning } = useJourneyContext();
    if (!skipWarning) return null;

    const toStage = STATUSES[skipWarning.toId];

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "Arial, sans-serif" }}>
            <div style={{ width: "100%", maxWidth: 400, background: "#0A2545", borderRadius: 22, padding: "28px 24px", border: "2px solid rgba(232,91,91,0.4)", boxShadow: "0 0 40px rgba(232,91,91,0.15)" }}>
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <div style={{ fontSize: 44, marginBottom: 10 }}>⚠️</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#CF142B", marginBottom: 6 }}>You're skipping ahead!</div>
                    <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                        You're jumping to <strong style={{ color: "#F0F4FF" }}>{toStage.emoji} {toStage.label}</strong> but these priority tasks are still incomplete:
                    </div>
                </div>
                <div style={{ marginBottom: 18, maxHeight: 200, overflowY: "auto" }}>
                    {skipWarning.incompleteTasks.map((t, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 12px", marginBottom: 6, background: "rgba(232,91,91,0.07)", border: "1px solid rgba(232,91,91,0.2)", borderRadius: 10 }}>
                            <span style={{ fontSize: 14, marginTop: 1, flexShrink: 0 }}>❌</span>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: "#CF142B", marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.4 }}>{t.stage}</div>
                                <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>{t.text}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ padding: "9px 12px", background: "rgba(232,168,56,0.08)", border: "1px solid rgba(232,168,56,0.22)", borderRadius: 10, marginBottom: 18, fontSize: 11.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                    🕒 <strong style={{ color: "#E8A838" }}>Recommendation:</strong> Go back and complete these tasks first. Skipping may cause issues in your UK application journey.
                </div>
                <button onClick={() => setSkipWarning(null)} style={{ width: "100%", padding: "12px 0", background: "#1D9E6A", border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", marginBottom: 10 }}>
                    ← Go back and complete tasks
                </button>
                <button onClick={confirmSkip} style={{ width: "100%", padding: "10px 0", background: "transparent", border: "1px solid rgba(232,91,91,0.35)", borderRadius: 12, color: "#CF142B", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    Skip anyway (not recommended)
                </button>
            </div>
        </div>
    );
};

export default SkipModal;