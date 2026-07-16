// src/features/documents/Documents.jsx
import React, { useState } from "react";
import { useJourneyContext } from "../../context/JourneyContext";
import { DOCS } from "../../data/documents";
import InfoExpand from "../../components/home/InfoExpand";

const Documents = () => {
    const { docChecked, toggleDoc } = useJourneyContext();
    const [expandedDoc, setExpandedDoc] = useState(null);

    const docsReadyCount = Object.values(docChecked).filter(Boolean).length;
    const docPct = Math.round((docsReadyCount / DOCS.length) * 100);

    return (
        <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 19, fontWeight: 800 }}>📄 Document Vault</h2>
            <p style={{ margin: "0 0 8px", fontSize: 12.5, color: "rgba(255,255,255,0.38)" }}>{docsReadyCount} of {DOCS.length} documents ready · {docPct}%</p>
            <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 5, overflow: "hidden", marginBottom: 14 }}>
                <div style={{ height: "100%", width: `${docPct}%`, background: "linear-gradient(90deg,#534AB7,#1D9E6A)", borderRadius: 5, transition: "width 0.4s" }} />
            </div>
            <div style={{ background: "rgba(232,168,56,0.08)", border: "1px solid rgba(232,168,56,0.22)", borderRadius: 12, padding: "10px 14px", marginBottom: 16, fontSize: 12.5, color: "rgba(255,255,255,0.62)" }}>
                💡 <strong style={{ color: "#E8A838" }}>Tip:</strong> Scan everything and upload to Google Drive. Never carry all originals in one bag.
            </div>
            <div>
                {DOCS.map(doc => {
                    const isExpanded = expandedDoc === doc.id;
                    return (
                        <div key={doc.id} style={{ marginBottom: 8 }}>
                            <div style={{ padding: "12px 14px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, background: docChecked[doc.id] ? "rgba(61,184,139,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${docChecked[doc.id] ? "#1D9E6A55" : "rgba(255,255,255,0.07)"}` }}>
                                <span onClick={() => toggleDoc(doc.id)} style={{ fontSize: 22, cursor: "pointer", flexShrink: 0 }}>{doc.icon}</span>
                                <div onClick={() => toggleDoc(doc.id)} style={{ flex: 1, cursor: "pointer", minWidth: 0 }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: docChecked[doc.id] ? "rgba(255,255,255,0.35)" : "#F0F4FF", textDecoration: docChecked[doc.id] ? "line-through" : "none" }}>{doc.name}</div>
                                    <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.28)", marginTop: 1 }}>{doc.hint}</div>
                                </div>
                                {doc.desc && <button onClick={(e) => { e.stopPropagation(); setExpandedDoc(isExpanded ? null : doc.id); }} style={{ flexShrink: 0, width: 24, height: 24, borderRadius: "50%", background: isExpanded ? "rgba(91,141,239,0.2)" : "rgba(255,255,255,0.06)", border: `1px solid ${isExpanded ? "#4A90D9" : "rgba(255,255,255,0.12)"}`, color: isExpanded ? "#4A90D9" : "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>ℹ️</button>}
                                <div onClick={() => toggleDoc(doc.id)} style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, cursor: "pointer", border: `2px solid ${docChecked[doc.id] ? "#1D9E6A" : "rgba(255,255,255,0.2)"}`, background: docChecked[doc.id] ? "#1D9E6A" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>{docChecked[doc.id] && "✓"}</div>
                            </div>
                            {isExpanded && doc.desc && <InfoExpand desc={doc.desc} link={doc.link} accent="#4A90D9" />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Documents;