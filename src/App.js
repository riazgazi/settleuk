import { useState, useEffect } from "react";

// ============================================================
// DATA — Status definitions and stage details
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

const ALL_STAGE_NAMES = ["Research", "Applied", "Offer", "CAS", "Visa applied", "Visa approved", "Arrived"];

const STAGES = [
  {
    id: 0, name: "Research & IELTS", sub: "Choose university, prepare English test",
    nextAction: "Book IELTS test", deadline: "ASAP — 6-12 months before intake",
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
    nextAction: "Follow up with admissions", deadline: "Check application portal weekly",
    emotion: "Application submitted! Most offers arrive within 4-8 weeks. Stay patient.",
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
    emotion: "Congratulations! Accept your offer quickly — CAS takes time to process.",
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
    emotion: "Visa submitted! Average decision: 3 weeks. Use this time to prepare departure.",
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
    emotion: "Visa approved! You are going to UK. Final preparations — almost there!",
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
    emotion: "Welcome to UK! Complete these tasks in order — do not delay BRP collection.",
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
  const [editProfile, setEditProfile] = useState({ name: "", statusId: 0, arrival: "" });

  useEffect(() => { saveLS("settleuk_profile", profile); }, [profile]);
  useEffect(() => { saveLS("settleuk_tasks", taskDone); }, [taskDone]);
  useEffect(() => { saveLS("settleuk_docs", docChecked); }, [docChecked]);

  const toggleTask = (id) => setTaskDone(p => ({ ...p, [id]: !p[id] }));
  const toggleDoc = (id) => setDocChecked(p => ({ ...p, [id]: !p[id] }));

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
    return (
      <div style={{ minHeight: "100vh", background: "#08111C", fontFamily: "Arial, sans-serif", color: "#EEF2F7", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 420, background: "rgba(255,255,255,0.05)", borderRadius: 24, padding: "32px 28px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>⚙️ Settings</h2>
            <button onClick={() => setShowSettings(false)} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 20 }}>✕</button>
          </div>

          <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Your Name</label>
          <input value={editProfile.name} onChange={e => setEditProfile(p => ({ ...p, name: e.target.value }))} placeholder="Enter your name" style={inputStyle} />

          <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Current Status</label>
          <div style={{ marginBottom: 16 }}>
            {STATUSES.map(s => (
              <button key={s.id} onClick={() => setEditProfile(p => ({ ...p, statusId: s.id }))} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px", marginBottom: 8,
                background: editProfile.statusId === s.id ? "rgba(61,184,139,0.2)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${editProfile.statusId === s.id ? "#3DB88B" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 12, color: "#fff", fontSize: 14, cursor: "pointer", textAlign: "left"
              }}>
                {s.emoji} {s.label}
              </button>
            ))}
          </div>

          <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>UK Arrival Date (estimated)</label>
          <input type="date" value={editProfile.arrival} onChange={e => setEditProfile(p => ({ ...p, arrival: e.target.value }))} style={inputStyle} />

          <button onClick={() => {
            if (editProfile.name.trim()) {
              setProfile(p => ({ ...p, ...editProfile }));
              setShowSettings(false);
            }
          }} style={btnStyle(editProfile.name.trim() ? "#3DB88B" : "#333")}>
            Save Changes ✓
          </button>

          <button onClick={() => {
            if (window.confirm("Reset all progress and start over?")) {
              localStorage.clear();
              window.location.reload();
            }
          }} style={{ ...btnStyle("rgba(232,91,91,0.2)"), marginTop: 10, border: "1px solid rgba(232,91,91,0.4)", color: "#E85B5B" }}>
            Reset All Progress
          </button>
        </div>
      </div>
    );
  }

  // ── ONBOARDING ──────────────────────────────────────────────
  if (screen === "onboard") {
    const step = profile.step;
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(160deg,#0B1E35 0%,#0D2A1F 50%,#1A0D2E 100%)",
        fontFamily: "Arial, sans-serif", padding: 20
      }}>
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
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 20 }}>This helps us build your personalised roadmap</p>
              {STATUSES.map(s => (
                <button key={s.id} onClick={() => setProfile(p => ({ ...p, statusId: s.id, step: 3 }))} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "13px 16px", marginBottom: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "#fff", fontSize: 14, cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: 20 }}>{s.emoji}</span>
                  <span>
                    <div style={{ fontWeight: 700 }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{s.sub}</div>
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
  const insightBg = (type) => type === "warn" ? "rgba(232,168,56,0.08)" : type === "tip" ? "rgba(61,184,139,0.08)" : "rgba(91,141,239,0.08)";
  const insightBorder = (type) => type === "warn" ? "rgba(232,168,56,0.25)" : type === "tip" ? "rgba(61,184,139,0.25)" : "rgba(91,141,239,0.25)";
  const insightColor = (type) => type === "warn" ? "#E8A838" : type === "tip" ? "#3DB88B" : "#5B8DEF";

  const completedTasksCount = sg.tasks.filter(t => taskDone[t.id]).length;
  const docsReadyCount = Object.values(docChecked).filter(Boolean).length;

  return (
    <div style={{ minHeight: "100vh", background: "#08111C", fontFamily: "Arial, sans-serif", color: "#EEF2F7", paddingBottom: 72 }}>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg,#0B1E35,#0D2A1F)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px 20px 0" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 28 }}>🇬🇧</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 19, fontWeight: 800 }}>
                Settle<span style={{ color: "#3DB88B" }}>UK</span>
                {profile.name && <span style={{ fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.6)", marginLeft: 8 }}>· Hello, {profile.name}!</span>}
              </div>
              {arrivalDays !== null && (
                <div style={{ fontSize: 12, color: arrivalDays > 0 ? "#E8A838" : "#3DB88B" }}>
                  {arrivalDays > 0 ? `${arrivalDays} days to arrival` : "You're in the UK now!"}
                </div>
              )}
            </div>
            <button onClick={() => { setEditProfile({ name: profile.name, statusId: profile.statusId, arrival: profile.arrival }); setShowSettings(true); }}
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 18, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
              ⚙️
            </button>
          </div>

          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, background: sg.chipBg, color: sg.chipColor, padding: "4px 12px", borderRadius: 20 }}>
              📍 {sg.name} stage
            </span>
          </div>

          <div style={{ display: "flex", gap: 2, overflowX: "auto", paddingBottom: 1 }}>
            {[["home", "🏠 Home"], ["tasks", "✅ Tasks"], ["docs", "📄 Documents"], ["guides", "📖 Guides"]].map(([id, lbl]) => (
              <button key={id} onClick={() => setTab(id)} style={{ flex: "none", padding: "9px 14px", background: "transparent", border: "none", borderBottom: tab === id ? "2px solid #3DB88B" : "2px solid transparent", color: tab === id ? "#3DB88B" : "rgba(255,255,255,0.45)", fontSize: 13, fontWeight: tab === id ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap" }}>{lbl}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "20px 16px" }}>

        {/* HOME TAB */}
        {tab === "home" && (
          <div>
            {/* Emotional support banner */}
            <div style={{ background: "rgba(61,184,139,0.08)", border: "1px solid rgba(61,184,139,0.25)", borderRadius: 14, padding: "12px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>😊</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{sg.emotion}</span>
            </div>

            {/* Next best action */}
            <div style={{ background: sg.accentBg + "22", border: `1px solid ${sg.accentBg}55`, borderRadius: 16, padding: "16px", marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: sg.accentBtn, marginBottom: 6 }}>⚡ Next best action</div>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{sg.nextAction}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>🕒 {sg.deadline}</div>
              <button onClick={() => setTab("tasks")} style={{ width: "100%", padding: "10px 0", background: sg.accentBtn, border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Start Now →
              </button>
            </div>

            {/* Journey map */}
            <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>Your journey</h3>
            <div style={{ marginBottom: 20 }}>
              {ALL_STAGE_NAMES.map((name, i) => {
                const isDone = i < stIdx;
                const isNow = i === stIdx;
                const isLast = i === ALL_STAGE_NAMES.length - 1;
                return (
                  <div key={i} style={{ display: "flex", gap: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 28, flexShrink: 0 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0,
                        background: isDone ? "#3DB88B22" : isNow ? sg.accentBtn : "rgba(255,255,255,0.05)",
                        border: `1px solid ${isDone ? "#3DB88B" : isNow ? sg.accentBtn : "rgba(255,255,255,0.15)"}`,
                        color: isDone ? "#3DB88B" : isNow ? "#fff" : "rgba(255,255,255,0.3)"
                      }}>
                        {isDone ? "✓" : isNow ? "●" : i + 1}
                      </div>
                      {!isLast && <div style={{ width: 2, height: 24, background: isDone ? "#3DB88B" : "rgba(255,255,255,0.1)", margin: "2px 0" }} />}
                    </div>
                    <div style={{ paddingTop: 3, paddingBottom: isLast ? 0 : 16 }}>
                      <div style={{
                        fontSize: 13, fontWeight: 700,
                        color: isDone ? "rgba(255,255,255,0.35)" : isNow ? sg.accentText === "#085041" ? "#3DB88B" : "#fff" : "rgba(255,255,255,0.4)",
                        textDecoration: isDone ? "line-through" : "none"
                      }}>
                        {name}
                        {isNow && <span style={{ fontSize: 10, fontWeight: 700, background: sg.chipBg, color: sg.chipColor, padding: "2px 8px", borderRadius: 10, marginLeft: 8 }}>You are here</span>}
                      </div>
                      {isDone && <div style={{ fontSize: 11, color: "#3DB88B", marginTop: 2 }}>✓ Completed</div>}
                      {isNow && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{sg.sub}</div>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Insights & risk alerts */}
            <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>Insights & risk alerts</h3>
            {sg.insights.map((ins, i) => (
              <div key={i} style={{ display: "flex", gap: 12, background: insightBg(ins.type), border: `1px solid ${insightBorder(ins.type)}`, borderRadius: 14, padding: "12px 14px", marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>{insightIcon(ins.type)}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: insightColor(ins.type), marginBottom: 2 }}>{ins.title}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{ins.sub}</div>
                </div>
              </div>
            ))}

            {/* Quick actions */}
            <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.4)", margin: "20px 0 12px" }}>Quick actions</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div onClick={() => setTab("docs")} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>📄</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Documents</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{docsReadyCount} of {DOCS.length} ready</div>
                </div>
              </div>
              <div onClick={() => setTab("tasks")} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>✅</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Tasks</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{completedTasksCount} of {sg.tasks.length} done</div>
                </div>
              </div>
              <div onClick={() => setTab("guides")} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>🏦</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Banking guide</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Open Monzo</div>
                </div>
              </div>
              <div onClick={() => setTab("guides")} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>🏥</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>NHS guide</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Register with GP</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TASKS TAB */}
        {tab === "tasks" && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>{sg.name} tasks</h2>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{completedTasksCount} of {sg.tasks.length} completed · {sg.deadline}</p>
            {sg.tasks.map(task => (
              <div key={task.id} onClick={() => toggleTask(task.id)} style={{ display: "flex", gap: 14, padding: "14px 16px", marginBottom: 8, background: taskDone[task.id] ? "rgba(61,184,139,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${taskDone[task.id] ? "#3DB88B44" : "rgba(255,255,255,0.06)"}`, borderRadius: 14, cursor: "pointer", alignItems: "flex-start" }}>
                <div style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, marginTop: 2, border: `2px solid ${taskDone[task.id] ? "#3DB88B" : "rgba(255,255,255,0.2)"}`, background: taskDone[task.id] ? "#3DB88B" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>
                  {taskDone[task.id] && "✓"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, textDecoration: taskDone[task.id] ? "line-through" : "none", color: taskDone[task.id] ? "rgba(255,255,255,0.3)" : "#EEF2F7" }}>{task.text}</span>
                    {task.priority && !taskDone[task.id] && (<span style={{ fontSize: 10, fontWeight: 700, color: "#E8A838", background: "#E8A83822", padding: "2px 7px", borderRadius: 8 }}>PRIORITY</span>)}
                  </div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 20, padding: "12px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
              💡 Your tasks update automatically based on your current stage. Change your status in ⚙️ Settings as you progress.
            </div>
          </div>
        )}

        {/* DOCS TAB */}
        {tab === "docs" && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>📄 Document Vault</h2>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{docsReadyCount} of {DOCS.length} documents ready</p>
            <div style={{ background: "rgba(232,168,56,0.08)", border: "1px solid rgba(232,168,56,0.25)", borderRadius: 14, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
              💡 <strong style={{ color: "#E8A838" }}>Tip:</strong> Scan everything and upload to Google Drive. Never carry all originals in one bag.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {DOCS.map(doc => (
                <div key={doc.id} onClick={() => toggleDoc(doc.id)} style={{ padding: "14px", borderRadius: 14, cursor: "pointer", background: docChecked[doc.id] ? "rgba(61,184,139,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${docChecked[doc.id] ? "#3DB88B55" : "rgba(255,255,255,0.07)"}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 22 }}>{doc.icon}</span>
                    <div style={{ marginLeft: "auto", width: 18, height: 18, borderRadius: 5, border: `2px solid ${docChecked[doc.id] ? "#3DB88B" : "rgba(255,255,255,0.2)"}`, background: docChecked[doc.id] ? "#3DB88B" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>{docChecked[doc.id] && "✓"}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: docChecked[doc.id] ? "rgba(255,255,255,0.4)" : "#EEF2F7", textDecoration: docChecked[doc.id] ? "line-through" : "none" }}>{doc.name}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{doc.hint}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GUIDES TAB */}
        {tab === "guides" && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>📖 Guides & Resources</h2>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Official links and step-by-step guides for life in UK</p>
            {GUIDES.map((g, i) => (
              <a key={i} href={g.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", marginBottom: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, textDecoration: "none", color: "#EEF2F7" }}>
                <span style={{ fontSize: 24 }}>{g.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{g.title}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{g.sub}</div>
                </div>
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 16 }}>↗</span>
              </a>
            ))}
          </div>
        )}

      </div>

      {/* BOTTOM NAV */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(8,17,28,0.95)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", padding: "8px 0 12px" }}>
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