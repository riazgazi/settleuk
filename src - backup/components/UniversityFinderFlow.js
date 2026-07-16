import React, { useState } from "react";
import { UNI_BANDS_BACHELOR, UNI_BANDS_MASTERS, SEARCH_LINKS } from "../data/universities";
import { getUniBand } from "../utils/uniBand";

function UniversityFinderFlow({ onClose, onSaveProfile, savedAcademic }) {
  const [step, setStep] = useState("intro");
  const [level, setLevel] = useState(savedAcademic?.level || "");
  const [form, setForm] = useState(savedAcademic || {
    ssc: "", hsc: "", bachelorSubject: "", cgpa: "", ielts: "", course: "", budget: "",
  });

  const inputStyle = {
    width: "100%", padding: "11px 14px", marginBottom: 14,
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 10, color: "#fff", fontSize: 14, outline: "none",
    fontFamily: "inherit", boxSizing: "border-box",
  };
  const label = (txt) => <label style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", display: "block", marginBottom: 6, fontWeight: 600 }}>{txt}</label>;
  const btn = (bg, disabled) => ({
    width: "100%", padding: "13px 0", background: disabled ? "#2a2a2a" : bg, border: "none",
    borderRadius: 12, color: disabled ? "rgba(255,255,255,0.3)" : "#fff", fontSize: 14.5, fontWeight: 800,
    cursor: disabled ? "default" : "pointer",
  });

  const gpaOk = level === "bachelor"
    ? form.ssc && form.hsc
    : level === "masters"
    ? form.bachelorSubject && form.cgpa
    : false;

  const relevantGpa = level === "masters" ? parseFloat(form.cgpa) : (parseFloat(form.ssc) + parseFloat(form.hsc)) / 2;
  const band = (level && gpaOk) ? getUniBand(level, relevantGpa) : null;

  const handleSkip = () => onClose(false);
  const handleSaveAndClose = () => { onSaveProfile({ ...form, level }); onClose(true); };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 999, display: "flex", alignItems: "flex-end", justifyContent: "center", fontFamily: "Arial, sans-serif" }} onClick={(e) => { if (e.target === e.currentTarget) handleSkip(); }}>
      <div style={{ width: "100%", maxWidth: 460, background: "#0A2545", borderRadius: "24px 24px 0 0", padding: "24px 22px 28px", border: "1px solid rgba(255,255,255,0.1)", maxHeight: "88vh", overflowY: "auto" }}>

        <div style={{ width: 40, height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 4, margin: "0 auto 18px" }} />

        {step === "intro" && (
          <div>
            <div style={{ fontSize: 34, marginBottom: 10, textAlign: "center" }}>🎓</div>
            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 800, marginBottom: 8, textAlign: "center" }}>Get Personalized University Recommendations</h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.6, marginBottom: 22, textAlign: "center" }}>
              Complete your academic profile to receive university and course suggestions based on your grades.
            </p>
            <button onClick={() => setStep("level")} style={btn("#1D9E6A")}>🔵 Complete Profile</button>
            <button onClick={handleSkip} style={{ ...btn("transparent"), marginTop: 10, border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }}>⚪ Skip for Now</button>
          </div>
        )}

        {step === "level" && (
          <div>
            <button onClick={() => setStep("intro")} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13, marginBottom: 14, padding: 0 }}>← Back</button>
            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Which level are you applying for?</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12.5, marginBottom: 18 }}>This determines which grades we'll ask for next.</p>

            <button onClick={() => { setLevel("bachelor"); setStep("form"); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px", marginBottom: 10, background: level === "bachelor" ? "rgba(61,184,139,0.12)" : "rgba(255,255,255,0.05)", border: level === "bachelor" ? "1.5px solid #1D9E6A" : "1.5px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "#fff", cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: 22 }}>🎓</span>
              <span><div style={{ fontWeight: 800, fontSize: 14 }}>Bachelor's Degree</div><div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)" }}>Undergraduate — based on SSC & HSC GPA</div></span>
            </button>

            <button onClick={() => { setLevel("masters"); setStep("form"); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px", background: level === "masters" ? "rgba(61,184,139,0.12)" : "rgba(255,255,255,0.05)", border: level === "masters" ? "1.5px solid #1D9E6A" : "1.5px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "#fff", cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: 22 }}>📘</span>
              <span><div style={{ fontWeight: 800, fontSize: 14 }}>Master's Degree</div><div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)" }}>Postgraduate — based on Bachelor's CGPA</div></span>
            </button>

            <button onClick={handleSkip} style={{ ...btn("transparent"), marginTop: 16, border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>⚪ Skip for Now</button>
          </div>
        )}

        {step === "form" && (
          <div>
            <button onClick={() => setStep("level")} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13, marginBottom: 14, padding: 0 }}>← Back</button>
            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
              {level === "masters" ? "📘 Master's Profile" : "🎓 Bachelor's Profile"}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12.5, marginBottom: 18 }}>Fields marked are used to estimate university bands.</p>

            {level === "bachelor" && (
              <>
                {label("SSC GPA (out of 5.0) *")}
                <input type="number" step="0.01" min="0" max="5" value={form.ssc} onChange={e => setForm(f => ({ ...f, ssc: e.target.value }))} placeholder="e.g. 4.83" style={inputStyle} />
                {label("HSC GPA (out of 5.0) *")}
                <input type="number" step="0.01" min="0" max="5" value={form.hsc} onChange={e => setForm(f => ({ ...f, hsc: e.target.value }))} placeholder="e.g. 5.00" style={inputStyle} />
              </>
            )}

            {level === "masters" && (
              <>
                {label("Bachelor's Subject *")}
                <input value={form.bachelorSubject} onChange={e => setForm(f => ({ ...f, bachelorSubject: e.target.value }))} placeholder="e.g. BBA, CSE, Civil Engineering" style={inputStyle} />
                {label("Bachelor's CGPA (out of 4.0) *")}
                <input type="number" step="0.01" min="0" max="4" value={form.cgpa} onChange={e => setForm(f => ({ ...f, cgpa: e.target.value }))} placeholder="e.g. 3.45" style={inputStyle} />
              </>
            )}

            {label("IELTS Score (optional)")}
            <input type="number" step="0.5" min="0" max="9" value={form.ielts} onChange={e => setForm(f => ({ ...f, ielts: e.target.value }))} placeholder="e.g. 6.5" style={inputStyle} />

            {label("Preferred Course / Subject (optional)")}
            <input value={form.course} onChange={e => setForm(f => ({ ...f, course: e.target.value }))} placeholder="e.g. Computer Science, MBA" style={inputStyle} />

            {label("Budget per year, £ (optional)")}
            <input type="number" min="0" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} placeholder="e.g. 15000" style={inputStyle} />

            <button disabled={!gpaOk} onClick={() => setStep("results")} style={{ ...btn("#1D9E6A", !gpaOk), marginTop: 6 }}>See My Recommendations →</button>
            <button onClick={handleSkip} style={{ ...btn("transparent"), marginTop: 10, border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>⚪ Skip for Now</button>
          </div>
        )}

        {step === "results" && band && (
          <div>
            <button onClick={() => setStep("form")} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13, marginBottom: 14, padding: 0 }}>← Edit profile</button>

            <div style={{ background: "rgba(61,184,139,0.08)", border: "1px solid rgba(61,184,139,0.3)", borderRadius: 16, padding: "16px", marginBottom: 16, textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Your Band</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#1D9E6A", marginBottom: 6 }}>{band.label}</div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{band.desc}</div>
            </div>

            <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>Universities to explore</h3>
            <div style={{ marginBottom: 18 }}>
              {band.examples.map((u, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginBottom: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10 }}>
                  <span style={{ fontSize: 15 }}>🏛️</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#F0F4FF" }}>{u}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(232,168,56,0.07)", border: "1px solid rgba(232,168,56,0.2)", borderRadius: 12, padding: "10px 14px", marginBottom: 18, fontSize: 11.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
              💡 This is a rough estimate, not an admission guarantee. Always check each university's official entry requirements.
            </div>

            <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>Search real courses & universities</h3>
            {SEARCH_LINKS.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", marginBottom: 7, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, textDecoration: "none", color: "#F0F4FF" }}>
                <span style={{ fontSize: 17 }}>{s.icon}</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{s.name}</span>
                <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>↗</span>
              </a>
            ))}

            <button onClick={handleSaveAndClose} style={{ ...btn("#1D9E6A"), marginTop: 16 }}>Save Profile & Continue ✓</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UniversityFinderFlow;
