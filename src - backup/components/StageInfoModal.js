import React from "react";

function StageInfoModal({ stage, onClose }) {
  import { insightMeta } from "../../utils/insightMeta";
  const priorityTasks = stage.tasks.filter(t => t.priority).slice(0, 4);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 999, display: "flex", alignItems: "flex-end", justifyContent: "center", fontFamily: "Arial, sans-serif" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ width: "100%", maxWidth: 460, background: "#0A2545", borderRadius: "24px 24px 0 0", padding: "22px 22px 26px", border: "1px solid rgba(255,255,255,0.1)", maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ width: 40, height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 4, margin: "0 auto 16px" }} />

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
          <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: "#F0F4FF" }}>{stage.name}</h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>
        <p style={{ margin: "0 0 16px", fontSize: 12.5, color: "rgba(255,255,255,0.42)", lineHeight: 1.6 }}>{stage.emotion}</p>

        {/* Deadline chip */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(232,168,56,0.12)", border: "1px solid rgba(232,168,56,0.3)", borderRadius: 20, padding: "5px 12px", marginBottom: 18, fontSize: 11.5, fontWeight: 700, color: "#E8A838" }}>
          ⏱ {stage.deadline}
        </div>

        {/* Key things to do */}
        <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7, color: "rgba(255,255,255,0.28)", marginBottom: 9 }}>What you need to do</div>
        {priorityTasks.map((t, i) => (
          <div key={t.id} style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 9 }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(74,144,217,0.15)", border: "1.5px solid #4A90D9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#4A90D9", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
            <span style={{ fontSize: 13, color: "#F0F4FF", lineHeight: 1.4 }}>{t.text}</span>
          </div>
        ))}

        {/* Insights */}
        {stage.insights && stage.insights.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7, color: "rgba(255,255,255,0.28)", marginBottom: 9 }}>Good to know</div>
            {stage.insights.map((ins, i) => {
              const m = insightMeta(ins.type);
              return (
                <div key={i} style={{ display: "flex", gap: 9, padding: "10px 12px", marginBottom: 7, background: m.bg, border: `1px solid ${m.border}`, borderRadius: 10 }}>
                  <span style={{ fontSize: 15, flexShrink: 0 }}>{m.icon}</span>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: m.color, marginBottom: 1 }}>{ins.title}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", lineHeight: 1.4 }}>{ins.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button onClick={onClose} style={{ width: "100%", padding: "12px 0", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "rgba(255,255,255,0.6)", fontSize: 13.5, fontWeight: 700, cursor: "pointer", marginTop: 18 }}>
          Got it
        </button>
      </div>
    </div>
  );
}

export default StageInfoModal;
