// src/components/home/InfoExpand.jsx
import React from 'react';

const InfoExpand = ({ desc, link, accent }) => {
    return (
        <div style={{ marginTop: 8, marginLeft: 32, padding: "10px 12px", background: "rgba(255,255,255,0.03)", border: `1px solid ${accent}33`, borderRadius: 10, animation: "infoFadeIn 0.18s ease" }}>
            <style>{`@keyframes infoFadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.55, marginBottom: link ? 9 : 0 }}>{desc}</div>
            {link && (
                <a href={link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: accent, textDecoration: "none", padding: "5px 11px", background: accent + "18", border: `1px solid ${accent}40`, borderRadius: 8 }}>
                    🔗 Learn more / Official link ↗
                </a>
            )}
        </div>
    );
};

export default InfoExpand;