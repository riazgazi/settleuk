import React, { useState, useEffect } from "react";
import { fmtGBP, gbp2bdt } from "../../utils/format";
import { UNI_TUITION_MAP, COST_FIXED } from "../../data/costs";

const CostsTab = () => {
    const [duration, setDuration] = useState(2);
    const [dependents, setDependents] = useState(0);
    const [uniPreset, setUniPreset] = useState("custom");
    const [tuition, setTuition] = useState(28000);
    const [tuitionPaidPct, setTuitionPaidPct] = useState(100);
    const [rate, setRate] = useState(153);

    useEffect(() => { if (uniPreset !== "custom" && UNI_TUITION_MAP[uniPreset]) setTuition(UNI_TUITION_MAP[uniPreset] * duration); }, [uniPreset, duration]);

    const totalTuition = parseFloat(tuition) || 0;
    const dur = duration, dep = dependents;
    const ihsDur = dur + 0.5;
    const ihsTotal = 776 * ihsDur * (1 + dep);
    const airTotal = 600 * (1 + dep);
    const tuitionPayable = totalTuition * (tuitionPaidPct / 100);
    const tuitionRemaining = totalTuition - tuitionPayable;
    const depVisa = dep * 490;
    const depIHS = dep * 776 * ihsDur;
    const fixedTotal = COST_FIXED.ielts + COST_FIXED.visa + ihsTotal + COST_FIXED.cas + airTotal + COST_FIXED.deposit + COST_FIXED.bio;
    const variableTotal = tuitionPayable + depVisa + depIHS;
    const grandTotal = fixedTotal + variableTotal;

    const C = { surface: "#161b22", surface2: "#1c2330", border: "#2a3441", green: "#00c896", greenDim: "rgba(0,200,150,0.12)", blue: "#4a9eff", blueDim: "rgba(74,158,255,0.12)", amber: "#f59e0b", red: "#ef4444", text: "#e6edf3", textMuted: "#7d8590", textDim: "#4d5560" };
    const card = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 14 };
    const selectStyle = { width: "100%", background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, padding: "8px 10px", fontFamily: "inherit", outline: "none" };

    return (
        <div>
            <div style={card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>📋 Your Criteria</div>
                    <div style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: C.greenDim, color: C.green, border: "1px solid rgba(0,200,150,.3)" }}>Set your plan</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 4 }}>
                    <div>
                        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Course Duration</div>
                        <select value={duration} onChange={e => setDuration(parseInt(e.target.value))} style={selectStyle}><option value={1}>1 Year</option><option value={2}>2 Years</option><option value={3}>3 Years</option><option value={4}>4 Years</option></select>
                    </div>
                    <div>
                        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Dependent?</div>
                        <select value={dependents} onChange={e => setDependents(parseInt(e.target.value))} style={selectStyle}><option value={0}>No Dependent</option><option value={1}>1 Dependent</option><option value={2}>2 Dependents</option></select>
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
                            <option value={50}>50%</option><option value={60}>60%</option><option value={70}>70%</option><option value={100}>100% (full course)</option>
                        </select>
                        <div style={{ fontSize: 10.5, color: C.textDim, marginTop: 5, lineHeight: 1.5 }}>💡 Calculation is based on your selected %. Select <strong style={{ color: C.green }}>100%</strong> to see the full course cost.</div>
                    </div>
                </div>
            </div>
            <div style={card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>📌 Cost Breakdown</div>
                    <div style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: C.greenDim, color: C.green, border: "1px solid rgba(0,200,150,.3)" }}>Auto-calculated</div>
                </div>
                <div style={{ position: "relative", width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                    <div style={{ position: "absolute", left: 13, top: 4, bottom: 4, width: 2, backgroundImage: `repeating-linear-gradient(to bottom, ${C.border} 0, ${C.border} 6px, transparent 6px, transparent 12px)` }} />
                    <table style={{ width: "100%", minWidth: 300, borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th colSpan={2} style={{ textAlign: "left", paddingLeft: 24, fontSize: 10, fontWeight: 600, color: C.textDim, textTransform: "uppercase", letterSpacing: 0.5, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>Item</th>
                                <th style={{ textAlign: "right", fontSize: 10, fontWeight: 600, color: C.green, textTransform: "uppercase", letterSpacing: 0.5, paddingBottom: 8, borderBottom: `1px solid ${C.border}`, minWidth: 72 }}>GBP (£)</th>
                                <th style={{ textAlign: "right", fontSize: 10, fontWeight: 600, color: C.blue, textTransform: "uppercase", letterSpacing: 0.5, paddingBottom: 8, borderBottom: `1px solid ${C.border}`, minWidth: 90 }}>BDT (৳)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { icon: "●", label: "IELTS Exam Fee", sub: "British Council / IDP", gbp: COST_FIXED.ielts },
                                { icon: "●", label: "UK Visa Application", sub: "Student visa fee", gbp: COST_FIXED.visa },
                                { icon: "●", label: "Immigration Health Surcharge", sub: `£776/yr × ${ihsDur} yr${ihsDur > 1 ? "s" : ""} × ${1 + dep} person${1 + dep > 1 ? "s" : ""}`, gbp: ihsTotal },
                                { icon: "●", label: "CAS & Admin Fees", sub: "University document charges", gbp: COST_FIXED.cas },
                                { icon: "●", label: "Air Ticket (DAC → UK)", sub: dep ? `Applicant + ${dep} dep.` : "Applicant only", gbp: airTotal },
                                { icon: "●", label: "Initial Cash Deposit", sub: "UKVI savings evidence", gbp: COST_FIXED.deposit },
                                { icon: "●", label: "Biometric (eVisa)", sub: "Visa application centre", gbp: COST_FIXED.bio }
                            ].map((r, i) => (
                                <tr key={i}>
                                    <td style={{ width: 28, textAlign: "center", padding: "9px 0", borderTop: i > 0 ? `1px solid rgba(42,52,65,.5)` : "none" }}><div style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${C.green}`, background: "#0d1117", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 7, color: C.green, position: "relative", zIndex: 1 }}>{r.icon}</div></td>
                                    <td style={{ paddingLeft: 8, padding: "9px 0 9px 8px", borderTop: i > 0 ? `1px solid rgba(42,52,65,.5)` : "none" }}><div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{r.label}</div><div style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>{r.sub}</div></td>
                                    <td style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: C.green, whiteSpace: "nowrap", paddingRight: 8, borderTop: i > 0 ? `1px solid rgba(42,52,65,.5)` : "none" }}>{fmtGBP(r.gbp)}</td>
                                    <td style={{ textAlign: "right", fontSize: 11, color: C.blue, whiteSpace: "nowrap", padding: "9px 0", borderTop: i > 0 ? `1px solid rgba(42,52,65,.5)` : "none" }}>{gbp2bdt(r.gbp, rate)}</td>
                                </tr>
                            ))}
                            <tr><td colSpan={4} style={{ padding: "10px 0 6px" }}><div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: 0.6 }}><span style={{ flex: 1, height: 1, background: C.border }} />Variable / Recurring<span style={{ flex: 1, height: 1, background: C.border }} /></div></td></tr>
                            {[
                                { icon: "◆", dotClass: "variable", label: `Tuition Payment (${tuitionPaidPct}%)`, sub: `£${totalTuition.toLocaleString()} total × ${tuitionPaidPct}%`, gbp: tuitionPayable },
                                { icon: "◇", dotClass: "optional", label: "Dependent Visa(s)", sub: dep ? `£490 × ${dep} dependent${dep > 1 ? "s" : ""}` : "N/A", gbp: depVisa },
                                { icon: "◇", dotClass: "optional", label: "Dependent IHS", sub: dep ? `£776 × ${ihsDur}yr × ${dep} dep.` : "N/A", gbp: depIHS }
                            ].map((r, i) => {
                                const dotColor = r.dotClass === "variable" ? C.blue : C.amber;
                                return (
                                    <tr key={i}>
                                        <td style={{ width: 28, textAlign: "center", padding: "9px 0" }}><div style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${dotColor}`, background: "#0d1117", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 7, color: dotColor, position: "relative", zIndex: 1 }}>{r.icon}</div></td>
                                        <td style={{ padding: "9px 0 9px 8px" }}><div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{r.label}</div><div style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>{r.sub}</div></td>
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
                    <div><div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>ESTIMATED TOTAL COST</div><div style={{ fontSize: 11, color: C.textDim }}>{dur}-yr · {dep === 0 ? "No dependent" : `${dep} dependent${dep > 1 ? "s" : ""}`}</div></div>
                    <div style={{ textAlign: "right" }}><div style={{ fontSize: 20, fontWeight: 800, color: C.green }}>{fmtGBP(grandTotal)}</div><div style={{ fontSize: 13, color: C.blue, marginTop: 1 }}>{gbp2bdt(grandTotal, rate)}</div></div>
                </div>
                <hr style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: "10px 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 3 }}>FIXED COSTS</div><div style={{ fontSize: 14, fontWeight: 700, color: C.green }}>{fmtGBP(fixedTotal)}</div><div style={{ fontSize: 11, color: C.blue }}>{gbp2bdt(fixedTotal, rate)}</div></div>
                    <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 3 }}>TUITION + DEP</div><div style={{ fontSize: 14, fontWeight: 700, color: C.blue }}>{fmtGBP(variableTotal)}</div><div style={{ fontSize: 11, color: C.blue }}>{gbp2bdt(variableTotal, rate)}</div></div>
                </div>
                {tuitionRemaining > 0 && (<div style={{ marginTop: 10, background: "rgba(232,168,56,0.08)", border: "1px solid rgba(232,168,56,0.25)", borderRadius: 8, padding: "8px 10px", fontSize: 11, color: C.textMuted, lineHeight: 1.5 }}>⚠️ <strong style={{ color: "#E8A838" }}>Remaining tuition not included above:</strong> {fmtGBP(tuitionRemaining)} ({gbp2bdt(tuitionRemaining, rate)}) — payable later during your course.</div>)}
                <div style={{ fontSize: 11, color: C.textMuted, textAlign: "center", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>💱 £1 =<input type="number" value={rate} onChange={e => setRate(parseFloat(e.target.value) || 153)} style={{ width: 52, background: "none", border: "none", borderBottom: `1px solid ${C.border}`, color: C.blue, fontSize: 11, textAlign: "center", padding: "0 2px", fontFamily: "inherit", outline: "none" }} />BDT</div>
            </div>
        </div>
    );
};

export default CostsTab;
