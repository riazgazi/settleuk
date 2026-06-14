import { useState, useEffect } from "react";

// ============================================================
// DATA
// ============================================================
const STATUSES = [
  { id: 0, label: "Just researching", sub: "Exploring UK study options", emoji: "🔍" },
  { id: 1, label: "Applied to university", sub: "Waiting for offer letter", emoji: "📝" },
  { id: 2, label: "Offer received", sub: "Got conditional/unconditional offer", emoji: "🎉" },
  { id: 3, label: "CAS received", sub: "University sent CAS number", emoji: "📋" },
  { id: 4, label: "Visa applied", sub: "Application submitted", emoji: "⏳" },
  { id: 5, label: "Visa approved", sub: "Ready to travel to UK", emoji: "✅" },
  { id: 6, label: "Already in UK", sub: "Arrived and settling", emoji: "🇬🇧" },
];

const ALL_STAGE_NAMES = ["Research", "Apply", "Offer", "CAS", "Visa", "Approved", "UK"];

const STAGES = [
  {
    id: 0, name: "Research & IELTS", sub: "Choose university, prepare English test",
    nextAction: "Book IELTS test", deadline: "ASAP — 6-12 months before intake",
    deadlineUrgency: "medium",
    emotion: "Great time to start! Early preparation means better university options.",
    accentBg: "#E6F1FB", accentText: "#0C447C", accentBtn: "#185FA5", chipBg: "#E6F1FB", chipColor: "#185FA5",
    tasks: [
      { id: "t0-1", text: "Research UK universities on UCAS", priority: true },
      { id: "t0-2", text: "Register for IELTS or PTE Academic", priority: true },
      { id: "t0-3", text: "Prepare personal statement draft" },
      { id: "t0-4", text: "Check tuition fees and scholarship options" },
      { id: "t0-5", text: "Contact university admissions teams" },
    ],
    insights: [
      { type: "tip", title: "Start early", sub: "Universities with September intake usually open applications 12 months ahead." },
      { type: "info", title: "IELTS validity", sub: "IELTS scores are valid for 2 years — plan your test date accordingly." },
    ]
  },
  {
    id: 1, name: "University application", sub: "Submitted — waiting for offer",
    nextAction: "Follow up with admissions", deadline: "Check portal this week",
    deadlineUrgency: "high",
    emotion: "Application submitted! Most universities reply within 4-8 weeks. Stay patient.",
    accentBg: "#EEEDFE", accentText: "#3C3489", accentBtn: "#534AB7", chipBg: "#EEEDFE", chipColor: "#534AB7",
    tasks: [
      { id: "t1-1", text: "Log in to application portal daily", priority: true },
      { id: "t1-2", text: "Prepare for possible interview", priority: true },
      { id: "t1-3", text: "Gather financial documents early" },
      { id: "t1-4", text: "Research student accommodation options" },
      { id: "t1-5", text: "Connect with current students on LinkedIn" },
    ],
    insights: [
      { type: "tip", title: "Be reachable", sub: "Universities may email or call for interviews — check spam folder regularly." },
      { type: "info", title: "Average wait", sub: "Most UK universities respond within 4-8 weeks of application." },
    ]
  },
  {
    id: 2, name: "Offer received", sub: "Accept offer and request CAS",
    nextAction: "Accept offer and pay deposit", deadline: "Check offer letter for deadline",
    deadlineUrgency: "high",
    emotion: "Congratulations! Time to accept your offer and prepare for CAS.",
    accentBg: "#E1F5EE", accentText: "#085041", accentBtn: "#0F6E56", chipBg: "#E1F5EE", chipColor: "#0F6E56",
    tasks: [
      { id: "t2-1", text: "Accept unconditional offer formally", priority: true },
      { id: "t2-2", text: "Pay tuition deposit to secure place", priority: true },
      { id: "t2-3", text: "Request CAS number from university", priority: true },
      { id: "t2-4", text: "Start saving bank statement (28 days)" },
      { id: "t2-5", text: "Book TB test appointment (Bangladesh)" },
    ],
    insights: [
      { type: "warn", title: "Conditional offer?", sub: "Make sure you meet all conditions (grades, English score) before CAS request." },
      { type: "tip", title: "Bank statement timing", sub: "Start your 28-day bank statement period now — it takes time to build up." },
    ]
  },
  {
    id: 3, name: "CAS received", sub: "Apply for student visa now",
    nextAction: "Submit visa application online", deadline: "At least 3 months before intake",
    deadlineUrgency: "critical",
    emotion: "CAS received — this is the most critical stage. Apply for visa immediately.",
    accentBg: "#FAECE7", accentText: "#712B13", accentBtn: "#993C1D", chipBg: "#FAECE7", chipColor: "#993C1D",
    tasks: [
      { id: "t3-1", text: "Pay Immigration Health Surcharge (IHS)", priority: true },
      { id: "t3-2", text: "Complete online visa application form", priority: true },
      { id: "t3-3", text: "Prepare 28-day bank statement", priority: true },
      { id: "t3-4", text: "Book biometric appointment at UKVCAS", priority: true },
      { id: "t3-5", text: "Collect TB test certificate" },
      { id: "t3-6", text: "Book flights once visa is submitted" },
    ],
    insights: [
      { type: "warn", title: "Bank statement risk", sub: "Must show funds for 28 consecutive days. Any dip below the required amount restarts the count." },
      { type: "tip", title: "Apply early for visa", sub: "Average processing: 3 weeks. Apply soon to stay safe before intake." },
      { type: "info", title: "TB test required", sub: "Bangladesh is on the TB test list. Book appointment before visa application." },
    ]
  },
  {
    id: 4, name: "Visa applied", sub: "Waiting for visa decision",
    nextAction: "Prepare pre-departure checklist", deadline: "Decision usually in 3 weeks",
    deadlineUrgency: "medium",
    emotion: "Visa submitted! Average decision time: 3 weeks. Use this time to prep for departure.",
    accentBg: "#FAEEDA", accentText: "#633806", accentBtn: "#854F0B", chipBg: "#FAEEDA", chipColor: "#854F0B",
    tasks: [
      { id: "t4-1", text: "Book flights for your intake month", priority: true },
      { id: "t4-2", text: "Confirm university accommodation booking", priority: true },
      { id: "t4-3", text: "Order eSIM (GiffGaff, Lebara)" },
      { id: "t4-4", text: "Get travel insurance" },
      { id: "t4-5", text: "Pack essentials — clothes for cold weather" },
      { id: "t4-6", text: "Inform home bank about travel" },
    ],
    insights: [
      { type: "tip", title: "Use the waiting time well", sub: "Visa decisions take about 3 weeks on average — perfect time to prep for departure." },
      { type: "info", title: "Priority service", sub: "Priority visa service (extra fee) gives a decision in 5 working days if you're short on time." },
    ]
  },
  {
    id: 5, name: "Visa approved", sub: "Pre-departure final preparations",
    nextAction: "Check BRP collection Post Office", deadline: "Note it in your visa vignette",
    deadlineUrgency: "high",
    emotion: "Visa approved! You are going to the UK. Final preparations — almost there!",
    accentBg: "#E1F5EE", accentText: "#085041", accentBtn: "#0F6E56", chipBg: "#E1F5EE", chipColor: "#0F6E56",
    tasks: [
      { id: "t5-1", text: "Check BRP Post Office in visa vignette", priority: true },
      { id: "t5-2", text: "Download bank app (Monzo/Starling)" },
      { id: "t5-3", text: "Join university Facebook/WhatsApp groups" },
      { id: "t5-4", text: "Pack documents in hand luggage only" },
      { id: "t5-5", text: "Confirm airport pickup or transport" },
      { id: "t5-6", text: "Exchange some cash to GBP" },
    ],
    insights: [
      { type: "warn", title: "BRP collection deadline", sub: "You must collect your BRP within 10 days of arrival or as stated on your visa." },
      { type: "tip", title: "Keep documents handy", sub: "Passport, visa, offer letter, CAS — keep all in hand luggage, never in checked baggage." },
    ]
  },
  {
    id: 6, name: "Arrived in UK", sub: "Settlement and registration",
    nextAction: "Collect BRP from Post Office", deadline: "Within 10 days of arrival",
    deadlineUrgency: "critical",
    emotion: "Welcome to the UK! Complete these tasks in order — do not delay BRP collection.",
    accentBg: "#E1F5EE", accentText: "#085041", accentBtn: "#0F6E56", chipBg: "#E1F5EE", chipColor: "#0F6E56",
    tasks: [
      { id: "t6-1", text: "Collect BRP from Post Office", priority: true },
      { id: "t6-2", text: "Open Monzo or Starling bank account", priority: true },
      { id: "t6-3", text: "Register at university — get student ID", priority: true },
      { id: "t6-4", text: "Register with local NHS GP surgery" },
      { id: "t6-5", text: "Apply for NI Number (call 0800 141 2075)" },
      { id: "t6-6", text: "Get council tax exemption letter" },
    ],
    insights: [
      { type: "warn", title: "BRP first!", sub: "Collect your BRP within 10 days — delays can cause legal issues with your visa status." },
      { type: "tip", title: "NI Number takes time", sub: "Apply for your National Insurance number now — it can take 4-8 weeks to arrive." },
    ]
  },
];

