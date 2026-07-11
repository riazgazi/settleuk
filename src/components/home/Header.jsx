// src/components/home/Header.jsx
import React from 'react';
import { useJourneyContext } from '../../context/JourneyContext';
import HeaderStatusPill from './HeaderStatusPill';

const Header = ({ profile, arrivalDays, changeStatus, tab, setTab, packingAutoVisible }) => {
    const { openSettings } = useJourneyContext();

    return (
        <div style={{ background: "linear-gradient(135deg,#0B1230 0%,#1a0f30 100%)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "14px 20px 0" }}>
            <div style={{ maxWidth: 640, margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: "linear-gradient(135deg,#2E6BFF,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: "#fff", letterSpacing: 0.3 }}>GB</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 17, fontWeight: 800, color: "#3B82F6", whiteSpace: "nowrap" }}>Journey to UK</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 500, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            Hello, {profile.name}! {arrivalDays !== null && (arrivalDays > 0 ? `· ${arrivalDays} days to arrival` : "· You're in the UK now! 🇬🇧")}
                        </div>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: "right" }}>
                        <HeaderStatusPill statusId={profile.statusId} onChange={changeStatus} />
                    </div>
                    <button onClick={openSettings} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: 15, width: 34, height: 34, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>⚙️</button>
                </div>
                <div style={{ display: "flex", overflowX: "auto", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    {[["home", "🏠", "Home"], ["tasks", "✅", "Tasks"], ["costs", "💷", "Costs"], ["prep", "📚", "CAS&UKVI"], ["docs", "📄", "Docs"], ...(packingAutoVisible ? [["packing", "🧳", "Packing"]] : []), ["guides", "📖", "Guides"]].map(([id, em, lbl]) => (
                        <button key={id} onClick={() => setTab(id)} style={{ flex: "none", padding: "10px 14px", background: "transparent", border: "none", borderBottom: tab === id ? "2px solid #3B82F6" : "2px solid transparent", color: tab === id ? "#3B82F6" : "rgba(255,255,255,0.38)", fontSize: 12.5, fontWeight: tab === id ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 5 }}>
                            <span style={{ fontSize: 13 }}>{em}</span>{lbl}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Header;