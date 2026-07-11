// src/components/home/ExploreGrid.jsx
import React from 'react';
import { Search, GraduationCap, FileText, Plane, Wallet, BookOpen } from 'lucide-react';

const ExploreGrid = ({ setTab, setShowUniFinder, setStageInfoId }) => {
    const items = [
        { icon: Search, label: "Research", kind: "finder", tint: "#7C3AED" },
        { icon: GraduationCap, label: "Uni App", kind: "info", stageId: 1, tint: "#2E6BFF" },
        { icon: FileText, label: "CAS App", kind: "info", stageId: 3, tint: "#7C3AED" },
        { icon: Plane, label: "Visa App", kind: "info", stageId: 4, tint: "#2E6BFF" },
        { icon: Wallet, label: "Budget Calc", kind: "tab", value: "costs", tint: "#7C3AED" },
        { icon: BookOpen, label: "CAS & UKVI", kind: "tab", value: "prep", tint: "#2E6BFF" },
    ];

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: "rgba(255,255,255,0.28)" }}>🧭 Explore</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {items.map(({ icon: Icon, label, kind, value, stageId, tint }) => (
                    <div
                        key={label}
                        onClick={() => {
                            if (kind === "tab") setTab(value);
                            else if (kind === "finder") setShowUniFinder(true);
                            else if (kind === "info") setStageInfoId(stageId);
                        }}
                        style={{
                            background: "#0A2545", borderRadius: 14, padding: "14px 8px", textAlign: "center",
                            border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer",
                            transition: "transform 0.1s ease",
                        }}
                    >
                        <div style={{
                            width: 36, height: 36, borderRadius: 10, margin: "0 auto 8px",
                            background: `${tint}22`, display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <Icon size={18} color={tint} strokeWidth={2.5} />
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#F0F4FF", lineHeight: 1.2 }}>{label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExploreGrid;