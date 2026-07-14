import React, { useState, useEffect, useRef } from "react";
import { loadLS, saveLS } from "../../hooks/useLocalStorage";
import { fmtGBP, gbp2bdt } from "../../utils/format";
import { EXPENSE_CAT_META } from "../../data/costs";

/* ============================================================================
   Expense Tracker — single-file Quick Tool.
   Reuses (does NOT redefine) your existing:
     - localStorage key "settleuk_expenses" and expense shape {id,name,amt,cat,phase,date}
     - EXPENSE_CAT_META categories from data/costs.js
     - "settleuk_budget_estimate" key (written by the Budget Calculator / CostsTab.jsx)
   No internal header — this is rendered inside FeaturePageHeader from Home.jsx,
   which already provides the title/back button.

   UI/UX PASS (this revision):
     - Add Expense is now a category-first, amount-only-required bottom sheet.
     - Journey Stage field removed from the modal — it silently inherits the
       page-level Journey filter (falls back to "bd" when that filter is "All").
     - Date field removed from the modal — today's date is stamped automatically,
       in the exact same "DD/MM/YYYY" shape the rest of the app already expects.
     - Expense Breakdown card no longer has its own time dropdown — it now just
       follows the page-level time filter (All Time / This Month / This Week).
     - Bottom sheet supports tap-outside-to-close and swipe-down-to-close.
     - The large "Save Expense" button is gone — a small circular ✔ tick sits
       beside the Amount field. It's disabled until a category is picked and
       amount > 0; tapping it saves, closes the sheet, and fires a brief
       "✓ Expense Added Successfully" toast. Summary cards, the pie chart,
       breakdown, and recent list all already read from `expenses` state, so
       saving updates them the normal React way — no separate refresh logic.
   None of the above touches localStorage keys, expense shape, or any
   summary/analytics/budget calculation — those functions are unchanged.
============================================================================ */

const EXPENSES_KEY = "settleuk_expenses";
const BUDGET_ESTIMATE_KEY = "settleuk_budget_estimate";

const C = {
    bg: "#0b0f16", surface: "#161b22", surface2: "#1c2330", border: "#2a3441",
    green: "#00c896", greenDim: "rgba(0,200,150,0.12)",
    blue: "#4a9eff", blueDim: "rgba(74,158,255,0.12)",
    amber: "#f59e0b", red: "#ef4444",
    text: "#e6edf3", textMuted: "#7d8590", textDim: "#4d5560",
};

