import React, { useState, useEffect, useRef } from "react";
import { STATUSES } from "../data/stages";

function HeaderStatusPill({ statusId, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = STATUSES[statusId];

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <style>{`
        @keyframes jtuBlinkGlow { 0%,100% { box-shadow: 0 0 0 0 rgba(46,107,255,0.6); } 50% { box-shadow: 0 0 0 5px rgba(46,107,255,0); } }
        @keyframes jtuPulseDot  { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.7); opacity: 0.35; } }
      `}</style>
      <button onClick={() => setOpen(o => !o)} style={{
        display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer",
        padding: "5px 10px 5px 8px", background: "rgba(46,107,255,0.13)",
        border: "1.5px solid #2E6BFF", borderRadius: 18,
        animation: "jtuBlinkGlow 2s infinite",
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2E6BFF", flexShrink: 0, animation: "jtuPulseDot 1.5s infinite" }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: "#3B82F6", whiteSpace: "nowrap" }}>{current.emoji} {current.label}</span>
      </button>
      <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.22)", fontStyle: "italic", marginTop: 3, paddingRight: 2 }}>tap to change</div>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0, minWidth: 220, zIndex: 200,
          background: "#0A2545", border: "1.5px solid rgba(46,107,255,0.3)", borderRadius: 14,
          overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.65)",
        }}>
          {STATUSES.map(s => (
            <button key={s.id} onClick={() => { onChange(s.id); setOpen(false); }} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "11px 14px",
              background: s.id === statusId ? "rgba(46,107,255,0.12)" : "transparent",
              border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)",
              color: s.id === statusId ? "#3B82F6" : "rgba(255,255,255,0.6)",
              fontSize: 13, fontWeight: s.id === statusId ? 800 : 500,
              cursor: "pointer", textAlign: "left",
            }}>
              <span style={{ fontSize: 16 }}>{s.emoji}</span>
              <span style={{ flex: 1 }}>{s.label}</span>
              {s.id === statusId && <span style={{ color: "#3B82F6", fontSize: 13 }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default HeaderStatusPill;
