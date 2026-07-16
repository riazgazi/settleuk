import React from "react";

function QuickCard({ icon, title, sub, pct, onClick }) {
  return (
    <div onClick={onClick} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px", cursor: "pointer" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: pct !== undefined ? 9 : 0 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.38)" }}>{sub}</div>
        </div>
      </div>
      {pct !== undefined && (
        <>
          <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden", marginBottom: 3 }}>
            <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#1D9E6A" : "linear-gradient(90deg,#534AB7,#1D9E6A)", borderRadius: 3, transition: "width 0.4s" }} />
          </div>
          <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.25)", textAlign: "right" }}>{pct}%</div>
        </>
      )}
    </div>
  );
}

export default QuickCard;
