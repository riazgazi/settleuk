import React from 'react';
import { GUIDES } from '../../../data/guides';

const HomeGuides = () => {
    return (
        <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 19, fontWeight: 800 }}>📖 Guides & Resources</h2>
            <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "rgba(255,255,255,0.38)" }}>Official links and step-by-step guides for life in UK</p>
            {GUIDES.map((g, i) => (
                <a key={i} href={g.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", marginBottom: 7, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, textDecoration: "none", color: "#F0F4FF" }}>
                    <span style={{ fontSize: 22 }}>{g.icon}</span>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700 }}>{g.title}</div>
                        <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.28)", marginTop: 2 }}>{g.sub}</div>
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 15 }}>↗</span>
                </a>
            ))}
        </div>
    );
};

export default HomeGuides;