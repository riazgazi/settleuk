import React from "react";

function ReadinessRing({ score, color }) {
  const r = 32, cx = 40, cy = 40;
  const circ = 2 * Math.PI * r;
  const filled = circ * (score / 100);
  return (
    <svg width={cx * 2} height={cy * 2} viewBox={`0 0 ${cx * 2} ${cy * 2}`} style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
      <circle cx={cx} cy={cy - r} r={4} fill="rgba(255,255,255,0.12)" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray 0.8s ease" }} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill="#F0F4FF" fontSize="16" fontWeight="800">{score}</text>
      <text x={cx} y={cy + 9} textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize="8">/100</text>
      <text x={cx} y={cy - r - 10} textAnchor="middle" fontSize="10">🇬🇧</text>
    </svg>
  );
}

export default ReadinessRing;
