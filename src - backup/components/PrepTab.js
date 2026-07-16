import React, { useState, useRef } from "react";
import { CAS_QA, UKVI_QA, QA_CATEGORIES, REFUSAL_REASONS } from "../data/prep";

function PrepTab() {
  const [section, setSection] = useState("cas");
  const [qaCategory, setQaCategory] = useState("all");
  const [openQ, setOpenQ] = useState(null);
  const [pdfFiles, setPdfFiles] = useState(() => {
    try {
      const saved = localStorage.getItem("settleuk_pdfs_meta");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
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
      try { localStorage.setItem("settleuk_pdfs_meta", JSON.stringify(newFiles)); } catch {}
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const deletePdf = (id) => {
    const newFiles = pdfFiles.filter(f => f.id !== id);
    setPdfFiles(newFiles);
    setPdfData(p => { const n = { ...p }; delete n[id]; return n; });
    try { localStorage.setItem("settleuk_pdfs_meta", JSON.stringify(newFiles)); } catch {}
    if (viewingPdf === id) setViewingPdf(null);
  };

  const C = { green: "#1D9E6A", blue: "#4A90D9", amber: "#E8A838", red: "#CF142B" };

  const SectionBtn = ({ id, icon, label }) => (
    <button onClick={() => { setSection(id); setQaCategory("all"); setOpenQ(null); }} style={{
      flex: 1, padding: "9px 6px", border: "none", borderRadius: 10, cursor: "pointer",
      background: section === id ? "rgba(61,184,139,0.12)" : "rgba(255,255,255,0.04)",
      borderBottom: section === id ? "2px solid #1D9E6A" : "2px solid transparent",
      color: section === id ? C.green : "rgba(255,255,255,0.4)",
      fontSize: 11, fontWeight: section === id ? 800 : 500,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
    }}>
      <span style={{ fontSize: 16 }}>{icon}</span>{label}
    </button>
  );

  const CategoryTabs = () => (
    <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 14, paddingBottom: 2 }}>
      {QA_CATEGORIES.map(c => (
        <button key={c.id} onClick={() => { setQaCategory(c.id); setOpenQ(null); }} style={{
          flex: "none", padding: "7px 12px", borderRadius: 20, cursor: "pointer", whiteSpace: "nowrap",
          border: `1px solid ${qaCategory === c.id ? "#4A90D9" : "rgba(255,255,255,0.1)"}`,
          background: qaCategory === c.id ? "rgba(74,144,217,0.18)" : "rgba(255,255,255,0.03)",
          color: qaCategory === c.id ? "#4A90D9" : "rgba(255,255,255,0.45)",
          fontSize: 11.5, fontWeight: qaCategory === c.id ? 700 : 500,
        }}>
          {c.icon} {c.label}
        </button>
      ))}
    </div>
  );

  const filterByCategory = (list) => qaCategory === "all" ? list : list.filter(item => item.cat === qaCategory);

  const QACard = ({ item, i, accentColor }) => {
    const isOpen = openQ === i;
    return (
      <div style={{ marginBottom: 8, borderRadius: 12, overflow: "hidden", border: `1px solid ${isOpen ? accentColor + "55" : "rgba(255,255,255,0.07)"}` }}>
        <div onClick={() => setOpenQ(isOpen ? null : i)} style={{
          padding: "13px 14px", cursor: "pointer",
          background: isOpen ? accentColor + "0e" : "rgba(255,255,255,0.03)",
          display: "flex", alignItems: "flex-start", gap: 10,
        }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: accentColor + "22", border: `1.5px solid ${accentColor}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: accentColor, flexShrink: 0, marginTop: 1 }}>
            {i + 1}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F0F4FF", marginBottom: 2 }}>{item.q}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>{item.bn}</div>
          </div>
          <span style={{ color: accentColor, fontSize: 14, flexShrink: 0, transition: "transform 0.2s", display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
        </div>

        {isOpen && (
          <div style={{ padding: "0 14px 14px", background: accentColor + "07", borderTop: `1px solid ${accentColor}22` }}>
            <div style={{ marginTop: 12, marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: accentColor, marginBottom: 7 }}>📝 Sample Answer</div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 8, borderLeft: `3px solid ${accentColor}` }}>
                {item.a}
              </div>
            </div>
            <div style={{ padding: "9px 12px", background: "rgba(232,168,56,0.07)", border: "1px solid rgba(232,168,56,0.2)", borderRadius: 8, fontSize: 12, color: "rgba(255,255,255,0.58)", lineHeight: 1.5 }}>
              {item.tip}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 18, background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)" }}>
        <SectionBtn id="cas"     icon="📋" label="CAS Interview" />
        <SectionBtn id="ukvi"    icon="🎤" label="UKVI Interview" />
        <SectionBtn id="refusal" icon="❌" label="Refusal Guide" />
      </div>

      {section === "cas" && (
        <div>
          <div style={{ background: "rgba(91,141,239,0.08)", border: "1px solid rgba(91,141,239,0.25)", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#F0F4FF", marginBottom: 6 }}>📋 CAS Interview কী?</div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>
              CAS (Confirmation of Acceptance for Studies) interview সাধারণত হয় না — এটা একটা document/number। তবে কিছু ক্ষেত্রে university বা UKVI আপনাকে <strong style={{ color: "#4A90D9" }}>Genuine Student Interview</strong>-এর জন্য ডাকতে পারে। এই interview-এ তারা verify করে যে আপনি সত্যিই পড়তে আসছেন।
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
              {[["🎯 কে নেয়?", "UKVI Entry Clearance Officer"], ["📍 কোথায়?", "VFS/UKVCAS Centre, Dhaka"], ["⏱️ কতক্ষণ?", "১০-২০ মিনিট"], ["📅 কখন?", "Visa application-এর পর"]].map(([label, val], i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#F0F4FF" }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "rgba(232,168,56,0.07)", border: "1px solid rgba(232,168,56,0.2)", borderRadius: 12, padding: "11px 14px", marginBottom: 14, fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
            ⚠️ <strong style={{ color: "#E8A838" }}>Interview Tips:</strong> সব documents সাথে রাখুন। সত্য কথা বলুন। Clear ও confident হন। Nervous হলেও pause নিয়ে ভেবে উত্তর দিন।
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.28)", marginBottom: 10 }}>
            Possible Questions — tap to see answers
          </div>
          <CategoryTabs />
          {filterByCategory(CAS_QA).map((item, i) => <QACard key={i} item={item} i={i} accentColor={C.blue} />)}
          {filterByCategory(CAS_QA).length === 0 && (
            <div style={{ textAlign: "center", padding: "20px 10px", color: "rgba(255,255,255,0.25)", fontSize: 12.5 }}>No questions in this category yet.</div>
          )}
        </div>
      )}

      {section === "ukvi" && (
        <div>
          <div style={{ background: "rgba(61,184,139,0.08)", border: "1px solid rgba(61,184,139,0.25)", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#F0F4FF", marginBottom: 6 }}>🎤 UKVI Interview কী?</div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>
              UK Visas and Immigration (UKVI) কিছু applicant-কে <strong style={{ color: "#1D9E6A" }}>Credibility Interview</strong>-এর জন্য ডাকে। এটা mandatory নয় — শুধু যাদের application-এ কোনো concern দেখা যায় তাদের ডাকা হয়। Interview-এ তারা জানতে চায় আপনি সত্যিকারের student কিনা।
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
              {[["🎯 কে নেয়?", "UKVI ECO (Entry Clearance Officer)"], ["📍 কোথায়?", "Phone বা VFS Centre"], ["⏱️ কতক্ষণ?", "১৫-৩০ মিনিট"], ["📅 কখন?", "যেকোনো সময় visa process-এ"]].map(([label, val], i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#F0F4FF" }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "rgba(232,91,91,0.07)", border: "1px solid rgba(232,91,91,0.2)", borderRadius: 12, padding: "11px 14px", marginBottom: 14, fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
            🔴 <strong style={{ color: "#CF142B" }}>সতর্কতা:</strong> UKVI interview-এ মিথ্যা বললে permanent ban হতে পারে। সব সময় সত্য কথা বলুন, এমনকি যদি তা আপনার বিরুদ্ধেও যায়।
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.28)", marginBottom: 10 }}>
            Common Questions — tap to see answers
          </div>
          <CategoryTabs />
          {filterByCategory(UKVI_QA).map((item, i) => <QACard key={i} item={item} i={i} accentColor={C.green} />)}
          {filterByCategory(UKVI_QA).length === 0 && (
            <div style={{ textAlign: "center", padding: "20px 10px", color: "rgba(255,255,255,0.25)", fontSize: 12.5 }}>No questions in this category yet.</div>
          )}
        </div>
      )}

      {section === "refusal" && (
        <div>
          <div style={{ background: "rgba(232,91,91,0.07)", border: "1px solid rgba(232,91,91,0.25)", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#F0F4FF", marginBottom: 6 }}>❌ Visa Refusal — কী করবেন?</div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>
              Refusal letter-এ একটি <strong style={{ color: "#CF142B" }}>refusal code</strong> থাকে যা কারণ নির্দেশ করে। এই code বুঝে পরবর্তী application শক্তিশালী করুন। নিচে সবচেয়ে সাধারণ refusal codes এবং সমাধান দেওয়া হলো।
            </div>
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.28)", marginBottom: 10 }}>Common Refusal Reasons</div>
          {REFUSAL_REASONS.map((r, i) => (
            <div key={i} style={{ marginBottom: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#CF142B", background: "rgba(232,91,91,0.15)", padding: "2px 8px", borderRadius: 6, fontFamily: "monospace" }}>{r.code}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#F0F4FF" }}>{r.title}</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontStyle: "italic", marginBottom: 7 }}>{r.bn}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, marginBottom: 8 }}>{r.desc}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5, padding: "8px 10px", background: "rgba(61,184,139,0.07)", border: "1px solid rgba(61,184,139,0.2)", borderRadius: 8 }}>{r.fix}</div>
            </div>
          ))}

          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.28)", marginBottom: 10 }}>📎 আপনার Refusal Letters / Documents</div>

            <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileUpload} style={{ display: "none" }} />
            <button onClick={() => fileInputRef.current?.click()} style={{ width: "100%", padding: "13px", background: "rgba(91,141,239,0.08)", border: "2px dashed rgba(91,141,239,0.4)", borderRadius: 12, color: "#4A90D9", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>
              📄 Upload PDF (Refusal Letter / Document)
            </button>

            {pdfFiles.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 16px", color: "rgba(255,255,255,0.25)", fontSize: 12.5 }}>
                কোনো PDF upload হয়নি। আপনার refusal letter বা সংশ্লিষ্ট document এখানে upload করুন।
              </div>
            ) : (
              pdfFiles.map(f => (
                <div key={f.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", marginBottom: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10 }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>📄</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#F0F4FF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                      <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>{f.size} · Uploaded {f.date}</div>
                    </div>
                    <button onClick={() => setViewingPdf(viewingPdf === f.id ? null : f.id)} style={{ background: viewingPdf === f.id ? "rgba(61,184,139,0.15)" : "rgba(255,255,255,0.06)", border: "1px solid " + (viewingPdf === f.id ? "#1D9E6A55" : "rgba(255,255,255,0.12)"), borderRadius: 7, color: viewingPdf === f.id ? "#1D9E6A" : "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, cursor: "pointer", padding: "5px 10px", flexShrink: 0 }}>
                      {viewingPdf === f.id ? "Close" : "View"}
                    </button>
                    <button onClick={() => deletePdf(f.id)} style={{ background: "none", border: "none", color: "rgba(232,91,91,0.5)", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "2px 4px", flexShrink: 0 }}>×</button>
                  </div>

                  {viewingPdf === f.id && pdfData[f.id] && (
                    <div style={{ marginBottom: 10, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(91,141,239,0.3)" }}>
                      <div style={{ background: "rgba(91,141,239,0.08)", padding: "8px 14px", fontSize: 12, color: "#4A90D9", fontWeight: 700, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>📄 {f.name}</span>
                        <a href={pdfData[f.id]} download={f.name} style={{ fontSize: 11, color: "#4A90D9", textDecoration: "none", background: "rgba(91,141,239,0.15)", padding: "3px 10px", borderRadius: 6 }}>⬇ Download</a>
                      </div>
                      <iframe
                        src={pdfData[f.id]}
                        title={f.name}
                        style={{ width: "100%", height: 480, border: "none", background: "#fff" }}
                      />
                    </div>
                  )}
                </div>
              ))
            )}

            <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.22)", textAlign: "center", lineHeight: 1.5 }}>
              🔒 সব PDF শুধু আপনার device-এ সংরক্ষিত — কোনো server-এ upload হয় না
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PrepTab;
