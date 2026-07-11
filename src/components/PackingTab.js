import React, { useState, useEffect } from "react";
import { PACKING_CATEGORIES, LUGGAGE_PRESETS } from "../data/packing";
import { loadLS, saveLS } from "../hooks/useLocalStorage";

function PackingTab() {
  const [checked, setChecked] = useState(() => loadLS("settleuk_packing_checked", {}));
  const [customItems, setCustomItems] = useState(() => loadLS("settleuk_packing_custom", {}));
  const [newItemName, setNewItemName] = useState({});
  const [newItemWeight, setNewItemWeight] = useState({});
  const [luggagePreset, setLuggagePreset] = useState(() => loadLS("settleuk_luggage_preset", "23"));
  const [customLimit, setCustomLimit] = useState(() => loadLS("settleuk_luggage_custom", 23));
  const [openCat, setOpenCat] = useState(PACKING_CATEGORIES[0].id);

  useEffect(() => { saveLS("settleuk_packing_checked", checked); }, [checked]);
  useEffect(() => { saveLS("settleuk_packing_custom", customItems); }, [customItems]);
  useEffect(() => { saveLS("settleuk_luggage_preset", luggagePreset); }, [luggagePreset]);
  useEffect(() => { saveLS("settleuk_luggage_custom", customLimit); }, [customLimit]);

  const toggleItem = (id) => setChecked(p => ({ ...p, [id]: !p[id] }));

  const addCustomItem = (catId) => {
    const name = (newItemName[catId] || "").trim();
    const weight = parseFloat(newItemWeight[catId]) || 0;
    if (!name) return;
    const id = `custom-${catId}-${Date.now()}`;
    setCustomItems(p => ({ ...p, [catId]: [...(p[catId] || []), { id, name, weight }] }));
    setNewItemName(p => ({ ...p, [catId]: "" }));
    setNewItemWeight(p => ({ ...p, [catId]: "" }));
  };

  const deleteCustomItem = (catId, itemId) => {
    setCustomItems(p => ({ ...p, [catId]: (p[catId] || []).filter(i => i.id !== itemId) }));
    setChecked(p => { const n = { ...p }; delete n[itemId]; return n; });
  };

  const allCategories = PACKING_CATEGORIES.map(cat => ({
    ...cat,
    items: [...cat.items, ...(customItems[cat.id] || [])],
  }));

  const allItemsFlat = allCategories.flatMap(c => c.items);
  const totalItems = allItemsFlat.length;
  const checkedCount = allItemsFlat.filter(i => checked[i.id]).length;
  const overallPct = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  const totalWeight = allItemsFlat.filter(i => checked[i.id]).reduce((s, i) => s + (i.weight || 0), 0);
  const limit = luggagePreset === "custom" ? (parseFloat(customLimit) || 23) : LUGGAGE_PRESETS.find(p => p.id === luggagePreset)?.limit || 23;
  const weightPct = Math.min(100, (totalWeight / limit) * 100);
  const weightColor = weightPct < 70 ? "#1D9E6A" : weightPct < 95 ? "#E8A838" : "#CF142B";

  const C = { green: "#1D9E6A", blue: "#4A90D9", amber: "#E8A838", red: "#CF142B", surface2: "#1c2330", border: "#2a3441", textMuted: "#7d8590" };

  return (
    <div>
      <div style={{ background: "rgba(91,141,239,0.08)", border: "1px solid rgba(91,141,239,0.25)", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#F0F4FF", marginBottom: 6 }}>🧳 Packing Planner</div>
        <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
          Plan and track everything you need to pack for the UK. Check off items as you pack them, and monitor your luggage weight against the airline limit.
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 0.5 }}>Packing Progress</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: "#1D9E6A" }}>{checkedCount} / {totalItems} items</span>
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 6, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${overallPct}%`, background: "linear-gradient(90deg,#534AB7,#1D9E6A)", borderRadius: 6, transition: "width 0.4s" }} />
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>⚖️ Luggage Weight</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <select value={luggagePreset} onChange={e => setLuggagePreset(e.target.value)} style={{ flex: 1, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, color: "#fff", fontSize: 12.5, padding: "8px 10px", fontFamily: "inherit", outline: "none" }}>
            {LUGGAGE_PRESETS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          {luggagePreset === "custom" && (
            <input type="number" value={customLimit} onChange={e => setCustomLimit(e.target.value)} style={{ width: 70, background: "#0d1117", border: `1px solid ${C.border}`, borderRadius: 8, color: "#fff", fontSize: 12.5, padding: "8px 10px", fontFamily: "inherit", outline: "none" }} />
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>Packed weight: <strong style={{ color: weightColor }}>{totalWeight.toFixed(1)} kg</strong></span>
          <span style={{ color: "rgba(255,255,255,0.35)" }}>Limit: {limit} kg</span>
        </div>
        <div style={{ height: 8, background: "rgba(255,255,255,0.07)", borderRadius: 6, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${weightPct}%`, background: weightColor, borderRadius: 6, transition: "width 0.4s" }} />
        </div>
        {weightPct >= 95 && (
          <div style={{ marginTop: 8, fontSize: 11.5, color: C.red, fontWeight: 600 }}>⚠️ You're near or over your luggage limit! Consider removing items.</div>
        )}
      </div>

      {allCategories.map(cat => {
        const isOpen = openCat === cat.id;
        const catChecked = cat.items.filter(i => checked[i.id]).length;
        return (
          <div key={cat.id} style={{ marginBottom: 10, borderRadius: 14, overflow: "hidden", border: `1px solid ${isOpen ? cat.color + "55" : "rgba(255,255,255,0.08)"}` }}>
            <div onClick={() => setOpenCat(isOpen ? null : cat.id)} style={{
              padding: "13px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
              background: isOpen ? cat.color + "0e" : "rgba(255,255,255,0.03)",
            }}>
              <span style={{ fontSize: 20 }}>{cat.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#F0F4FF" }}>{cat.name}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{catChecked} / {cat.items.length} packed</div>
              </div>
              <span style={{ color: cat.color, fontSize: 14, transition: "transform 0.2s", display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
            </div>

            {isOpen && (
              <div style={{ padding: "10px 14px 14px", background: cat.color + "07" }}>
                {cat.items.map(item => {
                  const isCustom = item.id.startsWith("custom-");
                  return (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <div onClick={() => toggleItem(item.id)} style={{
                        width: 18, height: 18, borderRadius: 5, flexShrink: 0, cursor: "pointer",
                        border: `2px solid ${checked[item.id] ? cat.color : "rgba(255,255,255,0.2)"}`,
                        background: checked[item.id] ? cat.color : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11,
                      }}>
                        {checked[item.id] && "✓"}
                      </div>
                      <div onClick={() => toggleItem(item.id)} style={{ flex: 1, cursor: "pointer" }}>
                        <span style={{ fontSize: 13, color: checked[item.id] ? "rgba(255,255,255,0.35)" : "#F0F4FF", textDecoration: checked[item.id] ? "line-through" : "none" }}>{item.name}</span>
                      </div>
                      {item.weight > 0 && (
                        <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>{item.weight} kg</span>
                      )}
                      {isCustom && (
                        <button onClick={() => deleteCustomItem(cat.id, item.id)} style={{ background: "none", border: "none", color: "rgba(232,91,91,0.5)", cursor: "pointer", fontSize: 15, padding: "0 2px", flexShrink: 0 }}>×</button>
                      )}
                    </div>
                  );
                })}

                <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                  <input
                    value={newItemName[cat.id] || ""}
                    onChange={e => setNewItemName(p => ({ ...p, [cat.id]: e.target.value }))}
                    placeholder="Add your own item..."
                    style={{ flex: 1, background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 12.5, padding: "8px 10px", fontFamily: "inherit", outline: "none" }}
                  />
                  <input
                    type="number" step="0.1"
                    value={newItemWeight[cat.id] || ""}
                    onChange={e => setNewItemWeight(p => ({ ...p, [cat.id]: e.target.value }))}
                    placeholder="kg"
                    style={{ width: 56, background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 12.5, padding: "8px 10px", fontFamily: "inherit", outline: "none" }}
                  />
                  <button onClick={() => addCustomItem(cat.id)} style={{ background: cat.color, color: "#08111C", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>Add</button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.22)", textAlign: "center", lineHeight: 1.5 }}>
        🔒 Your packing list is saved only on this device
      </div>
    </div>
  );
}

export default PackingTab;
