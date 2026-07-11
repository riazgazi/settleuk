import React, { useState, useEffect } from "react";
import { COST_FIXED, UNI_TUITION_MAP, EXPENSE_CAT_META } from "../data/costs";
import { fmtGBP, gbp2bdt, formatMonth } from "../utils/format";
import { loadLS, saveLS } from "../hooks/useLocalStorage";

function CostsTab() {
  const [panel, setPanel] = useState("calc");

  // ── Calculator state ──
  const [duration, setDuration] = useState(2);
  const [dependents, setDependents] = useState(0);
  const [uniPreset, setUniPreset] = useState("custom");
  const [tuition, setTuition] = useState(28000);              // TOTAL tuition for full course
  const [tuitionPaidPct, setTuitionPaidPct] = useState(100);   // % of tuition paid upfront
  const [rate, setRate] = useState(153);

  // ── Tracker state ──
  const [expenses, setExpenses] = useState(() => loadLS("settleuk_expenses", []));
  const [phase, setPhase] = useState("all");
  const [cat, setCat] = useState("all");
  const [expName, setExpName] = useState("");
  const [expAmt, setExpAmt] = useState("");
  const [expCat, setExpCat] = useState("visa");
  const [expPhase, setExpPhase] = useState("bd");

  useEffect(() => { saveLS("settleuk_expenses", expenses); }, [expenses]);

  useEffect(() => {
    if (uniPreset !== "custom" && UNI_TUITION_MAP[uniPreset]) {
      setTuition(UNI_TUITION_MAP[uniPreset] * duration);
    }
  }, [uniPreset, duration]);

  // ── Calculator derived values ──
  const totalTuition    = parseFloat(tuition) || 0;          // total tuition for WHOLE course
  const dur              = duration;
  const dep              = dependents;
  const ihsDur            = dur + 0.5;  // IHS visa duration = course length + 0.5 year
  const ihsTotal          = 776 * ihsDur * (1 + dep);
  const airTotal          = 600 * (1 + dep);
  const tuitionPayable    = totalTuition * (tuitionPaidPct / 100); // amount paid NOW based on %
  const tuitionRemaining  = totalTuition - tuitionPayable;
  const depVisa           = dep * 490;
  const depIHS            = dep * 776 * ihsDur;
  const fixedTotal        = COST_FIXED.ielts + COST_FIXED.visa + ihsTotal + COST_FIXED.cas + airTotal + COST_FIXED.deposit + COST_FIXED.bio;
  const variableTotal     = tuitionPayable + depVisa + depIHS;
  const grandTotal        = fixedTotal + variableTotal;

  const row = (icon, dotClass, label, sub, gbp) => ({ icon, dotClass, label, sub, gbp });
  const rows = [
    row("●", "", "IELTS Exam Fee", "British Council / IDP", COST_FIXED.ielts),
    row("●", "", "UK Visa Application", "Student visa fee", COST_FIXED.visa),
    row("●", "", "Immigration Health Surcharge", `£776/yr × ${ihsDur} yr${ihsDur > 1 ? "s" : ""} × ${1 + dep} person${1 + dep > 1 ? "s" : ""}`, ihsTotal),
    row("●", "", "CAS & Admin Fees", "University document charges", COST_FIXED.cas),
    row("●", "", "Air Ticket (DAC → UK)", dep ? `Applicant + ${dep} dep.` : "Applicant only", airTotal),
    row("●", "", "Initial Cash Deposit", "UKVI savings evidence", COST_FIXED.deposit),
    row("●", "", "Biometric (eVisa)", "Visa application centre", COST_FIXED.bio),
  ];
  const variableRows = [
    row("◆", "variable", `Tuition Payment (${tuitionPaidPct}%)`, `£${totalTuition.toLocaleString()} total × ${tuitionPaidPct}%`, tuitionPayable),
    row("◇", "optional", "Dependent Visa(s)", dep ? `£490 × ${dep} dependent${dep > 1 ? "s" : ""}` : "N/A", depVisa),
    row("◇", "optional", "Dependent IHS", dep ? `£776 × ${ihsDur}yr × ${dep} dep.` : "N/A", depIHS),
  ];

  // ── Tracker derived values ──
  const filteredExpenses = expenses.filter(e => (phase === "all" || e.phase === phase) && (cat === "all" || e.cat === cat));
  const byMonth = {};
  [...filteredExpenses].reverse().forEach(exp => {
    const m = exp.date.slice(3);
    if (!byMonth[m]) byMonth[m] = [];
    byMonth[m].push(exp);
  });

  const totalSpent = expenses.reduce((s, e) => s + e.amt, 0);
  const preSpent    = expenses.filter(e => e.phase === "bd").reduce((s, e) => s + e.amt, 0);
  const ukSpent     = expenses.filter(e => e.phase === "uk").reduce((s, e) => s + e.amt, 0);
  const budgetPct   = grandTotal > 0 ? Math.min(100, (totalSpent / grandTotal) * 100) : 0;
  const remaining   = Math.max(0, grandTotal - totalSpent);
  const barColor    = budgetPct < 50 ? "#00c896" : budgetPct < 80 ? "#f59e0b" : "#ef4444";

  const catTotals = {};
  expenses.forEach(e => { catTotals[e.cat] = (catTotals[e.cat] || 0) + e.amt; });
  const maxCat = Math.max(...Object.values(catTotals), 1);

  const addExpense = () => {
    const amt = parseFloat(expAmt);
    if (!expName.trim() || !amt || amt <= 0) return;
    setExpenses(p => [...p, {
      id: Date.now(), name: expName.trim(), amt, cat: expCat, phase: expPhase,
      date: new Date().toLocaleDateString("en-GB"),
    }]);
    setExpName(""); setExpAmt("");
  };
  const deleteExpense = (id) => setExpenses(p => p.filter(e => e.id !== id));

  const C = {
    surface: "#161b22", surface2: "#1c2330", border: "#2a3441",
    green: "#00c896", greenDim: "rgba(0,200,150,0.12)",
    blue: "#4a9eff", blueDim: "rgba(74,158,255,0.12)",
    amber: "#f59e0b", red: "#ef4444",
    text: "#e6edf3", textMuted: "#7d8590", textDim: "#4d5560",
  };
  const card = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 14 };
  const selectStyle = {
    width: "100%", background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8,
    color: C.text, fontSize: 13, padding: "8px 10px", fontFamily: "inherit", outline: "none",
  };
  const fInput = { flex: 1, background: "#0d1117", border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, padding: "9px 10px", fontFamily: "inherit", outline: "none", minWidth: 0 };

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        <div onClick={() => setPanel("calc")} style={{
          flex: 1, padding: "10px 8px", background: panel === "calc" ? C.greenDim : C.surface2,
          border: `1px solid ${panel === "calc" ? C.green : C.border}`, borderRadius: 10,
          cursor: "pointer", fontSize: 12, fontWeight: 700, textAlign: "center",
          color: panel === "calc" ? C.green : C.textMuted,
        }}>🧮 Calculate Your Cost</div>
        <div onClick={() => setPanel("track")} style={{
          flex: 1, padding: "10px 8px", background: panel === "track" ? C.greenDim : C.surface2,
          border: `1px solid ${panel === "track" ? C.green : C.border}`, borderRadius: 10,
          cursor: "pointer", fontSize: 12, fontWeight: 700, textAlign: "center",
          color: panel === "track" ? C.green : C.textMuted,
        }}>📊 Expense Tracker</div>
      </div>

      {panel === "calc" && (
        <div>
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>📋 Your Criteria</div>
              <div style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: C.greenDim, color: C.green, border: "1px solid rgba(0,200,150,.3)" }}>Set your plan</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 4 }}>
              <div>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Course Duration</div>
                <select value={duration} onChange={e => setDuration(parseInt(e.target.value))} style={selectStyle}>
                  <option value={1}>1 Year</option>
                  <option value={2}>2 Years</option>
                  <option value={3}>3 Years</option>
                  <option value={4}>4 Years</option>
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Dependent?</div>
                <select value={dependents} onChange={e => setDependents(parseInt(e.target.value))} style={selectStyle}>
                  <option value={0}>No Dependent</option>
                  <option value={1}>1 Dependent</option>
                  <option value={2}>2 Dependents</option>
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>University (tuition preset)</div>
                <select value={uniPreset} onChange={e => setUniPreset(e.target.value)} style={selectStyle}>
                  <option value="custom">Enter manually below</option>
                  <option value="northumbria">Northumbria University (~£12,000/yr)</option>
                  <option value="manchester">University of Manchester (~£22,000/yr)</option>
                  <option value="sheffield">University of Sheffield (~£18,000/yr)</option>
                  <option value="coventry">Coventry University (~£13,500/yr)</option>
                  <option value="huddersfield">University of Huddersfield (~£14,000/yr)</option>
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Total Tuition Fee (£ for full course)</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="number" value={tuition} onChange={e => setTuition(e.target.value)} style={{ flex: 1, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, padding: "8px 10px", fontFamily: "inherit", outline: "none" }} />
                  <div style={{ background: C.greenDim, border: "1px solid rgba(0,200,150,.3)", color: C.green, fontSize: 11, fontWeight: 700, padding: "0 10px", borderRadius: 8, display: "flex", alignItems: "center" }}>£ total</div>
                </div>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>First-Time Payment (% of total tuition)</div>
                <select value={tuitionPaidPct} onChange={e => setTuitionPaidPct(parseInt(e.target.value))} style={selectStyle}>
                  <option value={50}>50%</option>
                  <option value={60}>60%</option>
                  <option value={70}>70%</option>
                  <option value={100}>100% (full course)</option>
                </select>
                <div style={{ fontSize: 10.5, color: C.textDim, marginTop: 5, lineHeight: 1.5 }}>
                  💡 Calculation is based on your selected %. Select <strong style={{ color: C.green }}>100%</strong> to see the full course cost.
                </div>
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>📌 Cost Breakdown</div>
              <div style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: C.greenDim, color: C.green, border: "1px solid rgba(0,200,150,.3)" }}>Auto-calculated</div>
            </div>

            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 13, top: 4, bottom: 4, width: 2, backgroundImage: `repeating-linear-gradient(to bottom, ${C.border} 0, ${C.border} 6px, transparent 6px, transparent 12px)` }} />

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th colSpan={2} style={{ textAlign: "left", paddingLeft: 24, fontSize: 10, fontWeight: 600, color: C.textDim, textTransform: "uppercase", letterSpacing: 0.5, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>Item</th>
                    <th style={{ textAlign: "right", fontSize: 10, fontWeight: 600, color: C.green, textTransform: "uppercase", letterSpacing: 0.5, paddingBottom: 8, borderBottom: `1px solid ${C.border}`, minWidth: 72 }}>GBP (£)</th>
                    <th style={{ textAlign: "right", fontSize: 10, fontWeight: 600, color: C.blue, textTransform: "uppercase", letterSpacing: 0.5, paddingBottom: 8, borderBottom: `1px solid ${C.border}`, minWidth: 90 }}>BDT (৳)</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td style={{ width: 28, textAlign: "center", padding: "9px 0", borderTop: i > 0 ? `1px solid rgba(42,52,65,.5)` : "none" }}>
                        <div style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${C.green}`, background: "#0d1117", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 7, color: C.green, position: "relative", zIndex: 1 }}>{r.icon}</div>
                      </td>
                      <td style={{ paddingLeft: 8, padding: "9px 0 9px 8px", borderTop: i > 0 ? `1px solid rgba(42,52,65,.5)` : "none" }}>
                        <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{r.label}</div>
                        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>{r.sub}</div>
                      </td>
                      <td style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: C.green, whiteSpace: "nowrap", paddingRight: 8, borderTop: i > 0 ? `1px solid rgba(42,52,65,.5)` : "none" }}>{fmtGBP(r.gbp)}</td>
                      <td style={{ textAlign: "right", fontSize: 11, color: C.blue, whiteSpace: "nowrap", padding: "9px 0", borderTop: i > 0 ? `1px solid rgba(42,52,65,.5)` : "none" }}>{gbp2bdt(r.gbp, rate)}</td>
                    </tr>
                  ))}

                  <tr>
                    <td colSpan={4} style={{ padding: "10px 0 6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: 0.6 }}>
                        <span style={{ flex: 1, height: 1, background: C.border }} />
                        Variable / Recurring
                        <span style={{ flex: 1, height: 1, background: C.border }} />
                      </div>
                    </td>
                  </tr>

                  {variableRows.map((r, i) => {
                    const dotColor = r.dotClass === "variable" ? C.blue : C.amber;
                    return (
                      <tr key={i}>
                        <td style={{ width: 28, textAlign: "center", padding: "9px 0" }}>
                          <div style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${dotColor}`, background: "#0d1117", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 7, color: dotColor, position: "relative", zIndex: 1 }}>{r.icon}</div>
                        </td>
                        <td style={{ padding: "9px 0 9px 8px" }}>
                          <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{r.label}</div>
                          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>{r.sub}</div>
                        </td>
                        <td style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: C.green, whiteSpace: "nowrap", paddingRight: 8 }}>{fmtGBP(r.gbp)}</td>
                        <td style={{ textAlign: "right", fontSize: 11, color: C.blue, whiteSpace: "nowrap", padding: "9px 0" }}>{gbp2bdt(r.gbp, rate)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", gap: 14, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 11, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}><span style={{ color: C.green }}>●</span> Fixed</span>
              <span style={{ fontSize: 11, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}><span style={{ color: C.blue }}>◆</span> Variable</span>
              <span style={{ fontSize: 11, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}><span style={{ color: C.amber }}>◇</span> If applicable</span>
            </div>
          </div>

          <div style={{ background: "linear-gradient(135deg, rgba(0,200,150,.08), rgba(74,158,255,.06))", border: "1px solid rgba(0,200,150,.25)", borderRadius: 12, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>ESTIMATED TOTAL COST</div>
                <div style={{ fontSize: 11, color: C.textDim }}>{dur}-yr · {dep === 0 ? "No dependent" : `${dep} dependent${dep > 1 ? "s" : ""}`}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.green }}>{fmtGBP(grandTotal)}</div>
                <div style={{ fontSize: 13, color: C.blue, marginTop: 1 }}>{gbp2bdt(grandTotal, rate)}</div>
              </div>
            </div>
            <hr style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: "10px 0" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10 }}>
                <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 3 }}>FIXED COSTS</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.green }}>{fmtGBP(fixedTotal)}</div>
                <div style={{ fontSize: 11, color: C.blue }}>{gbp2bdt(fixedTotal, rate)}</div>
              </div>
              <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10 }}>
                <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 3 }}>TUITION + DEP</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.blue }}>{fmtGBP(variableTotal)}</div>
                <div style={{ fontSize: 11, color: C.blue }}>{gbp2bdt(variableTotal, rate)}</div>
              </div>
            </div>
            {tuitionRemaining > 0 && (
              <div style={{ marginTop: 10, background: "rgba(232,168,56,0.08)", border: "1px solid rgba(232,168,56,0.25)", borderRadius: 8, padding: "8px 10px", fontSize: 11, color: C.textMuted, lineHeight: 1.5 }}>
                ⚠️ <strong style={{ color: "#E8A838" }}>Remaining tuition not included above:</strong> {fmtGBP(tuitionRemaining)} ({gbp2bdt(tuitionRemaining, rate)}) — payable later during your course.
              </div>
            )}
            <div style={{ fontSize: 11, color: C.textMuted, textAlign: "center", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              💱 £1 =
              <input type="number" value={rate} onChange={e => setRate(parseFloat(e.target.value) || 153)} style={{ width: 52, background: "none", border: "none", borderBottom: `1px solid ${C.border}`, color: C.blue, fontSize: 11, textAlign: "center", padding: "0 2px", fontFamily: "inherit", outline: "none" }} />
              BDT
            </div>
          </div>
        </div>
      )}

      {panel === "track" && (
        <div>
          <div style={{ display: "flex", background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 3, gap: 3, marginBottom: 14 }}>
            {[["all", "🌐 All Journey", C.green], ["bd", "🇧🇩 Pre-Arrival", C.amber], ["uk", "🇬🇧 In UK", C.blue]].map(([id, lbl, color]) => (
              <button key={id} onClick={() => setPhase(id)} style={{
                flex: 1, padding: "8px 4px", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 600,
                cursor: "pointer", background: phase === id ? C.surface : "none",
                color: phase === id ? color : C.textMuted,
                boxShadow: phase === id ? "0 1px 4px rgba(0,0,0,.4)" : "none",
              }}>{lbl}</button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
            <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 8px" }}>
              <div style={{ fontSize: 9, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>Total Spent</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.green }}>{fmtGBP(totalSpent)}</div>
              <div style={{ fontSize: 10, color: C.textMuted, marginTop: 1 }}>{gbp2bdt(totalSpent, rate)}</div>
            </div>
            <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 8px" }}>
              <div style={{ fontSize: 9, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>🇧🇩 Pre-Arrival</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.amber }}>{fmtGBP(preSpent)}</div>
              <div style={{ fontSize: 10, color: C.textMuted, marginTop: 1 }}>{gbp2bdt(preSpent, rate)}</div>
            </div>
            <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 8px" }}>
              <div style={{ fontSize: 9, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>🇬🇧 In UK</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.blue }}>{fmtGBP(ukSpent)}</div>
              <div style={{ fontSize: 10, color: C.textMuted, marginTop: 1 }}>{gbp2bdt(ukSpent, rate)}</div>
            </div>
          </div>

          <div style={{ ...card, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Budget vs Estimated</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 11, color: C.textMuted }}>
              <span>Spent: {fmtGBP(totalSpent)}</span>
              <span>Budget: {fmtGBP(grandTotal)}</span>
            </div>
            <div style={{ height: 6, background: C.surface2, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${budgetPct}%`, background: barColor, borderRadius: 3, transition: "width 0.5s ease" }} />
            </div>
            <div style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}>{budgetPct.toFixed(1)}% used · {fmtGBP(remaining)} remaining</div>
          </div>

          <div style={{ ...card, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>By Category</div>
            {Object.keys(catTotals).length === 0 ? (
              <div style={{ fontSize: 12, color: C.textDim, textAlign: "center", padding: "8px 0" }}>No expenses yet</div>
            ) : (
              Object.entries(catTotals).sort((a, b) => b[1] - a[1]).map(([c, amt]) => {
                const meta = EXPENSE_CAT_META[c] || EXPENSE_CAT_META.other;
                const pct = (amt / maxCat * 100).toFixed(0);
                return (
                  <div key={c} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: meta.color, flexShrink: 0 }} />
                    <div style={{ fontSize: 12, color: C.textMuted, width: 70, flexShrink: 0 }}>{meta.icon} {c}</div>
                    <div style={{ flex: 1, height: 5, background: C.surface2, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: meta.color, borderRadius: 3, transition: "width 0.5s ease" }} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, width: 52, textAlign: "right", flexShrink: 0, color: meta.color }}>{fmtGBP(amt)}</div>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 12, paddingBottom: 2 }}>
            {[["all", "All"], ["visa", "🛂 Visa"], ["ielts", "📝 IELTS"], ["travel", "✈️ Travel"], ["tuition", "🎓 Tuition"], ["living", "🏠 Living"], ["food", "🍜 Food"], ["mobile", "📱 Mobile"], ["transport", "🚌 Transport"], ["health", "💊 Health"], ["other", "📦 Other"]].map(([id, lbl]) => (
              <div key={id} onClick={() => setCat(id)} style={{
                flex: "0 0 auto", padding: "5px 12px", background: cat === id ? C.greenDim : C.surface2,
                border: `1px solid ${cat === id ? C.green : C.border}`, borderRadius: 20, cursor: "pointer",
                fontSize: 11, fontWeight: 600, color: cat === id ? C.green : C.textMuted, whiteSpace: "nowrap",
              }}>{lbl}</div>
            ))}
          </div>

          <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>+ Log New Expense</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input value={expName} onChange={e => setExpName(e.target.value)} placeholder="Description (e.g. IELTS registration)" style={{ ...fInput, flex: 2 }} />
              <div style={{ position: "relative", flex: 1 }}>
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, fontWeight: 700, color: C.green, pointerEvents: "none" }}>£</span>
                <input type="number" step="0.01" value={expAmt} onChange={e => setExpAmt(e.target.value)} placeholder="0.00" style={{ width: "100%", background: "#0d1117", border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, padding: "9px 10px 9px 22px", fontFamily: "inherit", outline: "none" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <select value={expCat} onChange={e => setExpCat(e.target.value)} style={fInput}>
                <option value="visa">🛂 Visa</option>
                <option value="ielts">📝 IELTS</option>
                <option value="travel">✈️ Travel</option>
                <option value="tuition">🎓 Tuition</option>
                <option value="living">🏠 Living</option>
                <option value="food">🍜 Food</option>
                <option value="mobile">📱 Mobile</option>
                <option value="transport">🚌 Transport</option>
                <option value="health">💊 Health</option>
                <option value="other">📦 Other</option>
              </select>
              <select value={expPhase} onChange={e => setExpPhase(e.target.value)} style={fInput}>
                <option value="bd">🇧🇩 Pre-Arrival (BD)</option>
                <option value="uk">🇬🇧 In UK</option>
              </select>
              <button onClick={addExpense} style={{ background: C.green, color: "#000", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>Add</button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredExpenses.length === 0 ? (
              <div style={{ textAlign: "center", padding: "28px 16px", color: C.textMuted }}>
                <div style={{ fontSize: 38, marginBottom: 8 }}>💳</div>
                <p style={{ fontSize: 13, lineHeight: 1.5 }}>No expenses logged yet.<br />Track from your first IELTS payment<br />all the way through life in the UK.</p>
              </div>
            ) : (
              Object.entries(byMonth).map(([month, exps]) => (
                <div key={month}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: 0.6, padding: "6px 0 4px", marginTop: 4 }}>{formatMonth(month)}</div>
                  {exps.map(exp => {
                    const meta = EXPENSE_CAT_META[exp.cat] || EXPENSE_CAT_META.other;
                    return (
                      <div key={exp.id} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 12, padding: "11px 12px", display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0, background: meta.color + "22" }}>{meta.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: C.text }}>{exp.name}</div>
                          <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2, display: "flex", alignItems: "center", gap: 5 }}>
                            <span style={{ display: "inline-block", fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: exp.phase === "uk" ? "rgba(74,158,255,.15)" : "rgba(245,158,11,.15)", color: exp.phase === "uk" ? C.blue : C.amber }}>
                              {exp.phase === "uk" ? "🇬🇧 In UK" : "🇧🇩 Pre-Arrival"}
                            </span>
                            {exp.cat} · {exp.date}
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 800, color: C.green }}>{fmtGBP(exp.amt)}</div>
                          <div style={{ fontSize: 10, color: C.blue, marginTop: 1 }}>{gbp2bdt(exp.amt, rate)}</div>
                        </div>
                        <button onClick={() => deleteExpense(exp.id)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: 16, padding: 4, lineHeight: 1, flexShrink: 0 }}>×</button>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CostsTab;