const DOCS = [
  { id: "d1", name: "Passport", hint: "Valid 6+ months", icon: "🛂" },
  { id: "d2", name: "Offer Letter", hint: "Conditional/unconditional", icon: "📄" },
  { id: "d3", name: "CAS Number", hint: "From university", icon: "🎓" },
  { id: "d4", name: "IELTS Certificate", hint: "Score 6.0+ usually", icon: "📝" },
  { id: "d5", name: "Bank Statement", hint: "28 consecutive days", icon: "💷" },
  { id: "d6", name: "TB Test Result", hint: "From approved clinic", icon: "🩺" },
  { id: "d7", name: "Passport Photos", hint: "2 recent photos", icon: "🖼️" },
  { id: "d8", name: "IHS Receipt", hint: "After payment", icon: "🛡️" },
  { id: "d9", name: "Personal Statement", hint: "For visa form", icon: "✍️" },
  { id: "d10", name: "Accommodation Proof", hint: "Uni halls or rental", icon: "🏠" },
  { id: "d11", name: "BRP / Visa Vignette", hint: "After visa approval", icon: "🪪" },
  { id: "d12", name: "NI Number Letter", hint: "From HMRC", icon: "🔢" },
];

const GUIDES = [
  { title: "NHS registration", sub: "Free healthcare access", icon: "🩺", url: "https://www.nhs.uk/service-search/find-a-gp" },
  { title: "Open UK bank account", sub: "Monzo, Starling, Wise", icon: "🏦", url: "https://monzo.com" },
  { title: "Apply for NI number", sub: "Call 0800 141 2075", icon: "🔢", url: "https://www.gov.uk/apply-national-insurance-number" },
  { title: "BRP collection guide", sub: "Collect within 10 days", icon: "🪪", url: "https://www.gov.uk/biometric-residence-permits" },
  { title: "Council tax exemption", sub: "Students usually exempt", icon: "📬", url: "https://www.gov.uk/council-tax/who-has-to-pay" },
  { title: "Right to work — visa hours", sub: "Max 20hrs/week term time", icon: "✅", url: "https://www.gov.uk/prove-right-to-work" },
  { title: "UK Visa Application", sub: "Official gov.uk portal", icon: "📜", url: "https://www.gov.uk/student-visa" },
  { title: "UKCISA Student Support", sub: "International student advice", icon: "🎓", url: "https://www.ukcisa.org.uk" },
  { title: "GiffGaff UK SIM", sub: "Order eSIM before flying", icon: "📱", url: "https://www.giffgaff.com" },
  { title: "Wise — Send Money", sub: "Best exchange rates", icon: "💸", url: "https://wise.com" },
];