/* ---------------------------- tiny inline icons --------------------------- */
const Icon = ({ children, size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const IconCalendar = (p) => <Icon {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></Icon>;
const IconWallet = (p) => <Icon {...p}><path d="M19 7V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2v-2" /><path d="M21 12a2 2 0 00-2-2h-3a2 2 0 000 4h3a2 2 0 002-2z" /></Icon>;
const IconBriefcase = (p) => <Icon {...p}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></Icon>;
const IconBuilding = (p) => <Icon {...p}><rect x="4" y="2" width="16" height="20" rx="1" /><path d="M9 22v-4h6v4M9 6h1M14 6h1M9 10h1M14 10h1M9 14h1M14 14h1" /></Icon>;
const IconInfo = (p) => <Icon {...p}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></Icon>;
const IconChevronRight = (p) => <Icon {...p}><path d="M9 18l6-6-6-6" /></Icon>;
const IconChevronDown = (p) => <Icon {...p}><path d="M6 9l6 6 6-6" /></Icon>;
const IconTrendUp = (p) => <Icon {...p}><path d="M23 6l-9.5 9.5-5-5L1 18M17 6h6v6" /></Icon>;
const IconList = (p) => <Icon {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></Icon>;
const IconPlus = (p) => <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>;
const IconGlobe = (p) => <Icon {...p}><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 010 20 15 15 0 010-20z" /></Icon>;
const IconCheck = (p) => <Icon {...p}><path d="M20 6L9 17l-5-5" /></Icon>;
const IconCheckCircle = (p) => <Icon {...p}><circle cx="12" cy="12" r="10" /><path d="M8 12.5l2.5 2.5L16 9" /></Icon>;

/* ------------------------------ pure helpers ------------------------------ */
// Expenses store date as toLocaleDateString("en-GB") => "DD/MM/YYYY"
function parseExpenseDate(dateStr) {
    const [d, m, y] = (dateStr || "").split("/").map(Number);
    return new Date(y || 1970, (m || 1) - 1, d || 1);
}
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function formatDisplayDate(dateStr) {
    const d = parseExpenseDate(dateStr);
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
function titleCase(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

// Returns today's date in the exact "DD/MM/YYYY" shape the rest of the app
// already writes via toLocaleDateString("en-GB"), so nothing downstream changes.
function todayDDMMYYYY() {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${dd}/${mm}/${d.getFullYear()}`;
}

// Auto-name fallback when Description is left empty — based on selected category
const AUTO_NAME_BY_CATEGORY = {
    visa: "Visa Expense",
    ielts: "IELTS Expense",
    travel: "Travel Expense",
    tuition: "Tuition Expense",
    living: "Living Expense",
    food: "Food Expense",
    mobile: "Mobile Expense",
    transport: "Transport Expense",
    health: "Health Expense",
    other: "Other Expense",
};
function autoNameFor(catId) { return AUTO_NAME_BY_CATEGORY[catId] || `${titleCase(catId)} Expense`; }

function filterByJourney(expenses, phase) { return phase === "all" ? expenses : expenses.filter((e) => e.phase === phase); }
function filterByCategory(expenses, cat) { return cat === "all" ? expenses : expenses.filter((e) => e.cat === cat); }
function filterByTime(expenses, time) {
    if (!time || time === "all") return expenses;
    const now = new Date();
    return expenses.filter((e) => {
        const d = parseExpenseDate(e.date);
        if (time === "month") return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        if (time === "week") { const diff = (now - d) / 86400000; return diff >= 0 && diff <= 7; }
        return true;
    });
}
function applyFilters(expenses, { phase = "all", cat = "all", time = "all" } = {}) {
    return filterByTime(filterByCategory(filterByJourney(expenses, phase), cat), time);
}
function computeSummary(expenses) {
    const totalSpent = expenses.reduce((s, e) => s + e.amt, 0);
    const preSpent = expenses.filter((e) => e.phase === "bd").reduce((s, e) => s + e.amt, 0);
    const ukSpent = expenses.filter((e) => e.phase === "uk").reduce((s, e) => s + e.amt, 0);
    return { totalSpent, preSpent, ukSpent };
}
function computeCategoryBreakdown(expenses) {
    const totals = {};
    expenses.forEach((e) => { totals[e.cat] = (totals[e.cat] || 0) + e.amt; });
    const grand = Object.values(totals).reduce((s, v) => s + v, 0);
    return Object.entries(totals)
        .sort((a, b) => b[1] - a[1])
        .map(([cat, amt]) => ({ cat, amt, pct: grand > 0 ? (amt / grand) * 100 : 0, meta: EXPENSE_CAT_META[cat] || EXPENSE_CAT_META.other }));
}
function computeAnalytics(expenses) {
    if (expenses.length === 0) return { highestCategory: null, largestExpense: null, totalTransactions: 0, averageExpense: 0 };
    const totals = {};
    expenses.forEach((e) => { totals[e.cat] = (totals[e.cat] || 0) + e.amt; });
    const highest = Object.entries(totals).sort((a, b) => b[1] - a[1])[0];
    const largestExpense = [...expenses].sort((a, b) => b.amt - a.amt)[0];
    return {
        highestCategory: highest ? highest[0] : null,
        highestCategoryAmt: highest ? highest[1] : 0,
        largestExpense,
        totalTransactions: expenses.length,
        averageExpense: expenses.reduce((s, e) => s + e.amt, 0) / expenses.length,
    };
}
function computeBudgetStatus(totalSpent, budget) {
    if (!budget || budget <= 0) return { pct: 0, rawPct: 0, status: "on-track", label: "On Track", remaining: 0 };
    const rawPct = (totalSpent / budget) * 100;
    const pct = Math.min(100, rawPct);
    let status = "on-track", label = "On Track";
    if (rawPct >= 100) { status = "exceeded"; label = "Exceeded"; }
    else if (rawPct >= 80) { status = "warning"; label = "Warning"; }
    return { pct, rawPct, status, label, remaining: Math.max(0, budget - totalSpent) };
}
function groupByMonthLabel(expenses) {
    const groups = {};
    [...expenses].reverse().forEach((exp) => {
        const d = parseExpenseDate(exp.date);
        const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(exp);
    });
    return groups;
}

const CATEGORY_OPTIONS = [
    { id: "all", label: "All" },
    ...Object.keys(EXPENSE_CAT_META).map((id) => ({ id, label: titleCase(id), icon: EXPENSE_CAT_META[id].icon })),
];
const JOURNEY_FILTERS = [
    { id: "all", label: "All Journey", icon: <IconGlobe size={15} color={C.green} /> },
    { id: "bd", label: "Pre-Arrival", icon: <span>🇧🇩</span> },
    { id: "uk", label: "In UK", icon: <span>🇬🇧</span> },
];
const TIME_FILTERS = [
    { id: "all", label: "All Time" },
    { id: "month", label: "This Month" },
    { id: "week", label: "This Week" },
];
// Small label shown (read-only) in the Add Expense sheet so the user still
// knows which journey stage the expense will be filed under.
const JOURNEY_STAGE_LABEL = { bd: "🇧🇩 Pre-Arrival (BD)", uk: "🇬🇧 In UK" };

/* ------------------------------ subcomponents ------------------------------ */

function Dropdown({ options, value, onChange, small = false }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);
    const selected = options.find((o) => o.id === value) || options[0];
    return (
        <div ref={ref} style={{ position: "relative" }}>
            <button
                type="button" onClick={() => setOpen((v) => !v)}
                style={{
                    display: "flex", alignItems: "center", gap: 8, background: C.surface2,
                    border: `1px solid ${open ? C.green : C.border}`, borderRadius: 10, color: C.text,
                    fontSize: small ? 12.5 : 13, fontWeight: 600, padding: small ? "9px 12px" : "10px 14px",
                    cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                }}
            >
                {small && <IconList size={14} color={C.textMuted} />}
                <span>{selected?.icon ? `${selected.icon} ` : ""}{selected?.label}</span>
                <IconChevronDown size={13} color={C.textMuted} />
            </button>
            {open && (
                <div style={{
                    position: "absolute", top: "calc(100% + 6px)", left: 0, minWidth: "100%", zIndex: 30,
                    background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10,
                    boxShadow: "0 8px 24px rgba(0,0,0,.5)", maxHeight: 260, overflowY: "auto", padding: 4,
                }}>
                    {options.map((opt) => {
                        const active = opt.id === value;
                        return (
                            <div key={opt.id} onClick={() => { onChange(opt.id); setOpen(false); }}
                                style={{
                                    display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderRadius: 7,
                                    cursor: "pointer", fontSize: 13, fontWeight: active ? 700 : 500,
                                    color: active ? C.green : C.text, background: active ? C.greenDim : "transparent", whiteSpace: "nowrap",
                                }}
                            >{opt.icon && <span>{opt.icon}</span>}<span>{opt.label}</span></div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function FilterPill({ active, onClick, children, activeColor = C.green, compact = false }) {
    return (
        <button
            onClick={onClick}
            style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: compact ? "7px 14px" : "10px 8px", borderRadius: 10, cursor: "pointer",
                border: `1px solid ${active ? activeColor : C.border}`,
                background: active ? activeColor + "18" : C.surface2,
                color: active ? activeColor : C.textMuted, fontSize: 12.5, fontWeight: 700,
                flex: compact ? "none" : 1, whiteSpace: "nowrap",
            }}
        >{children}</button>
    );
}

function SummaryCard({ label, value, rate, color, icon }) {
    return (
        <div style={{ position: "relative", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 12px" }}>
            <div style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: 8, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 5, paddingRight: 28 }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color }}>{fmtGBP(value)}</div>
            <div style={{ fontSize: 10.5, color: C.textDim, marginTop: 2 }}>৳ {gbp2bdt(value, rate).replace(/[^\d,]/g, "")}</div>
        </div>
    );
}

function ExpenseRow({ exp, meta, onDelete }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 7, overflow: "hidden" }}>
            <div onClick={() => setOpen((v) => !v)} style={{ padding: "11px 12px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: meta.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{meta.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{exp.name}</div>
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>{titleCase(exp.cat)} • {formatDisplayDate(exp.date)}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.text, flexShrink: 0 }}>{fmtGBP(exp.amt)}</div>
                <span style={{ flexShrink: 0, color: C.textMuted, transform: open ? "rotate(90deg)" : "none", transition: "transform .15s", display: "flex" }}><IconChevronRight size={16} /></span>
            </div>
            {open && (
                <div style={{ padding: "0 12px 10px", display: "flex", justifyContent: "flex-end", borderTop: `1px solid ${C.border}` }}>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(exp.id); }}
                        style={{ marginTop: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: C.red, borderRadius: 7, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

function Toast({ show, message = "Expense Added Successfully" }) {
    return (
        <div
            style={{
                position: "fixed", left: "50%", bottom: 28, zIndex: 60,
                transform: `translateX(-50%) translateY(${show ? "0" : "12px"})`,
                opacity: show ? 1 : 0, pointerEvents: "none",
                transition: "opacity .25s ease, transform .25s ease",
                display: "flex", alignItems: "center", gap: 8,
                background: "#0f1a15", border: `1px solid ${C.green}66`, color: C.green,
                borderRadius: 30, padding: "10px 18px", fontSize: 13, fontWeight: 700,
                boxShadow: "0 10px 30px rgba(0,0,0,.45)", whiteSpace: "nowrap",
            }}
        >
            <IconCheckCircle size={16} color={C.green} />
            {message}
        </div>
    );
}

/* ------------------------- Add Expense — bottom sheet ------------------------ */
/*
   Redesigned flow: Category → Amount (required) → Description (optional).
   Journey Stage and Date are no longer asked — they're inherited automatically:
     - phase comes from the page-level Journey filter (`currentJourney` prop)
     - date is stamped as "today" at save time
   Saved object shape is UNCHANGED: {id, name, amt, cat, phase, date}
*/
function AddExpenseModal({ open, onClose, onSave, currentJourney }) {
    const [name, setName] = useState("");
    const [amt, setAmt] = useState("");
    // No category is pre-selected — the confirm tick stays disabled until the
    // user actively taps one, per the "disabled until Category is selected" rule.
    const [cat, setCat] = useState(null);
    const amtRef = useRef(null);

    // Mount/animate lifecycle so the sheet can slide out before unmounting
    const [mounted, setMounted] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);

    // Swipe-down-to-close tracking
    const sheetRef = useRef(null);
    const [dragY, setDragY] = useState(0);
    const dragState = useRef({ startY: 0, dragging: false, startedOnHandle: false });

    useEffect(() => {
        if (open) {
            setMounted(true);
            const raf = requestAnimationFrame(() => requestAnimationFrame(() => setAnimateIn(true)));
            return () => cancelAnimationFrame(raf);
        } else if (mounted) {
            setAnimateIn(false);
            const t = setTimeout(() => setMounted(false), 260);
            return () => clearTimeout(t);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // ESC closes modal
    useEffect(() => {
        if (!mounted) return;
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [mounted, onClose]);

    // Body scroll lock while open
    useEffect(() => {
        if (!mounted) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prevOverflow; };
    }, [mounted]);

    // Reset drag offset whenever the sheet opens fresh
    useEffect(() => { if (open) setDragY(0); }, [open]);

    if (!mounted) return null;

    const fInput = { width: "100%", background: "#0d1117", border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, padding: "10px 12px", fontFamily: "inherit", outline: "none" };
    const label = { fontSize: 11, color: C.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 };

    const resetAndClose = () => {
        setName(""); setAmt(""); setCat(null); setDragY(0);
        onClose();
    };

    const parsedAmt = parseFloat(amt);
    const canSave = !!cat && !!parsedAmt && parsedAmt > 0;

    // Description is optional — auto-generated from category when left blank.
    // Journey stage is inherited from the page filter; "All Journey" falls
    // back to "bd" (matches the previous default the modal used to offer).
    const handleSave = () => {
        if (!canSave) return;
        const finalName = name.trim() || autoNameFor(cat);
        const phase = currentJourney === "uk" ? "uk" : "bd";
        onSave({ id: Date.now(), name: finalName, amt: parsedAmt, cat, phase, date: todayDDMMYYYY() });
        resetAndClose();
    };

    const catList = CATEGORY_OPTIONS.filter((o) => o.id !== "all");
    const inheritedPhase = currentJourney === "uk" ? "uk" : "bd";

    /* --- swipe-down-to-close handlers (touch only; harmless on desktop) --- */
    const onTouchStart = (e) => {
        dragState.current.startY = e.touches[0].clientY;
        dragState.current.dragging = true;
    };
    const onTouchMove = (e) => {
        if (!dragState.current.dragging) return;
        const delta = e.touches[0].clientY - dragState.current.startY;
        if (delta > 0) setDragY(delta);
    };
    const onTouchEnd = () => {
        if (!dragState.current.dragging) return;
        dragState.current.dragging = false;
        if (dragY > 110) {
            resetAndClose();
        } else {
            setDragY(0);
        }
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center",
                background: animateIn ? "rgba(0,0,0,.55)" : "rgba(0,0,0,0)",
                transition: "background 0.25s ease",
            }}
        >
            <div
                ref={sheetRef}
                onClick={(e) => e.stopPropagation()}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                style={{
                    width: "100%", maxWidth: 480, background: C.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20,
                    border: `1px solid ${C.border}`, borderBottom: "none", padding: "10px 18px 22px",
                    maxHeight: "88vh", overflowY: dragY > 0 ? "hidden" : "auto",
                    transform: animateIn ? `translateY(${dragY}px)` : "translateY(100%)",
                    transition: dragY > 0 ? "none" : "transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)",
                    touchAction: "none",
                }}
            >
                <div style={{ width: 40, height: 4, background: C.border, borderRadius: 2, margin: "6px auto 14px", cursor: "grab" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>+ Add Expense</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 20, padding: "3px 10px" }}>
                        {JOURNEY_STAGE_LABEL[inheritedPhase]}
                    </div>
                </div>

                {/* Step 1 — Category, tap to select */}
                <div style={{ marginBottom: 14 }}>
                    <div style={label}>Category</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                        {catList.map((o) => {
                            const meta = EXPENSE_CAT_META[o.id] || EXPENSE_CAT_META.other;
                            const active = cat === o.id;
                            return (
                                <button
                                    key={o.id}
                                    type="button"
                                    onClick={() => setCat(o.id)}
                                    style={{
                                        position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                                        padding: "12px 6px 10px", borderRadius: 12, cursor: "pointer", fontFamily: "inherit",
                                        border: `1.5px solid ${active ? C.green : C.border}`,
                                        background: active ? C.greenDim : C.surface2,
                                        transition: "border-color .15s, background .15s",
                                    }}
                                >
                                    {active && (
                                        <span style={{ position: "absolute", top: 5, right: 5, width: 15, height: 15, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <IconCheck size={9} color="#000" />
                                        </span>
                                    )}
                                    <div style={{ width: 30, height: 30, borderRadius: 8, background: meta.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{meta.icon}</div>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: active ? C.green : C.text, textAlign: "center", lineHeight: 1.2 }}>{o.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Step 2 — Amount, only required field. The confirm tick sits
                    right beside it — this is the only way to save, there is
                    no separate Save button anywhere in the sheet. */}
                <div style={{ marginBottom: 14 }}>
                    <div style={label}>Amount (GBP)</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ position: "relative", flex: 1 }}>
                            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 17, fontWeight: 800, color: C.green, pointerEvents: "none" }}>£</span>
                            <input
                                ref={amtRef}
                                type="number" inputMode="decimal" step="0.01" autoFocus value={amt}
                                onChange={(e) => setAmt(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
                                placeholder="0.00"
                                style={{ ...fInput, paddingLeft: 30, fontSize: 20, fontWeight: 800, padding: "13px 14px 13px 30px" }}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={!canSave}
                            aria-label="Confirm and save expense"
                            style={{
                                width: 46, height: 46, borderRadius: "50%", flexShrink: 0, border: "none",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                background: canSave ? C.green : C.surface2,
                                boxShadow: canSave ? "0 2px 10px rgba(0,200,150,0.35)" : "none",
                                cursor: canSave ? "pointer" : "not-allowed",
                                transition: "background .15s, box-shadow .15s, transform .1s",
                                opacity: canSave ? 1 : 0.6,
                            }}
                        >
                            <IconCheck size={20} color={canSave ? "#000" : C.textDim} />
                        </button>
                    </div>
                    {!cat && <div style={{ fontSize: 11, color: C.textDim, marginTop: 6 }}>Select a category above to continue</div>}
                </div>

                {/* Step 3 — Description, optional, moved to the bottom. No
                    Save button follows this — the tick above is the only
                    save action in the sheet. */}
                <div>
                    <div style={label}>Description <span style={{ textTransform: "none", color: C.textDim, fontWeight: 400 }}>(optional)</span></div>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
                        placeholder="Add a short note (optional)"
                        style={fInput}
                    />
                </div>
            </div>
        </div>
    );
}

/* --------------------------------- main ------------------------------------ */

const ExpenseTracker = () => {
    const [expenses, setExpenses] = useState(() => loadLS(EXPENSES_KEY, []));
    useEffect(() => { saveLS(EXPENSES_KEY, expenses); }, [expenses]);

    const [budgetEstimate, setBudgetEstimate] = useState(() => loadLS(BUDGET_ESTIMATE_KEY, null));
    useEffect(() => { setBudgetEstimate(loadLS(BUDGET_ESTIMATE_KEY, null)); }, []);

    const [journey, setJourney] = useState("all");
    const [time, setTime] = useState("all");
    const [cat, setCat] = useState("all");
    const [showAll, setShowAll] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const toastTimerRef = useRef(null);
    const rate = budgetEstimate?.rate || 153;

    const fullSummary = computeSummary(expenses);
    const budgetStatus = computeBudgetStatus(fullSummary.totalSpent, budgetEstimate?.grandTotal || 0);

    const journeyTimeFiltered = applyFilters(expenses, { phase: journey, time });
    const listFiltered = applyFilters(expenses, { phase: journey, cat, time });

    const breakdown = computeCategoryBreakdown(journeyTimeFiltered);
    const analytics = computeAnalytics(journeyTimeFiltered);

    // Saving pushes into `expenses` state, which every summary card, the
    // pie chart, the breakdown list, and the recent-expenses list already
    // derive from on every render — so they refresh automatically with no
    // extra logic. This just also fires the short success toast.
    const addExpense = (exp) => {
        setExpenses((p) => [...p, exp]);
        setToastVisible(true);
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => setToastVisible(false), 2200);
    };
    useEffect(() => () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); }, []);
    const deleteExpense = (id) => setExpenses((p) => p.filter((e) => e.id !== id));

    const badgeColor = { "on-track": C.green, warning: C.amber, exceeded: C.red }[budgetStatus.status];
    const barColor = badgeColor;

    // Donut chart geometry
    const SIZE = 200, STROKE = 26, R = (SIZE - STROKE) / 2, CIRC = 2 * Math.PI * R;
    let cum = 0;
    const segments = breakdown.map((b) => {
        const dash = (b.pct / 100) * CIRC;
        const seg = { ...b, dashArray: `${dash} ${CIRC - dash}`, dashOffset: -cum };
        cum += dash;
        return seg;
    });

    const recentList = [...listFiltered].reverse();
    const visibleList = showAll ? recentList : recentList.slice(0, 3);
    const groupedList = groupByMonthLabel(recentList);

    const timeFilterLabel = TIME_FILTERS.find((f) => f.id === time)?.label || "All Time";

    return (
        <div style={{ background: C.bg, minHeight: "100%", paddingBottom: 12 }}>
            {/* Journey Filter — reused values (all/bd/uk) */}
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                {JOURNEY_FILTERS.map((f) => (
                    <FilterPill key={f.id} active={journey === f.id} onClick={() => setJourney(f.id)} activeColor={C.green}>
                        {f.icon}{f.label}
                    </FilterPill>
                ))}
            </div>

            {/* Time Filter — affects pie chart / analytics / recent expenses */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {TIME_FILTERS.map((f) => (
                    <FilterPill key={f.id} active={time === f.id} onClick={() => setTime(f.id)} activeColor={C.green} compact>
                        <IconCalendar size={13} />{f.label}
                    </FilterPill>
                ))}
            </div>

            {/* Summary Cards — reuse existing totals, always unfiltered */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 10 }}>
                <SummaryCard label="Total Spent" value={fullSummary.totalSpent} rate={rate} color={C.green} icon={<IconWallet size={15} color={C.green} />} />
                <SummaryCard label="Pre-Arrival" value={fullSummary.preSpent} rate={rate} color={C.amber} icon={<IconBriefcase size={15} color={C.amber} />} />
                <SummaryCard label="In UK" value={fullSummary.ukSpent} rate={rate} color={C.blue} icon={<IconBuilding size={15} color={C.blue} />} />
            </div>

            {/* Journey Budget Overview — auto-linked to Budget Calculator, never filtered */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, paddingBottom: 10, borderBottom: `1px solid ${C.border}`, marginBottom: 12 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: C.text }}>Journey Budget Overview</div>
                    <IconInfo size={14} color={C.textDim} />
                </div>

                {!budgetEstimate ? (
                    <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6 }}>
                        No budget estimate found yet. Open the Budget Calculator and calculate your estimated cost — it will appear here automatically.
                    </div>
                ) : (
                    <>
                        <div style={{ display: "flex", marginBottom: 12 }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>Estimated Budget</div>
                                <div style={{ fontSize: 17, fontWeight: 800, color: C.green }}>{fmtGBP(budgetEstimate.grandTotal)}</div>
                            </div>
                            <div style={{ width: 1, background: C.border, margin: "2px 14px" }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>Spent</div>
                                <div style={{ fontSize: 17, fontWeight: 800, color: C.red }}>{fmtGBP(fullSummary.totalSpent)}</div>
                            </div>
                            <div style={{ width: 1, background: C.border, margin: "2px 14px" }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>Remaining</div>
                                <div style={{ fontSize: 17, fontWeight: 800, color: C.blue }}>{fmtGBP(budgetStatus.remaining)}</div>
                            </div>
                        </div>

                        <div style={{ height: 7, background: C.surface2, borderRadius: 4, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${budgetStatus.pct}%`, background: barColor, borderRadius: 4, transition: "width .5s ease" }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                            <div style={{ fontSize: 12, color: C.textMuted }}>{budgetStatus.rawPct.toFixed(1)}% used</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 700, color: badgeColor, background: badgeColor + "18", border: `1px solid ${badgeColor}55`, borderRadius: 20, padding: "3px 10px" }}>
                                {budgetStatus.label} <IconTrendUp size={12} />
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Expense Breakdown — doughnut chart. Now silently follows the
                page-level Time Filter above instead of exposing its own dropdown. */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: C.text }}>Expense Breakdown</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 20, padding: "3px 10px" }}>
                        {timeFilterLabel}
                    </div>
                </div>

                {breakdown.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "20px 10px", color: C.textDim, fontSize: 12.5 }}>No expenses in this range yet.</div>
                ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
                        <div style={{ position: "relative", width: SIZE, height: SIZE, flexShrink: 0, margin: "0 auto" }}>
                            <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ transform: "rotate(-90deg)" }}>
                                <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke={C.surface2} strokeWidth={STROKE} />
                                {segments.map((s) => (
                                    <circle key={s.cat} cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke={s.meta.color} strokeWidth={STROKE} strokeDasharray={s.dashArray} strokeDashoffset={s.dashOffset} />
                                ))}
                            </svg>
                            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{fmtGBP(breakdown.reduce((s, b) => s + b.amt, 0))}</div>
                                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>Total</div>
                            </div>
                        </div>

                        <div style={{ flex: 1, minWidth: 200 }}>
                            {breakdown.map((b) => (
                                <div key={b.cat} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: b.meta.color, flexShrink: 0 }} />
                                    <div style={{ fontSize: 13, color: C.text, flex: 1, minWidth: 0 }}>{titleCase(b.cat)}</div>
                                    <div style={{ fontSize: 12.5, color: C.textMuted, marginRight: 10, flexShrink: 0 }}>{fmtGBP(b.amt)}</div>
                                    <div style={{ fontSize: 12.5, fontWeight: 700, color: C.text, flexShrink: 0, width: 34, textAlign: "right" }}>{b.pct.toFixed(0)}%</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Analytics */}
            {analytics.totalTransactions > 0 && (
                <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>Analytics</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10 }}>
                            <div style={{ fontSize: 9, color: C.textMuted, textTransform: "uppercase", marginBottom: 4 }}>Highest Category</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{analytics.highestCategory ? `${EXPENSE_CAT_META[analytics.highestCategory]?.icon || ""} ${titleCase(analytics.highestCategory)}` : "—"}</div>
                            {analytics.highestCategory && <div style={{ fontSize: 10.5, color: C.textMuted, marginTop: 1 }}>{fmtGBP(analytics.highestCategoryAmt)}</div>}
                        </div>
                        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10 }}>
                            <div style={{ fontSize: 9, color: C.textMuted, textTransform: "uppercase", marginBottom: 4 }}>Largest Expense</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{analytics.largestExpense?.name || "—"}</div>
                            {analytics.largestExpense && <div style={{ fontSize: 10.5, color: C.textMuted, marginTop: 1 }}>{fmtGBP(analytics.largestExpense.amt)}</div>}
                        </div>
                        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10 }}>
                            <div style={{ fontSize: 9, color: C.textMuted, textTransform: "uppercase", marginBottom: 4 }}>Total Transactions</div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{analytics.totalTransactions}</div>
                        </div>
                        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10 }}>
                            <div style={{ fontSize: 9, color: C.textMuted, textTransform: "uppercase", marginBottom: 4 }}>Average Expense</div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{fmtGBP(analytics.averageExpense)}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Category dropdown + Add Expense — one compact row, not full-width */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <Dropdown options={CATEGORY_OPTIONS} value={cat} onChange={setCat} small />
                <button onClick={() => setFormOpen(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: C.green, color: "#000", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" }}>
                    <IconPlus size={14} /> Add Expense
                </button>
            </div>

            {/* Recent Expenses */}
            <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: C.text }}>Recent Expenses</div>
                    {recentList.length > 3 && (
                        <button onClick={() => setShowAll((v) => !v)} style={{ background: "none", border: "none", color: C.blue, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
                            {showAll ? "Show Less" : "View All"}
                        </button>
                    )}
                </div>

                {recentList.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "24px 16px", color: C.textMuted }}>
                        <div style={{ fontSize: 34, marginBottom: 6 }}>💳</div>
                        <p style={{ fontSize: 13, lineHeight: 1.5 }}>No expenses logged yet.<br />Track from your first IELTS payment<br />all the way through life in the UK.</p>
                    </div>
                ) : !showAll ? (
                    visibleList.map((exp) => (
                        <ExpenseRow key={exp.id} exp={exp} meta={EXPENSE_CAT_META[exp.cat] || EXPENSE_CAT_META.other} onDelete={deleteExpense} />
                    ))
                ) : (
                    Object.entries(groupedList).map(([month, exps]) => (
                        <div key={month}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: 0.6, padding: "5px 0 3px" }}>{month}</div>
                            {exps.map((exp) => (
                                <ExpenseRow key={exp.id} exp={exp} meta={EXPENSE_CAT_META[exp.cat] || EXPENSE_CAT_META.other} onDelete={deleteExpense} />
                            ))}
                        </div>
                    ))
                )}
            </div>

            <AddExpenseModal open={formOpen} onClose={() => setFormOpen(false)} onSave={addExpense} currentJourney={journey} />
            <Toast show={toastVisible} />
        </div>
    );
};

export default ExpenseTracker;
