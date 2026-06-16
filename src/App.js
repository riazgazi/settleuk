import { useState, useEffect, useRef } from "react";

// ============================================================
// DATA
// ============================================================
const STATUSES = [
  { id: 0, label: "Just researching",      sub: "Exploring UK study options",          emoji: "🔍" },
  { id: 1, label: "Applied to university", sub: "Waiting for offer letter",            emoji: "📝" },
  { id: 2, label: "Offer received",        sub: "Got conditional/unconditional offer", emoji: "🎉" },
  { id: 3, label: "CAS received",          sub: "University sent CAS number",          emoji: "📋" },
  { id: 4, label: "Visa applied",          sub: "Application submitted",               emoji: "⏳" },
  { id: 5, label: "Visa approved",         sub: "Ready to travel to UK",               emoji: "✅" },
  { id: 6, label: "Already in UK",         sub: "Arrived and settling",                emoji: "🇬🇧" },
];

const ALL_STAGE_NAMES = ["Research", "Apply", "Offer", "CAS", "Visa", "Approved", "UK"];

// Task ID → status it auto-advances to when completed
const AUTO_ADVANCE = {
  "t0-2": 1,
  "t1-1": 2,
  "t2-3": 3,
  "t3-2": 4,
  "t4-1": 5,
  "t5-1": 6,
};

const STAGES = [
  {
    id: 0, name: "Research & IELTS",
    nextAction: "Book IELTS test", deadline: "ASAP — 6-12 months before intake", deadlineUrgency: "medium",
    emotion: "Great time to start! Early preparation means better university options.",
    accentBtn: "#185FA5", chipColor: "#185FA5",
    tasks: [
      { id: "t0-1", text: "Research UK universities on UCAS", priority: true },
      { id: "t0-2", text: "Register for IELTS or PTE Academic", priority: true, autoAdvance: true },
      { id: "t0-3", text: "Prepare personal statement draft" },
      { id: "t0-4", text: "Check tuition fees and scholarship options" },
      { id: "t0-5", text: "Contact university admissions teams" },
    ],
    insights: [
      { type: "tip",  title: "Start early",    sub: "Universities with September intake usually open applications 12 months ahead." },
      { type: "info", title: "IELTS validity", sub: "IELTS scores are valid for 2 years — plan your test date accordingly." },
    ],
  },
  {
    id: 1, name: "University application",
    nextAction: "Follow up with admissions", deadline: "Check portal this week", deadlineUrgency: "high",
    emotion: "Application submitted! Most universities reply within 4-8 weeks. Stay patient.",
    accentBtn: "#534AB7", chipColor: "#534AB7",
    tasks: [
      { id: "t1-1", text: "Log in to portal & confirm offer received", priority: true, autoAdvance: true },
      { id: "t1-2", text: "Prepare for possible interview", priority: true },
      { id: "t1-3", text: "Gather financial documents early" },
      { id: "t1-4", text: "Research student accommodation options" },
      { id: "t1-5", text: "Connect with current students on LinkedIn" },
    ],
    insights: [
      { type: "tip",  title: "Be reachable", sub: "Universities may email or call for interviews — check spam folder regularly." },
      { type: "info", title: "Average wait",  sub: "Most UK universities respond within 4-8 weeks of application." },
    ],
  },
  {
    id: 2, name: "Offer received",
    nextAction: "Accept offer and pay deposit", deadline: "Check offer letter for deadline", deadlineUrgency: "high",
    emotion: "Congratulations! Time to accept your offer and prepare for CAS.",
    accentBtn: "#0F6E56", chipColor: "#0F6E56",
    tasks: [
      { id: "t2-1", text: "Accept unconditional offer formally",  priority: true },
      { id: "t2-2", text: "Pay tuition deposit to secure place",  priority: true },
      { id: "t2-3", text: "Request CAS number from university",   priority: true, autoAdvance: true },
      { id: "t2-4", text: "Start saving bank statement (28 days)" },
      { id: "t2-5", text: "Book TB test appointment (Bangladesh)" },
    ],
    insights: [
      { type: "warn", title: "Conditional offer?",    sub: "Make sure you meet all conditions before requesting CAS." },
      { type: "tip",  title: "Bank statement timing", sub: "Start your 28-day bank statement period now — it takes time to build up." },
    ],
  },
  {
    id: 3, name: "CAS received",
    nextAction: "Submit visa application online", deadline: "At least 3 months before intake", deadlineUrgency: "critical",
    emotion: "CAS received — this is the most critical stage. Apply for visa immediately.",
    accentBtn: "#993C1D", chipColor: "#993C1D",
    tasks: [
      { id: "t3-1", text: "Pay Immigration Health Surcharge (IHS)",   priority: true },
      { id: "t3-2", text: "Complete & submit online visa application", priority: true, autoAdvance: true },
      { id: "t3-3", text: "Prepare 28-day bank statement",            priority: true },
      { id: "t3-4", text: "Book biometric appointment at UKVCAS",     priority: true },
      { id: "t3-5", text: "Collect TB test certificate" },
      { id: "t3-6", text: "Book flights once visa is submitted" },
    ],
    insights: [
      { type: "warn", title: "Bank statement risk",  sub: "Must show funds for 28 consecutive days. Any dip restarts the count." },
      { type: "tip",  title: "Apply early for visa", sub: "Average processing: 3 weeks. Apply soon to stay safe before intake." },
      { type: "info", title: "TB test required",     sub: "Bangladesh is on the TB test list. Book appointment before visa application." },
    ],
  },
  {
    id: 4, name: "Visa applied",
    nextAction: "Prepare pre-departure checklist", deadline: "Decision usually in 3 weeks", deadlineUrgency: "medium",
    emotion: "Visa submitted! Average decision time: 3 weeks. Use this time to prep for departure.",
    accentBtn: "#854F0B", chipColor: "#854F0B",
    tasks: [
      { id: "t4-1", text: "Book flights — visa approved, time to fly!", priority: true, autoAdvance: true },
      { id: "t4-2", text: "Confirm university accommodation booking",    priority: true },
      { id: "t4-3", text: "Order eSIM (GiffGaff, Lebara)" },
      { id: "t4-4", text: "Get travel insurance" },
      { id: "t4-5", text: "Pack essentials — clothes for cold weather" },
      { id: "t4-6", text: "Inform home bank about travel" },
    ],
    insights: [
      { type: "tip",  title: "Use the waiting time well", sub: "Visa decisions take about 3 weeks — perfect time to prep for departure." },
      { type: "info", title: "Priority service",          sub: "Priority visa service gives a decision in 5 working days if short on time." },
    ],
  },
  {
    id: 5, name: "Visa approved",
    nextAction: "Check BRP collection Post Office", deadline: "Note it in your visa vignette", deadlineUrgency: "high",
    emotion: "Visa approved! You are going to the UK. Final preparations — almost there!",
    accentBtn: "#0F6E56", chipColor: "#0F6E56",
    tasks: [
      { id: "t5-1", text: "Noted BRP Post Office — I have arrived in UK!", priority: true, autoAdvance: true },
      { id: "t5-2", text: "Download bank app (Monzo/Starling)" },
      { id: "t5-3", text: "Join university Facebook/WhatsApp groups" },
      { id: "t5-4", text: "Pack documents in hand luggage only" },
      { id: "t5-5", text: "Confirm airport pickup or transport" },
      { id: "t5-6", text: "Exchange some cash to GBP" },
    ],
    insights: [
      { type: "warn", title: "BRP collection deadline", sub: "You must collect your BRP within 10 days of arrival or as stated on your visa." },
      { type: "tip",  title: "Keep documents handy",   sub: "Passport, visa, offer letter, CAS — all in hand luggage, never checked baggage." },
    ],
  },
  {
    id: 6, name: "Arrived in UK",
    nextAction: "Collect BRP from Post Office", deadline: "Within 10 days of arrival", deadlineUrgency: "critical",
    emotion: "Welcome to the UK! Complete these tasks in order — do not delay BRP collection.",
    accentBtn: "#0F6E56", chipColor: "#0F6E56",
    tasks: [
      { id: "t6-1", text: "Collect BRP from Post Office",            priority: true },
      { id: "t6-2", text: "Open Monzo or Starling bank account",     priority: true },
      { id: "t6-3", text: "Register at university — get student ID", priority: true },
      { id: "t6-4", text: "Register with local NHS GP surgery" },
      { id: "t6-5", text: "Apply for NI Number (call 0800 141 2075)" },
      { id: "t6-6", text: "Get council tax exemption letter" },
    ],
    insights: [
      { type: "warn", title: "BRP first!",           sub: "Collect your BRP within 10 days — delays can cause legal issues." },
      { type: "tip",  title: "NI Number takes time", sub: "Apply for your National Insurance number now — it can take 4-8 weeks." },
    ],
  },
];

