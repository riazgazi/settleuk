import React from "react";
import { ALL_STAGE_NAMES } from "../data/stages";

function CountdownCard({ arrivalDays }) { return null; } // merged into StepperBar below

function StepperBar({ stIdx, sg, arrivalDays }) {
  const total = ALL_STAGE_NAMES.length;
  const pct   = Math.round((stIdx / (total - 1)) * 100);
  const arrived = arrivalDays !== null && arrivalDays <= 0;
  const dayColor = arrivalDays === null ? "#2E6BFF"
    : arrivalDays < 20 ? "#CF142B"
    : arrivalDays < 60 ? "#E8A838"
    : "#2E6BFF";

  return (
    <div style={{ marginBottom: 14, background: "#0A2545", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
      {/* Top row: days left (left col) + stage info + % (right) */}
      <div style={{ display: "flex", alignItems: "stretch" }}>
        {/* Left: days box */}
        <div style={{ background: `${dayColor}10`, borderRight: "1px solid rgba(255,255,255,0.06)", padding: "14px 12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: 72, flexShrink: 0 }}>
          {arrived
            ? <span style={{ fontSize: 26 }}>🇬🇧</span>
            : <>
                <div style={{ fontSize: 32, fontWeight: 900, color: dayColor, lineHeight: 1 }}>{arrivalDays ?? "–"}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 4, textAlign: "center", lineHeight: 1.3 }}>Days to<br/>arrive</div>
              </>
          }
        </div>
        {/* Right: stage name + step + % */}
        <div style={{ flex: 1, padding: "12px 14px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 3 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#F0F4FF" }}>{ALL_STAGE_NAMES[stIdx]}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>Step {stIdx + 1} of {total}</div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#3B82F6" }}>{pct}% Complete</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

      {/* Bottom: 7-stage stepper */}
      <div style={{ padding: "12px 14px 10px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {ALL_STAGE_NAMES.map((name, i) => {
            const done = i < stIdx, cur = i === stIdx;
            const showLabel = done || cur || i === total - 1;
            return (
              <React.Fragment key={i}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: "none" }}>
                  <div style={{
                    width: cur ? 22 : 18, height: cur ? 22 : 18, borderRadius: "50%",
                    background: done ? "#2E6BFF" : cur ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)",
                    border: `2px solid ${done ? "#2E6BFF" : cur ? "#7C3AED" : "rgba(255,255,255,0.13)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: cur ? 8.5 : 7.5, fontWeight: 800,
                    color: done ? "#fff" : cur ? "#A78BFA" : "rgba(255,255,255,0.22)",
                    boxShadow: cur ? "0 0 0 3px rgba(124,58,237,0.2)" : "none",
                    flexShrink: 0,
                  }}>
                    {done ? "✓" : i === total - 1 ? "🇬🇧" : i + 1}
                  </div>
                  <span style={{
                    fontSize: 7, fontWeight: cur ? 800 : 500, textAlign: "center", whiteSpace: "nowrap",
                    color: cur ? "#A78BFA" : done ? "#3B82F6" : "rgba(255,255,255,0.2)",
                    visibility: showLabel ? "visible" : "hidden",
                  }}>
                    {i === total - 1 ? "UK" : name}
                  </span>
                </div>
                {i < total - 1 && (
                  <div style={{ flex: 1, height: 2, background: done ? "#2E6BFF" : "rgba(255,255,255,0.09)", marginBottom: 14 }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StepperBar;
