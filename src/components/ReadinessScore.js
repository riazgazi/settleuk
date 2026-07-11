import React from "react";
import { ALL_STAGE_NAMES, STAGES } from "../data/stages";
import { DOCS } from "../data/documents";
import ReadinessRing from "./ReadinessRing";

function ReadinessScore({ stIdx, taskDone, docChecked, sg }) {
  const totalTasks     = STAGES.reduce((s, st) => s + st.tasks.length, 0);
  const completedTasks = Object.values(taskDone).filter(Boolean).length;
  const completedDocs  = Object.values(docChecked).filter(Boolean).length;
  const score = Math.min(100,
    Math.round((completedTasks / totalTasks) * 50) +
    Math.round((completedDocs  / DOCS.length) * 30) +
    Math.round((stIdx / (ALL_STAGE_NAMES.length - 1)) * 20)
  );

  const label      = score >= 80 ? "Excellent" : score >= 60 ? "On Track" : score >= 40 ? "Good Start" : "Getting Started";
  const labelColor = score >= 80 ? "#1D9E6A"   : score >= 60 ? "#4A90D9"  : score >= 40 ? "#E8A838"    : "#6B8FA8";
  const nextTarget = score >= 80 ? null        : score >= 60 ? 80         : score >= 40 ? 60           : 40;

  const hints = [];
  if (nextTarget) {
    if (completedTasks < 3) hints.push("Complete priority tasks in Tasks tab");
    if (completedDocs  < 4) hints.push("Mark key documents as ready in Docs tab");
    if (stIdx < 2)          hints.push("Progress your application stage");
  }

  const barGradient = score >= 80
    ? "linear-gradient(90deg,#1D9E6A,#5BE8AC)"
    : score >= 60
    ? "linear-gradient(90deg,#4A90D9,#1D9E6A)"
    : score >= 40
    ? "linear-gradient(90deg,#E8A838,#4A90D9)"
    : "linear-gradient(90deg,#534AB7,#E8A838)";

  return (
    <div style={{
      marginBottom: 16, padding: "14px 16px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      display: "flex", gap: 14, alignItems: "center",
    }}>
      <ReadinessRing score={score} color={labelColor} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.28)", marginBottom: 4 }}>
          Readiness Score
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: labelColor, marginBottom: 7, lineHeight: 1.3 }}>
          {score} of 100 points
          <span style={{
            display: "inline-block", marginLeft: 8,
            fontSize: 10, fontWeight: 700,
            color: labelColor, background: labelColor + "20",
            padding: "1px 8px", borderRadius: 20,
          }}>{label}</span>
        </div>

        <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 5, overflow: "hidden", marginBottom: 7 }}>
          <div style={{ height: "100%", width: `${score}%`, background: barGradient, borderRadius: 5, transition: "width 0.6s ease" }} />
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: hints.length ? 8 : 0 }}>
          <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.28)" }}>✅ {completedTasks} tasks</span>
          <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.28)" }}>📄 {completedDocs} docs</span>
        </div>

        {nextTarget && hints.length > 0 && (
          <div style={{ padding: "7px 10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 9 }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: "rgba(255,255,255,0.22)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
              To reach {nextTarget}/100
            </div>
            {hints.slice(0, 2).map((h, i) => (
              <div key={i} style={{ fontSize: 10.5, color: "rgba(255,255,255,0.38)", display: "flex", gap: 5, marginBottom: i < hints.length - 1 ? 3 : 0 }}>
                <span style={{ color: sg.accentBtn }}>▸</span>{h}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReadinessScore;
