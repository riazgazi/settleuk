import React, { useState, useRef } from "react";
import { CAS_QA, UKVI_QA, QA_CATEGORIES, REFUSAL_REASONS } from "../../data/prep";

const PrepTab = () => {
    const [section, setSection] = useState("cas");
    const [qaCategory, setQaCategory] = useState(null);
    const [openQ, setOpenQ] = useState(null);
    const [overviewExpanded, setOverviewExpanded] = useState(false);
    const [pdfFiles, setPdfFiles] = useState(() => { try { const saved = localStorage.getItem("settleuk_pdfs_meta"); return saved ? JSON.parse(saved) : []; } catch { return []; } });
    const [pdfData, setPdfData] = useState({});
    const [viewingPdf, setViewingPdf] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file || file.type !== "application/pdf") return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const dataUrl = ev.target.result;
            const id = Date.now().toString();
            const meta = { id, name: file.name, size: (file.size / 1024).toFixed(0) + " KB", date: new Date().toLocaleDateString("en-GB") };
            const newFiles = [...pdfFiles, meta];
            setPdfFiles(newFiles);
            setPdfData(p => ({ ...p, [id]: dataUrl }));
            try { localStorage.setItem("settleuk_pdfs_meta", JSON.stringify(newFiles)); } catch { }
        };
        reader.readAsDataURL(file);
        e.target.value = "";
    };

    const deletePdf = (id) => {
        const newFiles = pdfFiles.filter(f => f.id !== id);
        setPdfFiles(newFiles);
        setPdfData(p => { const n = { ...p }; delete n[id]; return n; });
        try { localStorage.setItem("settleuk_pdfs_meta", JSON.stringify(newFiles)); } catch { }
        if (viewingPdf === id) setViewingPdf(null);
    };

    const C = { green: "#1D9E6A", blue: "#4A90D9", amber: "#E8A838", red: "#CF142B" };

    const SectionBtn = ({ id, icon, label }) => (
        <button onClick={() => { setSection(id); setQaCategory(null); setOpenQ(null); setOverviewExpanded(false); }} style={{ flex: 1, padding: "9px 6px", border: "none", borderRadius: 10, cursor: "pointer", background: section === id ? "rgba(61,184,139,0.12)" : "rgba(255,255,255,0.04)", borderBottom: section === id ? "2px solid #1D9E6A" : "2px solid transparent", color: section === id ? C.green : "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: section === id ? 800 : 500, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 16 }}>{icon}</span>{label}
        </button>
    );

    // ---- Overview Card: title, short desc, info grid, Read More toggle ----
    const OverviewCard = ({ icon, title, shortDesc, fullDesc, info, accentColor }) => (
        <div style={{ background: accentColor + "12", border: `1px solid ${accentColor}33`, borderRadius: 14, padding: "14px 15px", marginBottom: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#F0F4FF", marginBottom: 5 }}>{icon} {title}</div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{shortDesc}</div>
            {overviewExpanded && (
                <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginTop: 8 }}>{fullDesc}</div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
                {info.map(([label, val], i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px" }}>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>{label}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#F0F4FF" }}>{val}</div>
                    </div>
                ))}
            </div>
            <button onClick={() => setOverviewExpanded(v => !v)} style={{ marginTop: 12, width: "100%", padding: "8px", background: "rgba(255,255,255,0.05)", border: `1px solid ${accentColor}33`, borderRadius: 8, color: accentColor, fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>
                {overviewExpanded ? "Show Less ▴" : "Read More ▾"}
            </button>
        </div>
    );

    // ---- Interview Tips Card ----
    const TipsCard = ({ icon, label, text, accentColor }) => (
        <div style={{ background: accentColor + "10", border: `1px solid ${accentColor}33`, borderRadius: 12, padding: "11px 14px", marginBottom: 14, fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }}>
            {icon} <strong style={{ color: accentColor }}>{label}</strong> {text}
        </div>
    );

    // ---- Question Categories: fixed responsive grid, single-expand ----
    const CategoryGrid = ({ accentColor }) => (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            {QA_CATEGORIES.filter(c => c.id !== "all").map(c => {
                const active = qaCategory === c.id;
                return (
                    <button
                        key={c.id}
                        onClick={() => { setQaCategory(active ? null : c.id); setOpenQ(null); }}
                        style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "10px 12px", borderRadius: 12, cursor: "pointer",
                            border: `1px solid ${active ? accentColor : "rgba(255,255,255,0.09)"}`,
                            background: active ? accentColor + "1c" : "rgba(255,255,255,0.03)",
                            color: active ? accentColor : "rgba(255,255,255,0.6)",
                            fontSize: 12, fontWeight: active ? 800 : 600, textAlign: "left"
                        }}
                    >
                        <span style={{ fontSize: 15, flexShrink: 0 }}>{c.icon}</span>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.label}</span>
                    </button>
                );
            })}
        </div>
    );

    const filterByCategory = (list) => qaCategory ? list.filter(item => item.cat === qaCategory) : [];

    const QACard = ({ item, i, accentColor }) => {
        const isOpen = openQ === i;
        return (
            <div style={{ marginBottom: 8, borderRadius: 12, overflow: "hidden", border: `1px solid ${isOpen ? accentColor + "55" : "rgba(255,255,255,0.07)"}` }}>
                <div onClick={() => setOpenQ(isOpen ? null : i)} style={{ padding: "12px 13px", cursor: "pointer", background: isOpen ? accentColor + "0e" : "rgba(255,255,255,0.03)", display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: accentColor + "22", border: `1.5px solid ${accentColor}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: accentColor, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#F0F4FF" }}>{item.q}</div>
                    </div>
                    <span style={{ color: accentColor, fontSize: 14, flexShrink: 0, transition: "transform 0.2s", display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
                </div>
                {isOpen && (
                    <div style={{ padding: "0 13px 13px", background: accentColor + "07", borderTop: `1px solid ${accentColor}22` }}>
                        <div style={{ marginTop: 11, marginBottom: 9 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: accentColor, marginBottom: 6 }}>📝 Sample Answer</div>
                            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 8, borderLeft: `3px solid ${accentColor}` }}>{item.a}</div>
                        </div>
                        <div style={{ padding: "9px 12px", background: "rgba(232,168,56,0.07)", border: "1px solid rgba(232,168,56,0.2)", borderRadius: 8, fontSize: 12, color: "rgba(255,255,255,0.58)", lineHeight: 1.5 }}>{item.tip}</div>
                    </div>
                )}
            </div>
        );
    };

    const QuestionSection = ({ list, accentColor, emptyHint = "Select a category to see its questions." }) => (
        <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.28)", marginBottom: 10 }}>Question Categories</div>
            <CategoryGrid accentColor={accentColor} />
            {qaCategory ? (
                filterByCategory(list).length > 0 ? (
                    filterByCategory(list).map((item, i) => <QACard key={i} item={item} i={i} accentColor={accentColor} />)
                ) : (
                    <div style={{ textAlign: "center", padding: "20px 10px", color: "rgba(255,255,255,0.25)", fontSize: 12.5 }}>No questions in this category yet.</div>
                )
            ) : (
                <div style={{ textAlign: "center", padding: "16px 10px", color: "rgba(255,255,255,0.22)", fontSize: 12 }}>{emptyHint}</div>
            )}
        </div>
    );

    return (
        <div>
            <div style={{ display: "flex", gap: 6, marginBottom: 18, background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)" }}>
                <SectionBtn id="cas" icon="📋" label="CAS Interview" />
                <SectionBtn id="ukvi" icon="🎤" label="UKVI Interview" />
                <SectionBtn id="refusal" icon="❌" label="Refusal Guide" />
            </div>

            {section === "cas" && (
                <div>
                    <OverviewCard
                        icon="📋"
                        title="What is a CAS Interview?"
                        shortDesc="A CAS (Confirmation of Acceptance for Studies) interview isn't usually a formal event — CAS is a document and reference number."
                        fullDesc="In some cases, your university or UKVI may still invite you to a Genuine Student Interview to confirm you're a genuine applicant. In this interview, they verify that you are genuinely coming to the UK to study."
                        accentColor={C.blue}
                        info={[
                            ["🎯 Who conducts it?", "UKVI Entry Clearance Officer"],
                            ["📍 Where?", "VFS/UKVCAS Centre, Dhaka"],
                            ["⏱️ Duration?", "10-20 minutes"],
                            ["📅 When?", "After your visa application"],
                        ]}
                    />
                    <TipsCard icon="⚠️" label="Interview Tips:" text="Bring all your documents. Always tell the truth. Stay clear and confident. If you feel nervous, pause and think before you answer." accentColor={C.amber} />
                    <QuestionSection list={CAS_QA} accentColor={C.blue} />
                </div>
            )}

            {section === "ukvi" && (
                <div>
                    <OverviewCard
                        icon="🎤"
                        title="What is a UKVI Interview?"
                        shortDesc="UK Visas and Immigration (UKVI) invites some applicants to a Credibility Interview — this isn't mandatory for everyone."
                        fullDesc="Only applicants whose application raises some concern are usually called. In the interview, the officer wants to confirm that you are genuinely a student."
                        accentColor={C.green}
                        info={[
                            ["🎯 Who conducts it?", "UKVI ECO (Entry Clearance Officer)"],
                            ["📍 Where?", "Phone or VFS Centre"],
                            ["⏱️ Duration?", "15-30 minutes"],
                            ["📅 When?", "Any time during the visa process"],
                        ]}
                    />
                    <TipsCard icon="🔴" label="Warning:" text="Lying in a UKVI interview can lead to a permanent ban. Always tell the truth, even if it goes against you." accentColor={C.red} />
                    <QuestionSection list={UKVI_QA} accentColor={C.green} />
                </div>
            )}

            {section === "refusal" && (
                <div>
                    <OverviewCard
                        icon="❌"
                        title="Visa Refusal — What To Do?"
                        shortDesc="A refusal letter contains a refusal code that points to the reason for refusal."
                        fullDesc="Understanding this code helps you strengthen your next application. Below are the most common refusal codes and how to address them."
                        accentColor={C.red}
                        info={[
                            ["📄 What it is", "A coded reason on your refusal letter"],
                            ["🎯 Purpose", "Explains why your visa was refused"],
                            ["🔁 Next step", "Fix the issue, then reapply"],
                            ["📎 Keep handy", "Your refusal letter & documents"],
                        ]}
                    />

                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.28)", marginBottom: 10 }}>Common Refusal Reasons</div>
                    {REFUSAL_REASONS.map((r, i) => (
                        <div key={i} style={{ marginBottom: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                <span style={{ fontSize: 10, fontWeight: 800, color: "#CF142B", background: "rgba(232,91,91,0.15)", padding: "2px 8px", borderRadius: 6, fontFamily: "monospace" }}>{r.code}</span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "#F0F4FF" }}>{r.title}</span>
                            </div>
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, marginBottom: 8 }}>{r.desc}</div>
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5, padding: "8px 10px", background: "rgba(61,184,139,0.07)", border: "1px solid rgba(61,184,139,0.2)", borderRadius: 8 }}>{r.fix}</div>
                        </div>
                    ))}

                    <div style={{ marginTop: 20 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.28)", marginBottom: 10 }}>📎 Your Refusal Letters / Documents</div>
                        <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileUpload} style={{ display: "none" }} />
                        <button onClick={() => fileInputRef.current?.click()} style={{ width: "100%", padding: "13px", background: "rgba(91,141,239,0.08)", border: "2px dashed rgba(91,141,239,0.4)", borderRadius: 12, color: "#4A90D9", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>📄 Upload PDF (Refusal Letter / Document)</button>
                        {pdfFiles.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "20px 16px", color: "rgba(255,255,255,0.25)", fontSize: 12.5 }}>No PDF uploaded yet. Upload your refusal letter or related document here.</div>
                        ) : (
                            pdfFiles.map(f => (
                                <div key={f.id}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", marginBottom: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10 }}>
                                        <span style={{ fontSize: 22, flexShrink: 0 }}>📄</span>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: "#F0F4FF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                                            <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>{f.size} · Uploaded {f.date}</div>
                                        </div>
                                        <button onClick={() => setViewingPdf(viewingPdf === f.id ? null : f.id)} style={{ background: viewingPdf === f.id ? "rgba(61,184,139,0.15)" : "rgba(255,255,255,0.06)", border: "1px solid " + (viewingPdf === f.id ? "#1D9E6A55" : "rgba(255,255,255,0.12)"), borderRadius: 7, color: viewingPdf === f.id ? "#1D9E6A" : "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, cursor: "pointer", padding: "5px 10px", flexShrink: 0 }}>{viewingPdf === f.id ? "Close" : "View"}</button>
                                        <button onClick={() => deletePdf(f.id)} style={{ background: "none", border: "none", color: "rgba(232,91,91,0.5)", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "2px 4px", flexShrink: 0 }}>×</button>
                                    </div>
                                    {viewingPdf === f.id && pdfData[f.id] && (
                                        <div style={{ marginBottom: 10, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(91,141,239,0.3)" }}>
                                            <div style={{ background: "rgba(91,141,239,0.08)", padding: "8px 14px", fontSize: 12, color: "#4A90D9", fontWeight: 700, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span>📄 {f.name}</span>
                                                <a href={pdfData[f.id]} download={f.name} style={{ fontSize: 11, color: "#4A90D9", textDecoration: "none", background: "rgba(91,141,239,0.15)", padding: "3px 10px", borderRadius: 6 }}>⬇ Download</a>
                                            </div>
                                            <iframe src={pdfData[f.id]} title={f.name} style={{ width: "100%", height: 480, border: "none", background: "#fff" }} />
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                        <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.22)", textAlign: "center", lineHeight: 1.5 }}>🔒 All PDFs are stored only on your device — nothing is uploaded to any server</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrepTab;