const DOCS = [
  { id: "d1",  name: "Passport",           hint: "Valid 6+ months",           icon: "🛂" },
  { id: "d2",  name: "Offer Letter",        hint: "Conditional/unconditional", icon: "📄" },
  { id: "d3",  name: "CAS Number",          hint: "From university",           icon: "🎓" },
  { id: "d4",  name: "IELTS Certificate",   hint: "Score 6.0+ usually",        icon: "📝" },
  { id: "d5",  name: "Bank Statement",      hint: "28 consecutive days",       icon: "💷" },
  { id: "d6",  name: "TB Test Result",      hint: "From approved clinic",      icon: "🩺" },
  { id: "d7",  name: "Passport Photos",     hint: "2 recent photos",           icon: "🖼️" },
  { id: "d8",  name: "IHS Receipt",         hint: "After payment",             icon: "🛡️" },
  { id: "d9",  name: "Personal Statement",  hint: "For visa form",             icon: "✍️" },
  { id: "d10", name: "Accommodation Proof", hint: "Uni halls or rental",       icon: "🏠" },
  { id: "d11", name: "BRP / Visa Vignette", hint: "After visa approval",       icon: "🪪" },
  { id: "d12", name: "NI Number Letter",    hint: "From HMRC",                 icon: "🔢" },
];

const GUIDES = [
  { title: "NHS registration",       sub: "Free healthcare access",       icon: "🩺", url: "https://www.nhs.uk/service-search/find-a-gp" },
  { title: "Open UK bank account",   sub: "Monzo, Starling, Wise",        icon: "🏦", url: "https://monzo.com" },
  { title: "Apply for NI number",    sub: "Call 0800 141 2075",           icon: "🔢", url: "https://www.gov.uk/apply-national-insurance-number" },
  { title: "BRP collection guide",   sub: "Collect within 10 days",       icon: "🪪", url: "https://www.gov.uk/biometric-residence-permits" },
  { title: "Council tax exemption",  sub: "Students usually exempt",      icon: "📬", url: "https://www.gov.uk/council-tax/who-has-to-pay" },
  { title: "Right to work",          sub: "Max 20hrs/week term time",     icon: "✅", url: "https://www.gov.uk/prove-right-to-work" },
  { title: "UK Visa Application",    sub: "Official gov.uk portal",       icon: "📜", url: "https://www.gov.uk/student-visa" },
  { title: "UKCISA Student Support", sub: "International student advice", icon: "🎓", url: "https://www.ukcisa.org.uk" },
  { title: "GiffGaff UK SIM",        sub: "Order eSIM before flying",     icon: "📱", url: "https://www.giffgaff.com" },
  { title: "Wise — Send Money",      sub: "Best exchange rates",          icon: "💸", url: "https://wise.com" },
];

// ============================================================
// UNIVERSITY FINDER — rule-based qualification bands + real search links
// ============================================================
const UNI_BANDS_BACHELOR = [
  { min: 5.0, label: "Top-tier eligible",     desc: "Russell Group & top 20 universities likely within reach (with good IELTS).", examples: ["University of Manchester", "King's College London", "University of Leeds", "University of Birmingham"] },
  { min: 4.0, label: "Strong standing",       desc: "Well-ranked universities widely accept this profile.",                       examples: ["Coventry University", "University of Hertfordshire", "Cardiff Metropolitan University", "Aston University"] },
  { min: 3.0, label: "Good standing",         desc: "Many UK universities with foundation/pathway options will accept this.",      examples: ["University of Sunderland", "University of East London", "Teesside University", "University of Bolton"] },
  { min: 0,   label: "Foundation route likely", desc: "A foundation year before the bachelor's degree is commonly recommended.",   examples: ["University of West London (foundation)", "Ravensbourne University (foundation)", "Pathway providers via Kaplan/INTO"] },
];

const UNI_BANDS_MASTERS = [
  { min: 3.5, label: "Top-tier eligible",     desc: "Strong CGPA — Russell Group postgraduate programs are realistic targets.",    examples: ["University of Manchester", "University of Leeds", "Queen Mary University of London", "University of Sheffield"] },
  { min: 3.0, label: "Strong standing",       desc: "Most well-ranked universities accept this CGPA for Master's admission.",       examples: ["Coventry University", "University of Hertfordshire", "Aston University", "University of Portsmouth"] },
  { min: 2.5, label: "Good standing",         desc: "Many universities accept with relevant work experience or a strong SOP.",      examples: ["University of Sunderland", "University of Bolton", "University of East London", "Teesside University"] },
  { min: 0,   label: "Pre-Master's route likely", desc: "A pre-master's / pathway program may be required first.",                 examples: ["University of Hertfordshire (pre-master's)", "Kaplan pathway centres", "INTO pathway centres"] },
];

function getUniBand(level, gpaOrCgpa) {
  const bands = level === "masters" ? UNI_BANDS_MASTERS : UNI_BANDS_BACHELOR;
  return bands.find(b => gpaOrCgpa >= b.min) || bands[bands.length - 1];
}

const SEARCH_LINKS = [
  { name: "UCAS Course Search",    icon: "🎓", url: "https://www.ucas.com/explore/search/results" },
  { name: "Hotcourses Abroad",     icon: "🔎", url: "https://www.hotcoursesabroad.com/" },
  { name: "FindAMasters",          icon: "📚", url: "https://www.findamasters.com/" },
  { name: "British Council",      icon: "🇬🇧", url: "https://www.britishcouncil.org/study-work-abroad/in-uk" },
];


function loadLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function saveLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ============================================================
// COMPONENT: Circular Readiness Ring
// ============================================================
function ReadinessRing({ score, color }) {
  const r = 32, cx = 40, cy = 40;
  const circ = 2 * Math.PI * r;
  const filled = circ * (score / 100);
  return (
    <svg width={cx * 2} height={cy * 2} viewBox={`0 0 ${cx * 2} ${cy * 2}`} style={{ flexShrink: 0 }}>
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
      {/* UK flag arc at 100% position — decorative dot */}
      <circle cx={cx} cy={cy - r} r={4} fill="rgba(255,255,255,0.12)" />
      {/* Fill */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray 0.8s ease" }} />
      {/* Score number */}
      <text x={cx} y={cy - 4} textAnchor="middle" fill="#EEF2F7" fontSize="16" fontWeight="800">{score}</text>
      <text x={cx} y={cy + 9} textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize="8">/100</text>
      {/* UK flag mini at top */}
      <text x={cx} y={cy - r - 10} textAnchor="middle" fontSize="10">🇬🇧</text>
    </svg>
  );
}

// ============================================================
// COMPONENT: Readiness Score Card
// ============================================================
function ReadinessScore({ stIdx, taskDone, docChecked, sg }) {
  const totalTasks     = STAGES.reduce((s, st) => s + st.tasks.length, 0);
  const completedTasks = Object.values(taskDone).filter(Boolean).length;
  const completedDocs  = Object.values(docChecked).filter(Boolean).length;
  const score = Math.min(100,
    Math.round((completedTasks / totalTasks) * 50) +
    Math.round((completedDocs  / DOCS.length) * 30) +
    Math.round((stIdx / (ALL_STAGE_NAMES.length - 1)) * 20)
  );

  const label      = score >= 80 ? "Excellent" : score >= 60 ? "On Track" : score >= 40 ? "Good Start" : "Getting Started";
  const labelColor = score >= 80 ? "#3DB88B"   : score >= 60 ? "#5B8DEF"  : score >= 40 ? "#E8A838"    : "#6B8FA8";
  const nextTarget = score >= 80 ? null        : score >= 60 ? 80         : score >= 40 ? 60           : 40;

  const hints = [];
  if (nextTarget) {
    if (completedTasks < 3) hints.push("Complete priority tasks in Tasks tab");
    if (completedDocs  < 4) hints.push("Mark key documents as ready in Docs tab");
    if (stIdx < 2)          hints.push("Progress your application stage");
  }

  const barGradient = score >= 80
    ? "linear-gradient(90deg,#3DB88B,#5BE8AC)"
    : score >= 60
    ? "linear-gradient(90deg,#5B8DEF,#3DB88B)"
    : score >= 40
    ? "linear-gradient(90deg,#E8A838,#5B8DEF)"
    : "linear-gradient(90deg,#534AB7,#E8A838)";

  return (
    <div style={{
      marginBottom: 16, padding: "14px 16px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      display: "flex", gap: 14, alignItems: "center",
    }}>
      <ReadinessRing score={score} color={labelColor} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.28)", marginBottom: 4 }}>
          Readiness Score
        </div>
        {/* "X of 100 · Label" — not scary */}
        <div style={{ fontSize: 13, fontWeight: 800, color: labelColor, marginBottom: 7, lineHeight: 1.3 }}>
          {score} of 100 points
          <span style={{
            display: "inline-block", marginLeft: 8,
            fontSize: 10, fontWeight: 700,
            color: labelColor, background: labelColor + "20",
            padding: "1px 8px", borderRadius: 20,
          }}>{label}</span>
        </div>

        {/* Progress bar */}
        <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 5, overflow: "hidden", marginBottom: 7 }}>
          <div style={{ height: "100%", width: `${score}%`, background: barGradient, borderRadius: 5, transition: "width 0.6s ease" }} />
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: hints.length ? 8 : 0 }}>
          <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.28)" }}>✅ {completedTasks} tasks</span>
          <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.28)" }}>📄 {completedDocs} docs</span>
        </div>

        {/* Readiness engine hints */}
        {nextTarget && hints.length > 0 && (
          <div style={{ padding: "7px 10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 9 }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: "rgba(255,255,255,0.22)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
              To reach {nextTarget}/100
            </div>
            {hints.slice(0, 2).map((h, i) => (
              <div key={i} style={{ fontSize: 10.5, color: "rgba(255,255,255,0.38)", display: "flex", gap: 5, marginBottom: i < hints.length - 1 ? 3 : 0 }}>
                <span style={{ color: sg.accentBtn }}>▸</span>{h}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT: Status Dropdown — prominent
// ============================================================
function StatusDropdown({ statusId, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = STATUSES[statusId];

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <div ref={ref} style={{ marginBottom: 16, position: "relative" }}>
      {/* Label row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "rgba(255,255,255,0.3)" }}>
          Current Status
        </span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.22)", fontStyle: "italic" }}>tap to change</span>
      </div>

      {/* Trigger button — bright border, glow */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10,
          padding: "12px 14px",
          background: "rgba(61,184,139,0.09)",
          border: "2px solid #3DB88B",
          borderRadius: 14, cursor: "pointer", textAlign: "left",
          color: "#EEF2F7",
          boxShadow: "0 0 0 4px rgba(61,184,139,0.1), 0 2px 12px rgba(61,184,139,0.15)",
        }}
      >
        {/* Animated pulse dot */}
        <style>{`@keyframes sdpulse{0%,100%{transform:scale(1);opacity:0.85}50%{transform:scale(2.5);opacity:0}}`}</style>
        <span style={{ position: "relative", width: 10, height: 10, flexShrink: 0 }}>
          <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#3DB88B", animation: "sdpulse 2s infinite" }} />
          <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#3DB88B" }} />
        </span>
        <span style={{ flex: 1, fontSize: 14.5, fontWeight: 800, color: "#3DB88B" }}>
          {current.emoji} {current.label}
        </span>
        <span style={{
          fontSize: 11, color: "rgba(255,255,255,0.4)",
          display: "inline-block",
          transition: "transform 0.2s",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
        }}>▼</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 200,
          background: "#0D1E2F",
          border: "1.5px solid rgba(61,184,139,0.3)",
          borderRadius: 14, overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,0.65)",
        }}>
          {STATUSES.map(s => (
            <button key={s.id} onClick={() => { onChange(s.id); setOpen(false); }} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "11px 14px",
              background: s.id === statusId ? "rgba(61,184,139,0.12)" : "transparent",
              border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)",
              color: s.id === statusId ? "#3DB88B" : "rgba(255,255,255,0.6)",
              fontSize: 13, fontWeight: s.id === statusId ? 800 : 500,
              cursor: "pointer", textAlign: "left",
            }}>
              <span style={{ fontSize: 16 }}>{s.emoji}</span>
              <span style={{ flex: 1 }}>{s.label}</span>
              {s.id === statusId && <span style={{ color: "#3DB88B", fontSize: 13 }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// COMPONENT: Countdown Card — color shifts green→yellow→red
// ============================================================
function CountdownCard({ arrivalDays }) {
  if (arrivalDays === null) return null;
  const arrived = arrivalDays <= 0;
  const color = arrived ? "#3DB88B"
    : arrivalDays < 20  ? "#E85B5B"
    : arrivalDays < 60  ? "#E8A838"
    : "#3DB88B";
  const msg = arrived
    ? "Welcome! Complete your settlement tasks."
    : arrivalDays < 20  ? "⚠️ Very soon — make sure everything is ready!"
    : arrivalDays < 60  ? "Getting close — stay on top of your tasks."
    : "Stay consistent and plan ahead.";

  return (
    <div style={{
      marginBottom: 16,
      background: `linear-gradient(135deg,${color}10 0%,rgba(24,95,165,0.05) 100%)`,
      border: `1.5px solid ${color}45`,
      borderRadius: 16, padding: "14px 16px",
      display: "flex", alignItems: "center", gap: 14,
    }}>
      <div style={{
        width: 60, height: 60, borderRadius: 14, flexShrink: 0,
        background: `${color}14`, border: `2px solid ${color}55`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        {arrived
          ? <span style={{ fontSize: 28 }}>🇬🇧</span>
          : <>
              <span style={{ fontSize: 9, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 0.4 }}>Days</span>
              <span style={{ fontSize: 26, fontWeight: 900, color, lineHeight: 1.1 }}>{arrivalDays}</span>
            </>
        }
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#EEF2F7", marginBottom: 3 }}>
          {arrived ? "You're in the UK! 🎉" : `${arrivalDays} Days Until UK Arrival`}
        </div>
        <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.5 }}>{msg}</div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT: Stepper Progress Bar
// ============================================================
function StepperBar({ stIdx, sg }) {
  const total = ALL_STAGE_NAMES.length;
  const pct   = Math.round((stIdx / (total - 1)) * 100);
  return (
    <div style={{ marginBottom: 16, padding: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#EEF2F7", marginBottom: 2 }}>{ALL_STAGE_NAMES[stIdx]}</div>
          <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.32)", fontWeight: 600 }}>Step {stIdx + 1} of {total}</div>
        </div>
        <span style={{ fontSize: 12, fontWeight: 800, color: sg.accentBtn, background: sg.accentBtn + "22", padding: "4px 11px", borderRadius: 20 }}>{pct}% Complete</span>
      </div>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ position: "absolute", top: "38%", left: 10, right: 10, height: 3, background: "rgba(255,255,255,0.07)", transform: "translateY(-50%)", borderRadius: 3, zIndex: 0 }}>
          <div style={{ height: "100%", width: stIdx === 0 ? "0%" : `${(stIdx / (total - 1)) * 100}%`, background: `linear-gradient(90deg,${sg.accentBtn},#3DB88B)`, borderRadius: 3, transition: "width 0.5s ease" }} />
        </div>
        {ALL_STAGE_NAMES.map((name, i) => {
          const done = i < stIdx, cur = i === stIdx;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, zIndex: 1 }}>
              <div style={{
                width: cur ? 26 : 18, height: cur ? 26 : 18, borderRadius: "50%",
                border: `2.5px solid ${done ? "#3DB88B" : cur ? sg.accentBtn : "rgba(255,255,255,0.14)"}`,
                background: done ? "#3DB88B" : cur ? sg.accentBtn + "30" : "rgba(255,255,255,0.04)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: cur ? 11 : 9, color: done ? "#fff" : cur ? sg.accentBtn : "rgba(255,255,255,0.22)",
                fontWeight: 800, boxShadow: cur ? `0 0 0 4px ${sg.accentBtn}22` : "none", transition: "all 0.3s",
              }}>
                {done ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 8.5, fontWeight: cur ? 800 : 500, color: cur ? sg.accentBtn : done ? "rgba(255,255,255,0.38)" : "rgba(255,255,255,0.16)", textAlign: "center", whiteSpace: "nowrap" }}>
                {name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT: Next Best Action
// ============================================================
function NextBestAction({ sg, onStart }) {
  const uc = {
    critical: { bg: "rgba(232,91,91,0.08)",   border: "rgba(232,91,91,0.3)",   badge: "#E85B5B", badgeBg: "rgba(232,91,91,0.15)",   label: "🔴 Urgent" },
    high:     { bg: "rgba(232,168,56,0.08)",  border: "rgba(232,168,56,0.3)",  badge: "#E8A838", badgeBg: "rgba(232,168,56,0.15)",  label: "🟡 This Week" },
    medium:   { bg: "rgba(91,141,239,0.06)",  border: "rgba(91,141,239,0.2)",  badge: "#5B8DEF", badgeBg: "rgba(91,141,239,0.15)",  label: "🔵 Upcoming" },
  }[sg.deadlineUrgency] || {};
  return (
    <div style={{ background: uc.bg, border: `1px solid ${uc.border}`, borderRadius: 16, padding: "14px 16px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.8, color: sg.accentBtn }}>🎯 Next Action</span>
        <span style={{ fontSize: 9.5, fontWeight: 700, color: uc.badge, background: uc.badgeBg, padding: "2px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 0.4 }}>{uc.label}</span>
      </div>
      <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 5, color: "#EEF2F7", lineHeight: 1.3 }}>{sg.nextAction}</div>
      <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", marginBottom: 12, display: "flex", alignItems: "center", gap: 5 }}>
        <span>🕒</span><span>{sg.deadline}</span>
      </div>
      <button onClick={onStart} style={{ width: "100%", padding: "9px 0", background: sg.accentBtn, border: "none", borderRadius: 10, color: "#fff", fontSize: 13.5, fontWeight: 800, cursor: "pointer", boxShadow: `0 3px 12px ${sg.accentBtn}44` }}>
        Start Now →
      </button>
    </div>
  );
}

// ============================================================
// COMPONENT: Quick Action Card — with mini progress bar
// ============================================================
function QuickCard({ icon, title, sub, pct, onClick }) {
  return (
    <div onClick={onClick} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px", cursor: "pointer" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: pct !== undefined ? 9 : 0 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.38)" }}>{sub}</div>
        </div>
      </div>
      {pct !== undefined && (
        <>
          <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden", marginBottom: 3 }}>
            <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#3DB88B" : "linear-gradient(90deg,#534AB7,#3DB88B)", borderRadius: 3, transition: "width 0.4s" }} />
          </div>
          <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.25)", textAlign: "right" }}>{pct}%</div>
        </>
      )}
    </div>
  );
}

// ============================================================
// COMPONENT: University Finder Flow (popup/bottom-sheet)
// Steps: intro -> level confirm -> academic form -> results
// ============================================================
function UniversityFinderFlow({ onClose, onSaveProfile, savedAcademic }) {
  const [step, setStep] = useState("intro"); // intro | level | form | results
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
      <div style={{ width: "100%", maxWidth: 460, background: "#0D1E2F", borderRadius: "24px 24px 0 0", padding: "24px 22px 28px", border: "1px solid rgba(255,255,255,0.1)", maxHeight: "88vh", overflowY: "auto" }}>

        {/* Drag handle */}
        <div style={{ width: 40, height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 4, margin: "0 auto 18px" }} />

        {/* ── INTRO ── */}
        {step === "intro" && (
          <div>
            <div style={{ fontSize: 34, marginBottom: 10, textAlign: "center" }}>🎓</div>
            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 800, marginBottom: 8, textAlign: "center" }}>Get Personalized University Recommendations</h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.6, marginBottom: 22, textAlign: "center" }}>
              Complete your academic profile to receive university and course suggestions based on your grades.
            </p>
            <button onClick={() => setStep("level")} style={btn("#3DB88B")}>🔵 Complete Profile</button>
            <button onClick={handleSkip} style={{ ...btn("transparent"), marginTop: 10, border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }}>⚪ Skip for Now</button>
          </div>
        )}

        {/* ── LEVEL CONFIRM ── */}
        {step === "level" && (
          <div>
            <button onClick={() => setStep("intro")} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13, marginBottom: 14, padding: 0 }}>← Back</button>
            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Which level are you applying for?</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12.5, marginBottom: 18 }}>This determines which grades we'll ask for next.</p>

            <button onClick={() => { setLevel("bachelor"); setStep("form"); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px", marginBottom: 10, background: level === "bachelor" ? "rgba(61,184,139,0.12)" : "rgba(255,255,255,0.05)", border: `1.5px solid ${level === "bachelor" ? "#3DB88B" : "rgba(255,255,255,0.1)"}`, borderRadius: 14, color: "#fff", cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: 22 }}>🎓</span>
              <span><div style={{ fontWeight: 800, fontSize: 14 }}>Bachelor's Degree</div><div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)" }}>Undergraduate — based on SSC & HSC GPA</div></span>
            </button>

            <button onClick={() => { setLevel("masters"); setStep("form"); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px", background: level === "masters" ? "rgba(61,184,139,0.12)" : "rgba(255,255,255,0.05)", border: `1.5px solid ${level === "masters" ? "#3DB88B" : "rgba(255,255,255,0.1)"}`, borderRadius: 14, color: "#fff", cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: 22 }}>📘</span>
              <span><div style={{ fontWeight: 800, fontSize: 14 }}>Master's Degree</div><div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)" }}>Postgraduate — based on Bachelor's CGPA</div></span>
            </button>

            <button onClick={handleSkip} style={{ ...btn("transparent"), marginTop: 16, border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>⚪ Skip for Now</button>
          </div>
        )}

        {/* ── ACADEMIC FORM ── */}
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

            <button disabled={!gpaOk} onClick={() => setStep("results")} style={{ ...btn("#3DB88B", !gpaOk), marginTop: 6 }}>See My Recommendations →</button>
            <button onClick={handleSkip} style={{ ...btn("transparent"), marginTop: 10, border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>⚪ Skip for Now</button>
          </div>
        )}

        {/* ── RESULTS ── */}
        {step === "results" && band && (
          <div>
            <button onClick={() => setStep("form")} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13, marginBottom: 14, padding: 0 }}>← Edit profile</button>

            <div style={{ background: "rgba(61,184,139,0.08)", border: "1px solid rgba(61,184,139,0.3)", borderRadius: 16, padding: "16px", marginBottom: 16, textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Your Band</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#3DB88B", marginBottom: 6 }}>{band.label}</div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{band.desc}</div>
            </div>

            <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>Universities to explore</h3>
            <div style={{ marginBottom: 18 }}>
              {band.examples.map((u, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginBottom: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10 }}>
                  <span style={{ fontSize: 15 }}>🏛️</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#EEF2F7" }}>{u}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(232,168,56,0.07)", border: "1px solid rgba(232,168,56,0.2)", borderRadius: 12, padding: "10px 14px", marginBottom: 18, fontSize: 11.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
              💡 This is a rough estimate, not an admission guarantee. Always check each university's official entry requirements.
            </div>

            <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>Search real courses & universities</h3>
            {SEARCH_LINKS.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", marginBottom: 7, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, textDecoration: "none", color: "#EEF2F7" }}>
                <span style={{ fontSize: 17 }}>{s.icon}</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{s.name}</span>
                <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>↗</span>
              </a>
            ))}

            <button onClick={handleSaveAndClose} style={{ ...btn("#3DB88B"), marginTop: 16 }}>Save Profile & Continue ✓</button>
          </div>
        )}
      </div>
    </div>
  );
}


export default function App() {
  const [screen,        setScreen]        = useState(() => { const s = loadLS("settleuk_profile", null); return s && s.name ? "home" : "onboard"; });
  const [profile,       setProfile]       = useState(() => loadLS("settleuk_profile", { name: "", statusId: 0, arrival: "", step: 0 }));
  const [taskDone,      setTaskDone]      = useState(() => loadLS("settleuk_tasks",   {}));
  const [docChecked,    setDocChecked]    = useState(() => loadLS("settleuk_docs",    {}));
  const [tab,           setTab]           = useState("home");
  const [showSettings,  setShowSettings]  = useState(false);
  const [editProfile,   setEditProfile]   = useState({ name: "", arrival: "" });
  const [showToast,     setShowToast]     = useState("");
  const [advancePrompt, setAdvancePrompt] = useState(null);
  const [showUniFinder, setShowUniFinder] = useState(false);
  const [academicProfile, setAcademicProfile] = useState(() => loadLS("settleuk_academic", null));
  const [skipWarning,   setSkipWarning]   = useState(null);

  useEffect(() => { saveLS("settleuk_profile", profile);    }, [profile]);
  useEffect(() => { saveLS("settleuk_tasks",   taskDone);   }, [taskDone]);
  useEffect(() => { saveLS("settleuk_docs",    docChecked); }, [docChecked]);
  useEffect(() => { if (academicProfile) saveLS("settleuk_academic", academicProfile); }, [academicProfile]);

  const toggleDoc = (id) => setDocChecked(p => ({ ...p, [id]: !p[id] }));

  const changeStatus = (toId) => {
    const currentId = profile.statusId || 0;
    if (toId > currentId + 1) {
      const incomplete = [];
      for (let s = currentId; s < toId; s++) {
        STAGES[s].tasks
          .filter(t => t.priority && !taskDone[t.id])
          .forEach(t => incomplete.push({ stage: STAGES[s].name, text: t.text }));
      }
      if (incomplete.length > 0) {
        setSkipWarning({ toId, incompleteTasks: incomplete });
        return;
      }
    }
    setProfile(p => ({ ...p, statusId: toId }));
    if (toId === 0 && !academicProfile) setShowUniFinder(true);
  };

  const toggleTask = (id) => {
    const nowDone = !taskDone[id];
    setTaskDone(p => ({ ...p, [id]: nowDone }));
    if (nowDone && AUTO_ADVANCE[id] !== undefined) {
      const toStatus = AUTO_ADVANCE[id];
      if (toStatus > (profile.statusId || 0)) {
        let taskText = "";
        for (const s of STAGES) { const t = s.tasks.find(t => t.id === id); if (t) { taskText = t.text; break; } }
        setAdvancePrompt({ taskId: id, toStatusId: toStatus, taskText });
      }
    }
    if (!nowDone && AUTO_ADVANCE[id] !== undefined && profile.statusId === AUTO_ADVANCE[id]) {
      setProfile(p => ({ ...p, statusId: AUTO_ADVANCE[id] - 1 }));
    }
  };

  const confirmAdvance = () => {
    if (advancePrompt) {
      setProfile(p => ({ ...p, statusId: advancePrompt.toStatusId }));
      setShowToast("🎉 Status updated automatically!");
      setTimeout(() => setShowToast(""), 2500);
    }
    setAdvancePrompt(null);
  };

  const confirmSkip = () => {
    if (skipWarning) {
      setProfile(p => ({ ...p, statusId: skipWarning.toId }));
      setShowToast("⚠️ Skipped — complete missed tasks when you can!");
      setTimeout(() => setShowToast(""), 3000);
    }
    setSkipWarning(null);
  };

  const inputStyle = { width: "100%", padding: "12px 16px", marginBottom: 16, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#fff", fontSize: 15, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const btnStyle   = (bg) => ({ width: "100%", padding: "14px 0", background: bg, border: "none", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 700, cursor: bg === "#333" ? "default" : "pointer" });

  // ── Auto-advance modal ────────────────────────────────────
  if (advancePrompt) {
    const next = STATUSES[advancePrompt.toStatusId];
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "Arial, sans-serif" }}>
        <div style={{ width: "100%", maxWidth: 380, background: "#0D1E2F", borderRadius: 22, padding: "28px 24px", border: "1px solid rgba(61,184,139,0.3)" }}>
          <div style={{ fontSize: 38, marginBottom: 12, textAlign: "center" }}>🎯</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#EEF2F7", marginBottom: 8, textAlign: "center" }}>Ready to move forward?</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 20, textAlign: "center" }}>
            You completed:<br />
            <strong style={{ color: "#EEF2F7" }}>"{advancePrompt.taskText.slice(0, 55)}"</strong><br /><br />
            Update your status to:<br />
            <span style={{ color: "#3DB88B", fontWeight: 800, fontSize: 15 }}>{next.emoji} {next.label}</span>?
          </div>
          <button onClick={confirmAdvance}          style={{ ...btnStyle("#3DB88B"), marginBottom: 10 }}>Yes, update my status ✓</button>
          <button onClick={() => setAdvancePrompt(null)} style={{ ...btnStyle("transparent"), border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }}>No, I'll update manually</button>
        </div>
      </div>
    );
  }

  // ── Skip Warning Modal ────────────────────────────────────
  if (skipWarning) {
    const toStage = STATUSES[skipWarning.toId];
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "Arial, sans-serif" }}>
        <div style={{ width: "100%", maxWidth: 400, background: "#0D1E2F", borderRadius: 22, padding: "28px 24px", border: "2px solid rgba(232,91,91,0.4)", boxShadow: "0 0 40px rgba(232,91,91,0.15)" }}>

          {/* Icon + title */}
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>⚠️</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#E85B5B", marginBottom: 6 }}>You're skipping ahead!</div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
              You're jumping to <strong style={{ color: "#EEF2F7" }}>{toStage.emoji} {toStage.label}</strong> but these priority tasks are still incomplete:
            </div>
          </div>

          {/* Incomplete tasks list */}
          <div style={{ marginBottom: 18, maxHeight: 200, overflowY: "auto" }}>
            {skipWarning.incompleteTasks.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 12px", marginBottom: 6, background: "rgba(232,91,91,0.07)", border: "1px solid rgba(232,91,91,0.2)", borderRadius: 10 }}>
                <span style={{ fontSize: 14, marginTop: 1, flexShrink: 0 }}>❌</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#E85B5B", marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.4 }}>{t.stage}</div>
                  <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>{t.text}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Warning note */}
          <div style={{ padding: "9px 12px", background: "rgba(232,168,56,0.08)", border: "1px solid rgba(232,168,56,0.22)", borderRadius: 10, marginBottom: 18, fontSize: 11.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
            🕒 <strong style={{ color: "#E8A838" }}>Recommendation:</strong> Go back and complete these tasks first. Skipping may cause issues in your UK application journey.
          </div>

          {/* Buttons */}
          <button
            onClick={() => setSkipWarning(null)}
            style={{ width: "100%", padding: "12px 0", background: "#3DB88B", border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", marginBottom: 10 }}>
            ← Go back and complete tasks
          </button>
          <button
            onClick={confirmSkip}
            style={{ width: "100%", padding: "10px 0", background: "transparent", border: "1px solid rgba(232,91,91,0.35)", borderRadius: 12, color: "#E85B5B", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Skip anyway (not recommended)
          </button>
        </div>
      </div>
    );
  }

  // ── Settings ──────────────────────────────────────────────
  if (showSettings) {
    const hasChanges = editProfile.name !== profile.name || editProfile.arrival !== profile.arrival;
    return (
      <div style={{ minHeight: "100vh", background: "#08111C", fontFamily: "Arial, sans-serif", color: "#EEF2F7", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 420, background: "rgba(255,255,255,0.05)", borderRadius: 24, padding: "32px 28px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>⚙️ Settings</h2>
            <button onClick={() => setShowSettings(false)} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 20 }}>✕</button>
          </div>
          <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Your Name</label>
          <input value={editProfile.name} onChange={e => setEditProfile(p => ({ ...p, name: e.target.value }))} placeholder="Enter your name" style={inputStyle} />
          <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>📅 UK Arrival Date (estimated)</label>
          <input type="date" value={editProfile.arrival} onChange={e => setEditProfile(p => ({ ...p, arrival: e.target.value }))} style={inputStyle} />
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 20, padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
            💡 Change your journey stage using the status dropdown on the Home tab.
          </div>
          <button disabled={!editProfile.name.trim() || !hasChanges} onClick={() => { if (editProfile.name.trim()) { setProfile(p => ({ ...p, ...editProfile })); setShowToast("✓ Changes Saved"); setTimeout(() => { setShowToast(""); setShowSettings(false); }, 1100); } }} style={btnStyle(editProfile.name.trim() && hasChanges ? "#3DB88B" : "#333")}>
            Save Changes ✓
          </button>
          <button onClick={() => setShowSettings(false)} style={{ ...btnStyle("transparent"), marginTop: 10, border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)" }}>Cancel</button>
          <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "24px 0" }} />
          <button onClick={() => { if (window.confirm("Are you sure? This will permanently delete all your progress.")) { localStorage.clear(); window.location.reload(); } }} style={{ width: "100%", padding: "12px 0", background: "transparent", border: "1px solid rgba(232,91,91,0.35)", borderRadius: 12, color: "#E85B5B", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Reset All Progress
          </button>
        </div>
      </div>
    );
  }

  // ── Onboarding ────────────────────────────────────────────
  if (screen === "onboard") {
    const step = profile.step;
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg,#0B1E35 0%,#0D2A1F 50%,#1A0D2E 100%)", fontFamily: "Arial, sans-serif", padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          {step === 0 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 72, marginBottom: 16 }}>🇬🇧</div>
              <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Settle<span style={{ color: "#3DB88B" }}>UK</span></h1>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, marginBottom: 40, lineHeight: 1.6 }}>Your Personal UK Student Journey Manager — from offer to settlement, step by step.</p>
              <button onClick={() => setProfile(p => ({ ...p, step: 1 }))} style={btnStyle("#3DB88B")}>Start My Journey →</button>
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, marginTop: 16 }}>Free · No account required</p>
            </div>
          )}
          {step === 1 && (
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 24, padding: "32px 28px", border: "1px solid rgba(255,255,255,0.1)" }}>
              <button onClick={() => setProfile(p => ({ ...p, step: 0 }))} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13, marginBottom: 16, padding: 0 }}>← Back</button>
              <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 24 }}>👋 What is your name?</h2>
              <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="Your first name" style={inputStyle} />
              <button disabled={!profile.name.trim()} onClick={() => setProfile(p => ({ ...p, step: 2 }))} style={btnStyle(profile.name.trim() ? "#3DB88B" : "#333")}>Continue →</button>
            </div>
          )}
          {step === 2 && (
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 24, padding: "32px 28px", border: "1px solid rgba(255,255,255,0.1)" }}>
              <button onClick={() => setProfile(p => ({ ...p, step: 1 }))} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13, marginBottom: 16, padding: 0 }}>← Back</button>
              <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 8 }}>📍 Where are you now?</h2>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 18 }}>This helps us build your personalised roadmap</p>
              {STATUSES.map(s => (
                <button key={s.id} onClick={() => {
                  setProfile(p => ({ ...p, statusId: s.id, step: 3 }));
                  if (s.id === 0) setShowUniFinder(true);
                }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", marginBottom: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff", fontSize: 13, cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: 17 }}>{s.emoji}</span>
                  <span><div style={{ fontWeight: 700 }}>{s.label}</div><div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.4)" }}>{s.sub}</div></span>
                </button>
              ))}
            </div>
          )}
          {step === 3 && (
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 24, padding: "32px 28px", border: "1px solid rgba(255,255,255,0.1)" }}>
              <button onClick={() => setProfile(p => ({ ...p, step: 2 }))} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13, marginBottom: 16, padding: 0 }}>← Back</button>
              <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 8 }}>📅 Estimated UK arrival date?</h2>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 20 }}>This is approximate — you can change it later</p>
              <input type="date" value={profile.arrival} onChange={e => setProfile(p => ({ ...p, arrival: e.target.value }))} style={inputStyle} />
              <button disabled={!profile.arrival} onClick={() => { setScreen("home"); setTab("home"); }} style={btnStyle(profile.arrival ? "#3DB88B" : "#333")}>Build My Roadmap 🗺️</button>
            </div>
          )}
        </div>

        {showUniFinder && (
          <UniversityFinderFlow
            savedAcademic={academicProfile}
            onSaveProfile={(data) => setAcademicProfile(data)}
            onClose={() => setShowUniFinder(false)}
          />
        )}
      </div>
    );
  }

  // ── Main Home ─────────────────────────────────────────────
  const statusId = profile.statusId || 0;
  const sg       = STAGES[statusId];
  const stIdx    = statusId;
  const arrivalDays = profile.arrival
    ? Math.ceil((new Date(profile.arrival + "T12:00:00") - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const insightMeta = (type) => ({
    icon:   type === "warn" ? "⚠️" : type === "tip" ? "💡" : "ℹ️",
    bg:     type === "warn" ? "rgba(232,91,91,0.08)"   : type === "tip" ? "rgba(61,184,139,0.07)"  : "rgba(91,141,239,0.07)",
    border: type === "warn" ? "rgba(232,91,91,0.3)"    : type === "tip" ? "rgba(61,184,139,0.22)"  : "rgba(91,141,239,0.22)",
    color:  type === "warn" ? "#E85B5B"                : type === "tip" ? "#3DB88B"                 : "#5B8DEF",
    badge:  type === "warn" ? { label: "🔴 Urgent",   c: "#E85B5B", bg: "rgba(232,91,91,0.18)" }
          : type === "tip"  ? { label: "🟢 Tip",      c: "#3DB88B", bg: "rgba(61,184,139,0.15)" }
          :                   { label: "🟡 Important", c: "#E8A838", bg: "rgba(232,168,56,0.15)" },
  });

  const completedTasksCount = sg.tasks.filter(t => taskDone[t.id]).length;
  const docsReadyCount      = Object.values(docChecked).filter(Boolean).length;
  const taskPct = sg.tasks.length ? Math.round((completedTasksCount / sg.tasks.length) * 100) : 0;
  const docPct  = Math.round((docsReadyCount / DOCS.length) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "#08111C", fontFamily: "Arial, sans-serif", color: "#EEF2F7", paddingBottom: 80 }}>

      {/* ── HEADER ── */}
      <div style={{ background: "linear-gradient(135deg,#0B1E35 0%,#0D2A1F 100%)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "14px 20px 0" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {/* Top row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            {/* UK Flag avatar */}
            <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: "linear-gradient(135deg,#1a3a5c,#0d4a2f)", border: "1.5px solid rgba(61,184,139,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
              🇬🇧
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 17, fontWeight: 900, color: "#EEF2F7", whiteSpace: "nowrap" }}>Settle<span style={{ color: "#3DB88B" }}>UK</span></span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.28)" }}>·</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.48)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Hello, {profile.name}!</span>
              </div>
              {arrivalDays !== null && (
                <div style={{ fontSize: 11, fontWeight: 700, marginTop: 1, color: arrivalDays <= 0 ? "#3DB88B" : arrivalDays < 20 ? "#E85B5B" : arrivalDays < 60 ? "#E8A838" : "#3DB88B" }}>
                  {arrivalDays > 0 ? `${arrivalDays} days to arrival` : "You're in the UK now! 🇬🇧"}
                </div>
              )}
            </div>
            <button onClick={() => { setEditProfile({ name: profile.name, arrival: profile.arrival }); setShowSettings(true); }} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: 15, width: 34, height: 34, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>⚙️</button>
          </div>
          {/* Stage pill */}
          <div style={{ marginBottom: 10 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.11)", borderRadius: 20, fontSize: 11.5, fontWeight: 700, color: "#EEF2F7" }}>
              📍 {sg.name}
            </span>
          </div>
          {/* Nav tabs */}
          <div style={{ display: "flex", overflowX: "auto" }}>
            {[["home","🏠","Home"],["tasks","✅","Tasks"],["docs","📄","Documents"],["guides","📖","Guides"]].map(([id,em,lbl]) => (
              <button key={id} onClick={() => setTab(id)} style={{ flex: "none", padding: "8px 14px", background: "transparent", border: "none", borderBottom: tab === id ? "2px solid #3DB88B" : "2px solid transparent", color: tab === id ? "#3DB88B" : "rgba(255,255,255,0.38)", fontSize: 12.5, fontWeight: tab === id ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 13 }}>{em}</span>{lbl}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 20px" }}>

        {/* ── HOME TAB ── */}
        {tab === "home" && (
          <div>
            {/* Welcome + Status Dropdown */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Welcome back, {profile.name} 👋</div>
              <StatusDropdown statusId={statusId} onChange={changeStatus} />
            </div>

            {/* Reminder card — only if researching stage and profile not completed */}
            {statusId === 0 && !academicProfile && (
              <div onClick={() => setShowUniFinder(true)} style={{
                display: "flex", alignItems: "center", gap: 12,
                background: "rgba(91,141,239,0.08)", border: "1px solid rgba(91,141,239,0.25)",
                borderRadius: 14, padding: "12px 14px", marginBottom: 16, cursor: "pointer",
              }}>
                <span style={{ fontSize: 22 }}>📌</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#5B8DEF" }}>Complete Your Profile</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>Get personalized university recommendations</div>
                </div>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 15 }}>›</span>
              </div>
            )}

            <CountdownCard arrivalDays={arrivalDays} />
            <StepperBar stIdx={stIdx} sg={sg} />
            <ReadinessScore stIdx={stIdx} taskDone={taskDone} docChecked={docChecked} sg={sg} />

            {/* Emotion banner */}
            <div style={{ background: "rgba(61,184,139,0.06)", border: "1px solid rgba(61,184,139,0.16)", borderRadius: 12, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>😊</span>
              <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.62)", lineHeight: 1.5 }}>{sg.emotion}</span>
            </div>

            <NextBestAction sg={sg} onStart={() => setTab("tasks")} />

            {/* Insights */}
            <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.28)", marginBottom: 10 }}>Insights & Risk Alerts</h3>
            {sg.insights.map((ins, i) => {
              const m = insightMeta(ins.type);
              return (
                <div key={i} style={{ display: "flex", gap: 10, background: m.bg, border: `1px solid ${m.border}`, borderRadius: 12, padding: "10px 12px", marginBottom: 7 }}>
                  <span style={{ fontSize: 17, flexShrink: 0, marginTop: 1 }}>{m.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12.5, fontWeight: 800, color: m.color }}>{ins.title}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: m.badge.c, background: m.badge.bg, padding: "2px 8px", borderRadius: 20, letterSpacing: 0.3 }}>{m.badge.label}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.48)", lineHeight: 1.5 }}>{ins.sub}</div>
                  </div>
                </div>
              );
            })}

            {/* Quick Actions */}
            <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.28)", margin: "18px 0 10px" }}>Quick Actions</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <QuickCard icon="📄" title="Documents" sub={`${docsReadyCount} of ${DOCS.length} ready`}       pct={docPct}  onClick={() => setTab("docs")} />
              <QuickCard icon="✅" title="Tasks"     sub={`${completedTasksCount} of ${sg.tasks.length} done`} pct={taskPct} onClick={() => setTab("tasks")} />
              <QuickCard icon="🏦" title="Banking guide" sub="Open Monzo"       onClick={() => setTab("guides")} />
              <QuickCard icon="🏥" title="NHS guide"     sub="Register with GP" onClick={() => setTab("guides")} />
            </div>
          </div>
        )}

        {/* ── TASKS TAB ── */}
        {tab === "tasks" && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 19, fontWeight: 800 }}>{sg.name} tasks</h2>
            <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "rgba(255,255,255,0.38)" }}>{completedTasksCount} of {sg.tasks.length} completed · {sg.deadline}</p>
            {sg.tasks.map(task => (
              <div key={task.id} onClick={() => toggleTask(task.id)} style={{ display: "flex", gap: 12, padding: "13px 14px", marginBottom: 7, background: taskDone[task.id] ? "rgba(61,184,139,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${taskDone[task.id] ? "#3DB88B44" : "rgba(255,255,255,0.06)"}`, borderRadius: 12, cursor: "pointer", alignItems: "flex-start" }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 2, border: `2px solid ${taskDone[task.id] ? "#3DB88B" : "rgba(255,255,255,0.2)"}`, background: taskDone[task.id] ? "#3DB88B" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                  {taskDone[task.id] && "✓"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, textDecoration: taskDone[task.id] ? "line-through" : "none", color: taskDone[task.id] ? "rgba(255,255,255,0.28)" : "#EEF2F7" }}>{task.text}</span>
                    {task.priority    && !taskDone[task.id] && <span style={{ fontSize: 9.5, fontWeight: 700, color: "#E8A838", background: "#E8A83820", padding: "2px 7px", borderRadius: 8 }}>PRIORITY</span>}
                    {task.autoAdvance && !taskDone[task.id] && <span style={{ fontSize: 9.5, fontWeight: 700, color: "#5B8DEF", background: "rgba(91,141,239,0.15)", padding: "2px 7px", borderRadius: 8 }}>AUTO-ADVANCE</span>}
                  </div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16, padding: "11px 14px", background: "rgba(61,184,139,0.05)", border: "1px solid rgba(61,184,139,0.14)", borderRadius: 12, fontSize: 11.5, color: "rgba(255,255,255,0.38)", textAlign: "center" }}>
              ✨ <strong style={{ color: "#5B8DEF" }}>AUTO-ADVANCE</strong> tasks will prompt to update your status automatically when completed.
            </div>
          </div>
        )}

        {/* ── DOCS TAB ── */}
        {tab === "docs" && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 19, fontWeight: 800 }}>📄 Document Vault</h2>
            <p style={{ margin: "0 0 8px", fontSize: 12.5, color: "rgba(255,255,255,0.38)" }}>{docsReadyCount} of {DOCS.length} documents ready · {docPct}%</p>
            <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 5, overflow: "hidden", marginBottom: 14 }}>
              <div style={{ height: "100%", width: `${docPct}%`, background: "linear-gradient(90deg,#534AB7,#3DB88B)", borderRadius: 5, transition: "width 0.4s" }} />
            </div>
            <div style={{ background: "rgba(232,168,56,0.08)", border: "1px solid rgba(232,168,56,0.22)", borderRadius: 12, padding: "10px 14px", marginBottom: 16, fontSize: 12.5, color: "rgba(255,255,255,0.62)" }}>
              💡 <strong style={{ color: "#E8A838" }}>Tip:</strong> Scan everything and upload to Google Drive. Never carry all originals in one bag.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {DOCS.map(doc => (
                <div key={doc.id} onClick={() => toggleDoc(doc.id)} style={{ padding: "12px", borderRadius: 12, cursor: "pointer", background: docChecked[doc.id] ? "rgba(61,184,139,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${docChecked[doc.id] ? "#3DB88B55" : "rgba(255,255,255,0.07)"}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 20 }}>{doc.icon}</span>
                    <div style={{ marginLeft: "auto", width: 16, height: 16, borderRadius: 5, border: `2px solid ${docChecked[doc.id] ? "#3DB88B" : "rgba(255,255,255,0.2)"}`, background: docChecked[doc.id] ? "#3DB88B" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>{docChecked[doc.id] && "✓"}</div>
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: docChecked[doc.id] ? "rgba(255,255,255,0.35)" : "#EEF2F7", textDecoration: docChecked[doc.id] ? "line-through" : "none" }}>{doc.name}</div>
                  <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.28)", marginTop: 2 }}>{doc.hint}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── GUIDES TAB ── */}
        {tab === "guides" && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 19, fontWeight: 800 }}>📖 Guides & Resources</h2>
            <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "rgba(255,255,255,0.38)" }}>Official links and step-by-step guides for life in UK</p>
            {GUIDES.map((g, i) => (
              <a key={i} href={g.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", marginBottom: 7, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, textDecoration: "none", color: "#EEF2F7" }}>
                <span style={{ fontSize: 22 }}>{g.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{g.title}</div>
                  <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.28)", marginTop: 2 }}>{g.sub}</div>
                </div>
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 15 }}>↗</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(8,17,28,0.96)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", padding: "8px 0 14px" }}>
        {[["home","🏠","Home"],["tasks","✅","Tasks"],["docs","📄","Docs"],["guides","📖","Guides"]].map(([id,em,lbl]) => (
          <button key={id} onClick={() => setTab(id)} style={{ flex: 1, background: "transparent", border: "none", cursor: "pointer", padding: "4px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 20 }}>{em}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: tab === id ? "#3DB88B" : "rgba(255,255,255,0.28)" }}>{lbl}</span>
          </button>
        ))}
      </div>

      {/* ── TOAST ── */}
      {showToast && (
        <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", background: "#3DB88B", color: "#08111C", padding: "10px 24px", borderRadius: 30, fontSize: 13, fontWeight: 700, boxShadow: "0 4px 20px rgba(0,0,0,0.4)", whiteSpace: "nowrap", zIndex: 300 }}>
          {showToast}
        </div>
      )}

      {/* ── UNIVERSITY FINDER OVERLAY ── */}
      {showUniFinder && (
        <UniversityFinderFlow
          savedAcademic={academicProfile}
          onSaveProfile={(data) => setAcademicProfile(data)}
          onClose={() => setShowUniFinder(false)}
        />
      )}
    </div>
  );
}
