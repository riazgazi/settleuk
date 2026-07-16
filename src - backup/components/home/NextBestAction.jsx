// src/components/home/NextBestAction.jsx
import React from 'react';

const NextBestAction = ({ sg, onStart }) => {
    const timeBadge = {
        critical: { color: "#CF142B", bg: "rgba(207,20,43,0.15)", label: "URGENT" },
        high: { color: "#E8A838", bg: "rgba(232,168,56,0.15)", label: "THIS WEEK" },
        medium: { color: "#3B82F6", bg: "rgba(46,107,255,0.15)", label: "UPCOMING" },
    }[sg.deadlineUrgency] || { color: "#3B82F6", bg: "rgba(46,107,255,0.15)", label: "UPCOMING" };

    return (
        <div style={{ background: "#0A2545", border: "1px solid rgba(46,107,255,0.2)", borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(207,20,43,0.15)", borderRadius: 20, padding: "3px 10px" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#CF142B", flexShrink: 0 }} />
                    <span style={{ fontSize: 9, fontWeight: 800, color: "#CF142B", textTransform: "uppercase", letterSpacing: 0.6 }}>Next Action</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, background: timeBadge.bg, borderRadius: 20, padding: "3px 10px" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: timeBadge.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 9, fontWeight: 800, color: timeBadge.color, textTransform: "uppercase", letterSpacing: 0.6 }}>{timeBadge.label}</span>
                </div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#F0F4FF", lineHeight: 1.3, marginBottom: 4 }}>{sg.nextAction}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 13, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 12 }}>ℹ</span><span>{sg.deadline}</span>
            </div>
            <button onClick={onStart} style={{ width: "100%", padding: "10px 0", background: "linear-gradient(90deg, #2E6BFF, #7C3AED)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13.5, fontWeight: 800, cursor: "pointer", letterSpacing: 0.3 }}>
                Start Now →
            </button>
        </div>
    );
};

export default NextBestAction;