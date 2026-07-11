import React, { useState, useEffect, useRef } from "react";
import { STATUSES } from "../data/stages";

function StatusDropdown({ statusId, onChange }) {
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
    <div ref={ref} style={{ marginBottom: 16, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "rgba(255,255,255,0.3)" }}>
          Current Status
        </span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.22)", fontStyle: "italic" }}>tap to change</span>
      </div>

      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10,
          padding: "12px 14px",
          background: "rgba(61,184,139,0.09)",
          border: "2px solid #1D9E6A",
          borderRadius: 14, cursor: "pointer", textAlign: "left",
          color: "#F0F4FF",
          boxShadow: "0 0 0 4px rgba(61,184,139,0.1), 0 2px 12px rgba(61,184,139,0.15)",
        }}
      >
        <style>{`@keyframes sdpulse{0%,100%{transform:scale(1);opacity:0.85}50%{transform:scale(2.5);opacity:0}}`}</style>
        <span style={{ position: "relative", width: 10, height: 10, flexShrink: 0 }}>
          <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#1D9E6A", animation: "sdpulse 2s infinite" }} />
          <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#1D9E6A" }} />
        </span>
        <span style={{ flex: 1, fontSize: 14.5, fontWeight: 800, color: "#1D9E6A" }}>
          {current.emoji} {current.label}
        </span>
        <span style={{
          fontSize: 11, color: "rgba(255,255,255,0.4)",
          display: "inline-block",
          transition: "transform 0.2s",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
        }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 200,
          background: "#0A2545",
          border: "1.5px solid rgba(61,184,139,0.3)",
          borderRadius: 14, overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,0.65)",
        }}>
          {STATUSES.map(s => (
            <button key={s.id} onClick={() => { onChange(s.id); setOpen(false); }} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "11px 14px",
              background: s.id === statusId ? "rgba(61,184,139,0.12)" : "transparent",
              border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)",
              color: s.id === statusId ? "#1D9E6A" : "rgba(255,255,255,0.6)",
              fontSize: 13, fontWeight: s.id === statusId ? 800 : 500,
              cursor: "pointer", textAlign: "left",
            }}>
              <span style={{ fontSize: 16 }}>{s.emoji}</span>
              <span style={{ flex: 1 }}>{s.label}</span>
              {s.id === statusId && <span style={{ color: "#1D9E6A", fontSize: 13 }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default StatusDropdown;