// ============================================================
// HELPERS — localStorage
// ============================================================
function loadLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function saveLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ============================================================
// COMPONENT: Stepper Progress Bar (improvement #1)
// ============================================================
function StepperBar({ stIdx, sg }) {
  const total = ALL_STAGE_NAMES.length;
  const pct = Math.round((stIdx / (total - 1)) * 100);

  return (
    <div style={{
      marginBottom: 18,
      padding: "16px 14px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16,
    }}>
      {/* Step info row — current phase + step count + % all together */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#EEF2F7", marginBottom: 2 }}>
            {ALL_STAGE_NAMES[stIdx]}
          </div>
          <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>
            Step {stIdx + 1} of {total}
          </div>
        </div>
        <span style={{
          fontSize: 12, fontWeight: 800,
          color: sg.accentBtn,
          background: sg.accentBtn + "22",
          padding: "4px 11px", borderRadius: 20,
          flexShrink: 0,
        }}>
          {pct}% Complete
        </span>
      </div>

      {/* Dot stepper */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Connecting line — behind dots */}
        <div style={{
          position: "absolute", top: "50%", left: 10, right: 10,
          height: 3, background: "rgba(255,255,255,0.08)",
          transform: "translateY(-50%)", borderRadius: 3, zIndex: 0,
        }}>
          <div style={{
            height: "100%",
            width: stIdx === 0 ? "0%" : `${(stIdx / (total - 1)) * 100}%`,
            background: `linear-gradient(90deg, ${sg.accentBtn}, #3DB88B)`,
            borderRadius: 3,
            transition: "width 0.5s ease",
          }} />
        </div>

        {ALL_STAGE_NAMES.map((name, i) => {
          const done = i < stIdx;
          const current = i === stIdx;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 1 }}>
              <div style={{
                width: current ? 26 : 18,
                height: current ? 26 : 18,
                borderRadius: "50%",
                border: `2.5px solid ${done ? "#3DB88B" : current ? sg.accentBtn : "rgba(255,255,255,0.15)"}`,
                background: done ? "#3DB88B" : current ? sg.accentBtn + "33" : "rgba(255,255,255,0.04)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: current ? 11 : 9,
                color: done ? "#fff" : current ? sg.accentBtn : "rgba(255,255,255,0.25)",
                fontWeight: 800,
                transition: "all 0.3s",
                boxShadow: current ? `0 0 0 4px ${sg.accentBtn}22` : "none",
              }}>
                {done ? "✓" : i + 1}
              </div>
              <span style={{
                fontSize: 8.5, fontWeight: current ? 800 : 500,
                color: current ? sg.accentBtn : done ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.2)",
                textAlign: "center", whiteSpace: "nowrap",
              }}>
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
// COMPONENT: Status Dropdown (improvement #2)
// ============================================================
function StatusDropdown({ statusId, onChange }) {
  const [open, setOpen] = useState(false);
  const current = STATUSES[statusId];

  return (
    <div style={{ marginBottom: 18, position: "relative" }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.35)", marginBottom: 7 }}>
        Current Status
      </div>

      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10,
          padding: "11px 14px",
          background: "rgba(61,184,139,0.1)",
          border: "1.5px solid rgba(61,184,139,0.35)",
          borderRadius: 12, cursor: "pointer", textAlign: "left",
          color: "#EEF2F7",
        }}
      >
        <span style={{
          width: 9, height: 9, borderRadius: "50%",
          background: "#3DB88B", flexShrink: 0,
          boxShadow: "0 0 0 3px rgba(61,184,139,0.25)",
        }} />
        <span style={{ flex: 1, fontSize: 13.5, fontWeight: 800, color: "#3DB88B" }}>
          {current.emoji} {current.label}
        </span>
        <span style={{
          fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600,
          transition: "transform 0.2s",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          display: "inline-block",
        }}>▼</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 100,
          background: "#0D1E2F",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 14, overflow: "hidden",
          boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
        }}>
          {STATUSES.map(s => (
            <button
              key={s.id}
              onClick={() => { onChange(s.id); setOpen(false); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "11px 14px",
                background: s.id === statusId ? "rgba(61,184,139,0.1)" : "transparent",
                border: "none",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                color: s.id === statusId ? "#3DB88B" : "rgba(255,255,255,0.7)",
                fontSize: 13, fontWeight: s.id === statusId ? 800 : 500,
                cursor: "pointer", textAlign: "left",
              }}
            >
              <span style={{ fontSize: 15 }}>{s.emoji}</span>
              <span style={{ flex: 1 }}>{s.label}</span>
              {s.id === statusId && <span style={{ fontSize: 12 }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// COMPONENT: Countdown Card (improvement #7 — premium)
// ============================================================
function CountdownCard({ arrivalDays }) {
  if (arrivalDays === null) return null;

  const arrived = arrivalDays <= 0;
  const urgentColor = arrivalDays < 30 ? "#E85B5B" : arrivalDays < 60 ? "#E8A838" : "#3DB88B";

  return (
    <div style={{
      marginBottom: 18,
      background: `linear-gradient(135deg, rgba(61,184,139,0.08) 0%, rgba(24,95,165,0.08) 100%)`,
      border: `1px solid ${urgentColor}33`,
      borderRadius: 16,
      padding: "16px 18px",
      display: "flex",
      alignItems: "center",
      gap: 16,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14, flexShrink: 0,
        background: `${urgentColor}18`,
        border: `2px solid ${urgentColor}44`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: urgentColor, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {arrived ? "Here!" : "Days"}
        </span>
        <span style={{ fontSize: arrived ? 18 : 22, fontWeight: 900, color: urgentColor, lineHeight: 1.1 }}>
          {arrived ? "🇬🇧" : Math.abs(arrivalDays)}
        </span>
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#EEF2F7", marginBottom: 3 }}>
          {arrived ? "You're in the UK!" : `${Math.abs(arrivalDays)} Days Until UK Arrival`}
        </div>
        <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
          {arrived
            ? "Welcome! Complete your settlement tasks below."
            : arrivalDays < 30
            ? "⚠️ Less than a month to go — stay on top of tasks."
            : arrivalDays < 90
            ? "Keep up momentum — you're getting close."
            : "Plenty of time — stay consistent and plan ahead."}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT: Next Best Action (improvement #3)
// ============================================================
function NextBestAction({ sg, onStart }) {
  const urgencyColors = {
    critical: { bg: "rgba(232,91,91,0.08)", border: "rgba(232,91,91,0.3)", badge: "#E85B5B", badgeBg: "rgba(232,91,91,0.15)" },
    high: { bg: "rgba(232,168,56,0.08)", border: "rgba(232,168,56,0.3)", badge: "#E8A838", badgeBg: "rgba(232,168,56,0.15)" },
    medium: { bg: "rgba(91,141,239,0.06)", border: "rgba(91,141,239,0.2)", badge: "#5B8DEF", badgeBg: "rgba(91,141,239,0.15)" },
  };
  const uc = urgencyColors[sg.deadlineUrgency] || urgencyColors.medium;

  return (
    <div style={{
      background: uc.bg,
      border: `1px solid ${uc.border}`,
      borderRadius: 16,
      padding: "16px",
      marginBottom: 18,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.8, color: sg.accentBtn }}>
          🎯 Next Action
        </span>
        <span style={{
          fontSize: 9.5, fontWeight: 700,
          color: uc.badge,
          background: uc.badgeBg,
          padding: "2px 8px", borderRadius: 20,
          textTransform: "uppercase", letterSpacing: 0.4,
        }}>
          {sg.deadlineUrgency === "critical" ? "🔴 Urgent" : sg.deadlineUrgency === "high" ? "🟡 This Week" : "🔵 Upcoming"}
        </span>
      </div>
      <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 6, color: "#EEF2F7", lineHeight: 1.3 }}>
        {sg.nextAction}
      </div>
      <div style={{
        fontSize: 11.5, color: "rgba(255,255,255,0.5)", marginBottom: 14,
        display: "flex", alignItems: "center", gap: 5,
      }}>
        <span>🕒</span>
        <span>{sg.deadline}</span>
      </div>
      <button
        onClick={onStart}
        style={{
          width: "100%", padding: "9px 0",
          background: sg.accentBtn,
          border: "none", borderRadius: 10,
          color: "#fff", fontSize: 13.5, fontWeight: 800,
          cursor: "pointer",
          boxShadow: `0 3px 12px ${sg.accentBtn}44`,
          letterSpacing: 0.3,
        }}
      >
        Start Now →
      </button>
    </div>
  );
}

// ============================================================
// COMPONENT: Readiness Score (improvement #6 + Readiness Engine)
// ============================================================
function ReadinessScore({ stIdx, taskDone, docChecked, sg }) {
  const total = STAGES.reduce((sum, s) => sum + s.tasks.length, 0);
  const completedTasks = Object.values(taskDone).filter(Boolean).length;
  const completedDocs = Object.values(docChecked).filter(Boolean).length;
  const taskScore = Math.round((completedTasks / total) * 50);
  const docScore = Math.round((completedDocs / DOCS.length) * 30);
  const stageScore = Math.round((stIdx / (ALL_STAGE_NAMES.length - 1)) * 20);
  const total_score = taskScore + docScore + stageScore;

  const label = total_score >= 80 ? "Excellent" : total_score >= 60 ? "On Track" : total_score >= 40 ? "Good Start" : "Getting Started";
  const labelColor = total_score >= 80 ? "#3DB88B" : total_score >= 60 ? "#5B8DEF" : total_score >= 40 ? "#E8A838" : "rgba(255,255,255,0.35)";

  // Next milestone hints
  const nextTarget = total_score >= 80 ? null : total_score >= 60 ? 80 : total_score >= 40 ? 60 : 40;
  const hints = [];
  if (nextTarget) {
    if (completedTasks < 3) hints.push("Complete priority tasks");
    if (completedDocs < 4) hints.push("Upload key documents");
    if (stIdx < 2) hints.push("Progress your application stage");
  }

  return (
    <div style={{
      marginBottom: 18,
      padding: "14px 16px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.5 }}>
            Readiness Score
          </div>
          <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>
            Tasks · Docs · Stage progress
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: 28, fontWeight: 900, color: labelColor }}>{total_score}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.25)" }}>/100</span>
        </div>
      </div>

      {/* Score bar — with segment markers */}
      <div style={{ position: "relative", height: 8, background: "rgba(255,255,255,0.07)", borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
        <div style={{
          height: "100%",
          width: `${total_score}%`,
          background: total_score >= 80
            ? "linear-gradient(90deg,#3DB88B,#5BE8AC)"
            : total_score >= 60
            ? "linear-gradient(90deg,#5B8DEF,#3DB88B)"
            : total_score >= 40
            ? "linear-gradient(90deg,#E8A838,#5B8DEF)"
            : "linear-gradient(90deg,#534AB7,#E8A838)",
          borderRadius: 8,
          transition: "width 0.6s ease",
        }} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: hints.length ? 10 : 0 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.3)" }}>✅ {completedTasks} tasks</span>
          <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.3)" }}>📄 {completedDocs} docs</span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 800, color: labelColor }}>{label}</span>
      </div>

      {/* Readiness Engine hints */}
      {nextTarget && hints.length > 0 && (
        <div style={{
          marginTop: 10, padding: "9px 12px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
            To reach {nextTarget}/100
          </div>
          {hints.slice(0, 2).map((h, i) => (
            <div key={i} style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: 6, marginBottom: i < hints.length - 1 ? 4 : 0 }}>
              <span style={{ color: sg.accentBtn, fontSize: 10 }}>▸</span> {h}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [screen, setScreen] = useState(() => {
    const saved = loadLS("settleuk_profile", null);
    return saved && saved.name ? "home" : "onboard";
  });
  const [profile, setProfile] = useState(() => loadLS("settleuk_profile", { name: "", statusId: 0, arrival: "", step: 0 }));
  const [taskDone, setTaskDone] = useState(() => loadLS("settleuk_tasks", {}));
  const [docChecked, setDocChecked] = useState(() => loadLS("settleuk_docs", {}));
  const [tab, setTab] = useState("home");
  const [showSettings, setShowSettings] = useState(false);
  const [editProfile, setEditProfile] = useState({ name: "", arrival: "" });
  const [showToast, setShowToast] = useState(false);

  useEffect(() => { saveLS("settleuk_profile", profile); }, [profile]);
  useEffect(() => { saveLS("settleuk_tasks", taskDone); }, [taskDone]);
  useEffect(() => { saveLS("settleuk_docs", docChecked); }, [docChecked]);

  const toggleTask = (id) => setTaskDone(p => ({ ...p, [id]: !p[id] }));
  const toggleDoc = (id) => setDocChecked(p => ({ ...p, [id]: !p[id] }));
  const changeStatus = (id) => setProfile(p => ({ ...p, statusId: id }));

  const inputStyle = {
    width: "100%", padding: "12px 16px", marginBottom: 16,
    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 10, color: "#fff", fontSize: 15, outline: "none",
    fontFamily: "inherit", boxSizing: "border-box"
  };
  const btnStyle = (bg) => ({
    width: "100%", padding: "14px 0", background: bg, border: "none",
    borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 700,
    cursor: bg === "#333" ? "default" : "pointer"
  });

  // ── SETTINGS MODAL ──────────────────────────────────────────
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
            💡 To change your journey stage, go to <strong>Home</strong> and tap the status dropdown.
          </div>
          <button
            disabled={!editProfile.name.trim() || !hasChanges}
            onClick={() => {
              if (editProfile.name.trim()) {
                setProfile(p => ({ ...p, ...editProfile }));
                setShowToast(true);
                setTimeout(() => { setShowToast(false); setShowSettings(false); }, 1100);
              }
            }}
            style={btnStyle(editProfile.name.trim() && hasChanges ? "#3DB88B" : "#333")}>
            Save Changes ✓
          </button>
          <button onClick={() => setShowSettings(false)} style={{ ...btnStyle("transparent"), marginTop: 10, border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)" }}>
            Cancel
          </button>
          <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "24px 0" }} />
          <button onClick={() => {
            if (window.confirm("Are you sure? This will permanently delete all your progress, tasks, and documents. This action cannot be undone.")) {
              localStorage.clear(); window.location.reload();
            }
          }} style={{ width: "100%", padding: "12px 0", background: "transparent", border: "1px solid rgba(232,91,91,0.35)", borderRadius: 12, color: "#E85B5B", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Reset All Progress
          </button>
          {showToast && (
            <div style={{ position: "fixed", bottom: 30, left: "50%", transform: "translateX(-50%)", background: "#3DB88B", color: "#08111C", padding: "10px 24px", borderRadius: 30, fontSize: 13, fontWeight: 700, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
              ✓ Changes Saved
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── ONBOARDING ──────────────────────────────────────────────
  if (screen === "onboard") {
    const step = profile.step;
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg,#0B1E35 0%,#0D2A1F 50%,#1A0D2E 100%)", fontFamily: "Arial, sans-serif", padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          {step === 0 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 72, marginBottom: 16 }}>🇬🇧</div>
              <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
                Settle<span style={{ color: "#3DB88B" }}>UK</span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, marginBottom: 40, lineHeight: 1.6 }}>
                Your Personal UK Student Journey Manager — from offer to settlement, step by step.
              </p>
              <button onClick={() => setProfile(p => ({ ...p, step: 1 }))} style={btnStyle("#3DB88B")}>
                Start My Journey →
              </button>
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
                <button key={s.id} onClick={() => setProfile(p => ({ ...p, statusId: s.id, step: 3 }))} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", marginBottom: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff", fontSize: 13, cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: 17 }}>{s.emoji}</span>
                  <span>
                    <div style={{ fontWeight: 700 }}>{s.label}</div>
                    <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.4)" }}>{s.sub}</div>
                  </span>
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
              <button disabled={!profile.arrival} onClick={() => { setScreen("home"); setTab("home"); }} style={btnStyle(profile.arrival ? "#3DB88B" : "#333")}>
                Build My Roadmap 🗺️
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── HOME ────────────────────────────────────────────────────
  const statusId = profile.statusId || 0;
  const sg = STAGES[statusId];
  const stIdx = statusId;

  const arrivalDays = profile.arrival
    ? Math.ceil((new Date(profile.arrival + "T12:00:00") - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const insightIcon = (type) => type === "warn" ? "⚠️" : type === "tip" ? "💡" : "ℹ️";
  const insightBg = (type) => type === "warn" ? "rgba(232,91,91,0.07)" : type === "tip" ? "rgba(61,184,139,0.07)" : "rgba(91,141,239,0.07)";
  const insightBorder = (type) => type === "warn" ? "rgba(232,91,91,0.25)" : type === "tip" ? "rgba(61,184,139,0.22)" : "rgba(91,141,239,0.22)";
  const insightColor = (type) => type === "warn" ? "#E85B5B" : type === "tip" ? "#3DB88B" : "#5B8DEF";
  const insightBadge = (type) => type === "warn"
    ? { label: "🔴 Urgent", color: "#E85B5B", bg: "rgba(232,91,91,0.15)" }
    : type === "tip"
    ? { label: "🟢 Tip", color: "#3DB88B", bg: "rgba(61,184,139,0.13)" }
    : { label: "🟡 Important", color: "#E8A838", bg: "rgba(232,168,56,0.13)" };

  const completedTasksCount = sg.tasks.filter(t => taskDone[t.id]).length;
  const docsReadyCount = Object.values(docChecked).filter(Boolean).length;

  return (
    <div style={{ minHeight: "100vh", background: "#08111C", fontFamily: "Arial, sans-serif", color: "#EEF2F7", paddingBottom: 80 }}>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg,#0B1E35 0%,#0D2A1F 100%)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "14px 20px 0" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>

          {/* Top row: avatar + brand + greeting + settings */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            {/* GB avatar circle */}
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: "linear-gradient(135deg,#1a3a5c,#0d4a2f)",
              border: "1.5px solid rgba(61,184,139,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 900, color: "#EEF2F7", letterSpacing: 0.5,
            }}>
              {profile.name ? profile.name.slice(0,2).toUpperCase() : "GB"}
            </div>

            {/* Brand + greeting */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "nowrap" }}>
                <span style={{ fontSize: 17, fontWeight: 900, color: "#EEF2F7", whiteSpace: "nowrap" }}>
                  Settle<span style={{ color: "#3DB88B" }}>UK</span>
                </span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>·</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  Hello, {profile.name}!
                </span>
              </div>
              {arrivalDays !== null && (
                <div style={{ fontSize: 11, fontWeight: 700, color: arrivalDays > 0 ? "#3DB88B" : "#3DB88B", marginTop: 1 }}>
                  {arrivalDays > 0 ? `${arrivalDays} days to arrival` : "You're in the UK now! 🇬🇧"}
                </div>
              )}
            </div>

            {/* Settings icon */}
            <button
              onClick={() => { setEditProfile({ name: profile.name, arrival: profile.arrival }); setShowSettings(true); }}
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8, color: "rgba(255,255,255,0.5)",
                cursor: "pointer", fontSize: 15,
                width: 34, height: 34, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
              ⚙️
            </button>
          </div>

          {/* Stage pill */}
          <div style={{ marginBottom: 10 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "4px 12px",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 20,
              fontSize: 11.5, fontWeight: 700, color: "#EEF2F7",
            }}>
              📍 {sg.name}
            </span>
          </div>

          {/* Nav tabs */}
          <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
            {[["home", "🏠", "Home"], ["tasks", "✅", "Tasks"], ["docs", "📄", "Documents"], ["guides", "📖", "Guides"]].map(([id, em, lbl]) => (
              <button key={id} onClick={() => setTab(id)} style={{
                flex: "none", padding: "8px 14px",
                background: "transparent", border: "none",
                borderBottom: tab === id ? "2px solid #3DB88B" : "2px solid transparent",
                color: tab === id ? "#3DB88B" : "rgba(255,255,255,0.4)",
                fontSize: 12.5, fontWeight: tab === id ? 700 : 400,
                cursor: "pointer", whiteSpace: "nowrap",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                <span style={{ fontSize: 13 }}>{em}</span> {lbl}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 20px" }}>

        {/* HOME TAB */}
        {tab === "home" && (
          <div>
            {/* ── Welcome + Status Dropdown ── */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>Welcome back, {profile.name} 👋</div>
              </div>

              {/* Status Dropdown sits right under welcome */}
              <StatusDropdown statusId={statusId} onChange={changeStatus} />
            </div>

            {/* Countdown Card */}
            <CountdownCard arrivalDays={arrivalDays} />

            {/* Stepper Progress Bar */}
            <StepperBar stIdx={stIdx} sg={sg} />

            {/* Readiness Score */}
            <ReadinessScore stIdx={stIdx} taskDone={taskDone} docChecked={docChecked} sg={sg} />

            {/* Motivational banner */}
            <div style={{ background: "rgba(61,184,139,0.07)", border: "1px solid rgba(61,184,139,0.18)", borderRadius: 12, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>😊</span>
              <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{sg.emotion}</span>
            </div>

            {/* Next Best Action */}
            <NextBestAction sg={sg} onStart={() => setTab("tasks")} />

            {/* Insights — with priority badges */}
            <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>Insights & Risk Alerts</h3>
            {sg.insights.map((ins, i) => {
              const badge = insightBadge(ins.type);
              return (
                <div key={i} style={{ display: "flex", gap: 10, background: insightBg(ins.type), border: `1px solid ${insightBorder(ins.type)}`, borderRadius: 12, padding: "10px 12px", marginBottom: 7 }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{insightIcon(ins.type)}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12.5, fontWeight: 800, color: insightColor(ins.type) }}>{ins.title}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: badge.color, background: badge.bg, padding: "2px 7px", borderRadius: 20, letterSpacing: 0.3 }}>
                        {badge.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{ins.sub}</div>
                  </div>
                </div>
              );
            })}

            {/* Quick actions */}
            <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.3)", margin: "18px 0 10px" }}>Quick Actions</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { icon: "📄", title: "Documents", sub: `${docsReadyCount} of ${DOCS.length} ready`, dest: "docs" },
                { icon: "✅", title: "Tasks", sub: `${completedTasksCount} of ${sg.tasks.length} done`, dest: "tasks" },
                { icon: "🏦", title: "Banking guide", sub: "Open Monzo", dest: "guides" },
                { icon: "🏥", title: "NHS guide", sub: "Register with GP", dest: "guides" },
              ].map((a, i) => (
                <div key={i} onClick={() => setTab(a.dest)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 9 }}>
                  <span style={{ fontSize: 20 }}>{a.icon}</span>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700 }}>{a.title}</div>
                    <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.4)" }}>{a.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TASKS TAB */}
        {tab === "tasks" && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 19, fontWeight: 800 }}>{sg.name} tasks</h2>
            <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "rgba(255,255,255,0.4)" }}>{completedTasksCount} of {sg.tasks.length} completed · {sg.deadline}</p>
            {sg.tasks.map(task => (
              <div key={task.id} onClick={() => toggleTask(task.id)} style={{ display: "flex", gap: 12, padding: "13px 14px", marginBottom: 7, background: taskDone[task.id] ? "rgba(61,184,139,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${taskDone[task.id] ? "#3DB88B44" : "rgba(255,255,255,0.06)"}`, borderRadius: 12, cursor: "pointer", alignItems: "flex-start" }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 2, border: `2px solid ${taskDone[task.id] ? "#3DB88B" : "rgba(255,255,255,0.2)"}`, background: taskDone[task.id] ? "#3DB88B" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                  {taskDone[task.id] && "✓"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, textDecoration: taskDone[task.id] ? "line-through" : "none", color: taskDone[task.id] ? "rgba(255,255,255,0.3)" : "#EEF2F7" }}>{task.text}</span>
                    {task.priority && !taskDone[task.id] && (<span style={{ fontSize: 9.5, fontWeight: 700, color: "#E8A838", background: "#E8A83822", padding: "2px 7px", borderRadius: 8 }}>PRIORITY</span>)}
                  </div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16, padding: "11px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, fontSize: 11.5, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
              💡 Tasks update automatically based on your stage. Change it anytime on the Home tab.
            </div>
          </div>
        )}

        {/* DOCS TAB */}
        {tab === "docs" && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 19, fontWeight: 800 }}>📄 Document Vault</h2>
            <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "rgba(255,255,255,0.4)" }}>{docsReadyCount} of {DOCS.length} documents ready</p>
            <div style={{ background: "rgba(232,168,56,0.08)", border: "1px solid rgba(232,168,56,0.25)", borderRadius: 12, padding: "10px 14px", marginBottom: 16, fontSize: 12.5, color: "rgba(255,255,255,0.65)" }}>
              💡 <strong style={{ color: "#E8A838" }}>Tip:</strong> Scan everything and upload to Google Drive. Never carry all originals in one bag.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {DOCS.map(doc => (
                <div key={doc.id} onClick={() => toggleDoc(doc.id)} style={{ padding: "12px", borderRadius: 12, cursor: "pointer", background: docChecked[doc.id] ? "rgba(61,184,139,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${docChecked[doc.id] ? "#3DB88B55" : "rgba(255,255,255,0.07)"}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 20 }}>{doc.icon}</span>
                    <div style={{ marginLeft: "auto", width: 16, height: 16, borderRadius: 5, border: `2px solid ${docChecked[doc.id] ? "#3DB88B" : "rgba(255,255,255,0.2)"}`, background: docChecked[doc.id] ? "#3DB88B" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>{docChecked[doc.id] && "✓"}</div>
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: docChecked[doc.id] ? "rgba(255,255,255,0.4)" : "#EEF2F7", textDecoration: docChecked[doc.id] ? "line-through" : "none" }}>{doc.name}</div>
                  <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{doc.hint}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GUIDES TAB */}
        {tab === "guides" && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 19, fontWeight: 800 }}>📖 Guides & Resources</h2>
            <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "rgba(255,255,255,0.4)" }}>Official links and step-by-step guides for life in UK</p>
            {GUIDES.map((g, i) => (
              <a key={i} href={g.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", marginBottom: 7, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, textDecoration: "none", color: "#EEF2F7" }}>
                <span style={{ fontSize: 22 }}>{g.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{g.title}</div>
                  <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{g.sub}</div>
                </div>
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 15 }}>↗</span>
              </a>
            ))}
          </div>
        )}

      </div>

      {/* BOTTOM NAV */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(8,17,28,0.96)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", padding: "8px 0 14px" }}>
        {[["home", "🏠", "Home"], ["tasks", "✅", "Tasks"], ["docs", "📄", "Docs"], ["guides", "📖", "Guides"]].map(([id, em, lbl]) => (
          <button key={id} onClick={() => setTab(id)} style={{ flex: 1, background: "transparent", border: "none", cursor: "pointer", padding: "4px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 20 }}>{em}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: tab === id ? "#3DB88B" : "rgba(255,255,255,0.3)" }}>{lbl}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
