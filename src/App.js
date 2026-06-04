import { useState } from "react";

const PHASES = [
  {
    id: "preflight", label: "Before You Fly", emoji: "✈️", accent: "#E8A838",
    tasks: [
      { id: "pf1", title: "Valid Passport & Visa", detail: "Confirm visa type matches purpose. Check expiry date.", urgent: true },
      { id: "pf2", title: "Book eSIM / UK SIM", detail: "GiffGaff, Lebara, Lyca — order online before flying.", urgent: true },
      { id: "pf3", title: "Travel Insurance", detail: "Get comprehensive cover including medical and baggage." },
      { id: "pf4", title: "Confirm Accommodation", detail: "Secure first 4–6 weeks. You need this address for bank accounts." },
      { id: "pf5", title: "Scan All Documents", detail: "Upload passport, visa, offer letter, bank statement to Google Drive." },
      { id: "pf6", title: "Notify Your Home Bank", detail: "Tell them you are travelling to avoid card blocks." },
    ]
  },
  {
    id: "arrival", label: "First 7 Days", emoji: "🏠", accent: "#3DB88B",
    tasks: [
      { id: "ar1", title: "Collect BRP from Post Office", detail: "Must collect within 10 days of arrival. Check visa vignette for location.", urgent: true },
      { id: "ar2", title: "Activate UK SIM or eSIM", detail: "Get a working UK number immediately for verification texts." },
      { id: "ar3", title: "Open Monzo or Starling Account", detail: "No UK address needed on day 1. Just passport and selfie.", urgent: true },
      { id: "ar4", title: "Register at University or Employer", detail: "Complete enrolment or HR onboarding. Get your student or staff ID." },
      { id: "ar5", title: "Find Local GP Surgery", detail: "Find nearest NHS GP at nhs.uk/service-search. Register same day." },
    ]
  },
  {
    id: "month1", label: "First Month", emoji: "📋", accent: "#5B8DEF",
    tasks: [
      { id: "m1a", title: "Register with GP (NHS)", detail: "Walk in with passport and proof of address. Registration is free.", urgent: true },
      { id: "m1b", title: "Apply for NI Number", detail: "Call 0800 141 2075 or apply online. Takes 4–8 weeks.", urgent: true },
      { id: "m1c", title: "Council Tax — Check Exemption", detail: "Full-time students are usually exempt. Get letter from university." },
      { id: "m1d", title: "NHS Registration Confirmation", detail: "After GP registration you will receive an NHS number. Keep it safe." },
      { id: "m1e", title: "Set Up Internet and Utilities", detail: "Arrange broadband, electricity, water if renting privately." },
      { id: "m1f", title: "UKCISA Registration (Students)", detail: "Register with your university International Student Office." },
    ]
  },
  {
    id: "banking", label: "Banking Setup", emoji: "🏦", accent: "#9B6FE8",
    tasks: [
      { id: "bk1", title: "Monzo or Starling (Instant)", detail: "Opens with passport only. Free UK account number and sort code.", urgent: true },
      { id: "bk2", title: "Wise Multi-Currency Account", detail: "Great for sending money home. Hold GBP, USD, EUR in one account." },
      { id: "bk3", title: "Traditional Bank (HSBC or Barclays)", detail: "May need 3 months of statements. Apply after you have UK address proof." },
      { id: "bk4", title: "Set Up Direct Debits", detail: "Rent, utilities, phone bill — set up once you have sort code and account number." },
      { id: "bk5", title: "Build UK Credit Score", detail: "Register on electoral roll, use a credit builder card like Aqua or Capital One." },
    ]
  },
  {
    id: "jobs", label: "Job Searching", emoji: "💼", accent: "#E85B5B",
    tasks: [
      { id: "jb1", title: "Convert CV to UK Format", detail: "1–2 pages, no photo, no date of birth. UK English spelling." },
      { id: "jb2", title: "Create or Update LinkedIn", detail: "Add UK location, connect with professionals. Set Open to Work flag." },
      { id: "jb3", title: "Register on UK Job Portals", detail: "Indeed UK, Reed, Totaljobs, Glassdoor. Set daily alerts." },
      { id: "jb4", title: "Check Your Work Hours (Visa)", detail: "Student Visa: max 20 hrs per week during term. Check your CoS conditions." },
      { id: "jb5", title: "Apply to 5+ Jobs Per Week", detail: "Track applications in a spreadsheet. Follow up after 1 week." },
    ]
  },
  {
    id: "visa", label: "Visa & Legal", emoji: "📜", accent: "#E8783A",
    tasks: [
      { id: "vs1", title: "Note Visa Expiry Date", detail: "Set a calendar reminder 3 months before expiry to begin renewal.", urgent: true },
      { id: "vs2", title: "Understand Your Visa Conditions", detail: "Work hours, public funds access, travel rules, switching visa routes." },
      { id: "vs3", title: "Register with UKVI if Required", detail: "Some visa categories require registration with UK Visas and Immigration." },
      { id: "vs4", title: "IHS Surcharge — NHS Access", detail: "If you paid the Immigration Health Surcharge, you have full NHS access." },
      { id: "vs5", title: "Know Your Right to Work", detail: "Employers will check your share code. Generate it at gov.uk/prove-right-to-work." },
    ]
  },
];

const DOCS = [
  { id: "d1", name: "Passport", hint: "Primary photo ID", icon: "🛂" },
  { id: "d2", name: "Visa / BRP", hint: "Biometric Residence Permit", icon: "🪪" },
  { id: "d3", name: "Offer Letter", hint: "University or employer", icon: "📄" },
  { id: "d4", name: "Proof of Funds", hint: "Bank statements (3 months)", icon: "💷" },
  { id: "d5", name: "Passport Photos", hint: "At least 6 recent photos", icon: "🖼️" },
  { id: "d6", name: "NHS Number", hint: "After GP registration", icon: "🩺" },
  { id: "d7", name: "NI Number Letter", hint: "From HMRC, takes 4–8 weeks", icon: "🔢" },
  { id: "d8", name: "UK Bank Details", hint: "Sort code and account number", icon: "🏦" },
  { id: "d9", name: "Insurance Certificate", hint: "Travel and health insurance", icon: "🛡️" },
  { id: "d10", name: "Tenancy Agreement", hint: "Proof of UK address", icon: "🏠" },
  { id: "d11", name: "Council Tax Letter", hint: "Exemption if student", icon: "📬" },
  { id: "d12", name: "University or Work ID", hint: "Student or staff card", icon: "🎓" },
];

const RESOURCES = [
  { title: "GOV.UK — Visas and Immigration", url: "https://www.gov.uk/visas-immigration", icon: "🏛️", cat: "Official" },
  { title: "NHS — Find a GP", url: "https://www.nhs.uk/service-search/find-a-gp", icon: "🩺", cat: "Healthcare" },
  { title: "Apply for NI Number", url: "https://www.gov.uk/apply-national-insurance-number", icon: "🔢", cat: "Official" },
  { title: "Monzo — Open UK Account", url: "https://monzo.com", icon: "💳", cat: "Banking" },
  { title: "Wise — Send Money Home", url: "https://wise.com", icon: "💸", cat: "Banking" },
  { title: "Reed — UK Jobs", url: "https://www.reed.co.uk", icon: "💼", cat: "Jobs" },
  { title: "Indeed UK", url: "https://www.indeed.co.uk", icon: "🔍", cat: "Jobs" },
  { title: "Rightmove — UK Housing", url: "https://www.rightmove.co.uk", icon: "🏘️", cat: "Housing" },
  { title: "UKCISA — Student Support", url: "https://www.ukcisa.org.uk", icon: "🎓", cat: "Students" },
  { title: "GiffGaff — UK SIM", url: "https://www.giffgaff.com", icon: "📱", cat: "SIM" },
  { title: "Council Tax Check", url: "https://www.gov.uk/council-tax/who-has-to-pay", icon: "📋", cat: "Official" },
  { title: "Prove Right to Work", url: "https://www.gov.uk/prove-right-to-work", icon: "✅", cat: "Official" },
];

const totalTasks = PHASES.reduce((a, p) => a + p.tasks.length, 0);

export default function App() {
  const [screen, setScreen] = useState("onboard");
  const [profile, setProfile] = useState({ name: "", type: "", arrival: "", step: 0 });
  const [checked, setChecked] = useState({});
  const [docChecked, setDocChecked] = useState({});
  const [tab, setTab] = useState("roadmap");
  const [openPhase, setOpenPhase] = useState("preflight");
  const [jobLog, setJobLog] = useState([]);
  const [jobForm, setJobForm] = useState({ company: "", role: "", date: "", status: "Applied" });
  const [showJobForm, setShowJobForm] = useState(false);
  const [resCat, setResCat] = useState("All");

  const done = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((done / totalTasks) * 100);

  const phaseProgress = (phase) => {
    const d = phase.tasks.filter(t => checked[t.id]).length;
    return { d, t: phase.tasks.length, pct: Math.round(d / phase.tasks.length * 100) };
  };

  const toggle = (id) => setChecked(p => ({ ...p, [id]: !p[id] }));
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
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, marginBottom: 40 }}>
                Your personal roadmap for arriving and settling in the United Kingdom.
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
              <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 24 }}>🎯 Why are you going to the UK?</h2>
              {["🎓 Student", "💼 Skilled Worker", "🎓💼 Student + Working"].map((opt, i) => (
                <button key={i} onClick={() => setProfile(p => ({ ...p, type: opt, step: 3 }))} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", marginBottom: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "#fff", fontSize: 15, cursor: "pointer", textAlign: "left" }}>
                  {opt}
                </button>
              ))}
            </div>
          )}
          {step === 3 && (
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 24, padding: "32px 28px", border: "1px solid rgba(255,255,255,0.1)" }}>
              <button onClick={() => setProfile(p => ({ ...p, step: 2 }))} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13, marginBottom: 16, padding: 0 }}>← Back</button>
              <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 24 }}>📅 When do you arrive in the UK?</h2>
              <input type="date" value={profile.arrival} onChange={e => setProfile(p => ({ ...p, arrival: e.target.value }))} style={inputStyle} />
              <button disabled={!profile.arrival} onClick={() => { setScreen("home"); setTab("roadmap"); }} style={btnStyle(profile.arrival ? "#3DB88B" : "#333")}>
                Build My Roadmap 🗺️
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const cats = ["All", ...Array.from(new Set(RESOURCES.map(r => r.cat)))];
  const filteredRes = resCat === "All" ? RESOURCES : RESOURCES.filter(r => r.cat === resCat);

  return (
    <div style={{ minHeight: "100vh", background: "#08111C", fontFamily: "Arial, sans-serif", color: "#EEF2F7", paddingBottom: 72 }}>
      <div style={{ background: "linear-gradient(135deg,#0B1E35,#0D2A1F)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px 20px 0" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ fontSize: 28 }}>🇬🇧</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 19, fontWeight: 800 }}>Settle<span style={{ color: "#3DB88B" }}>UK</span></div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{profile.name} · {profile.type}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#3DB88B" }}>{pct}%</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{done}/{totalTasks} tasks</div>
            </div>
          </div>
          <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 8, marginBottom: 18, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#3DB88B,#1D9E6A)", borderRadius: 8, transition: "width .5s" }} />
          </div>
          <div style={{ display: "flex", gap: 2, overflowX: "auto", paddingBottom: 1 }}>
            {[["roadmap", "🗺️ Roadmap"], ["docs", "📄 Documents"], ["jobs", "💼 Jobs"], ["resources", "🔗 Resources"]].map(([id, lbl]) => (
              <button key={id} onClick={() => setTab(id)} style={{ flex: "none", padding: "9px 14px", background: "transparent", border: "none", borderBottom: tab === id ? "2px solid #3DB88B" : "2px solid transparent", color: tab === id ? "#3DB88B" : "rgba(255,255,255,0.45)", fontSize: 13, fontWeight: tab === id ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap" }}>{lbl}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "20px 16px" }}>

        {tab === "roadmap" && (
          <div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 20, paddingBottom: 4 }}>
              {PHASES.map(ph => {
                const { d, t, pct: pp } = phaseProgress(ph);
                return (
                  <button key={ph.id} onClick={() => setOpenPhase(ph.id)} style={{ flex: "none", display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 20, background: openPhase === ph.id ? ph.accent + "33" : "rgba(255,255,255,0.04)", border: `1px solid ${openPhase === ph.id ? ph.accent + "66" : "rgba(255,255,255,0.06)"}`, color: openPhase === ph.id ? ph.accent : "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                    {ph.emoji} {ph.label}
                    <span style={{ background: openPhase === ph.id ? ph.accent : "rgba(255,255,255,0.12)", color: openPhase === ph.id ? "#fff" : "rgba(255,255,255,0.5)", borderRadius: 10, padding: "1px 7px", fontSize: 11 }}>{d}/{t}</span>
                  </button>
                );
              })}
            </div>
            {PHASES.map(ph => ph.id === openPhase && (
              <div key={ph.id}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 28 }}>{ph.emoji}</span>
                  <div>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{ph.label}</h2>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{phaseProgress(ph).d} of {phaseProgress(ph).t} completed</div>
                  </div>
                  <div style={{ marginLeft: "auto", fontSize: 13, fontWeight: 700, color: ph.accent, background: ph.accent + "22", padding: "4px 12px", borderRadius: 12 }}>{phaseProgress(ph).pct}%</div>
                </div>
                {ph.tasks.map(task => (
                  <div key={task.id} onClick={() => toggle(task.id)} style={{ display: "flex", gap: 14, padding: "14px 16px", marginBottom: 8, background: checked[task.id] ? "rgba(61,184,139,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${checked[task.id] ? "#3DB88B44" : "rgba(255,255,255,0.06)"}`, borderRadius: 14, cursor: "pointer", alignItems: "flex-start" }}>
                    <div style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, marginTop: 2, border: `2px solid ${checked[task.id] ? "#3DB88B" : "rgba(255,255,255,0.2)"}`, background: checked[task.id] ? "#3DB88B" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>
                      {checked[task.id] && "✓"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, fontWeight: 700, textDecoration: checked[task.id] ? "line-through" : "none", color: checked[task.id] ? "rgba(255,255,255,0.3)" : "#EEF2F7" }}>{task.title}</span>
                        {task.urgent && !checked[task.id] && (<span style={{ fontSize: 10, fontWeight: 700, color: "#E8A838", background: "#E8A83822", padding: "2px 7px", borderRadius: 8 }}>PRIORITY</span>)}
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{task.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {tab === "docs" && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>📄 Document Vault</h2>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Track which documents you have ready</p>
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

        {tab === "jobs" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>💼 Job Tracker</h2>
                <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{jobLog.length} application{jobLog.length !== 1 ? "s" : ""} tracked</p>
              </div>
              <button onClick={() => setShowJobForm(!showJobForm)} style={{ padding: "8px 16px", background: "#5B8DEF22", border: "1px solid #5B8DEF55", borderRadius: 10, color: "#5B8DEF", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Add Job</button>
            </div>
            {showJobForm && (
              <div style={{ background: "rgba(91,141,239,0.06)", border: "1px solid rgba(91,141,239,0.2)", borderRadius: 16, padding: "18px 16px", marginBottom: 20 }}>
                <h3 style={{ margin: "0 0 14px", fontSize: 15, color: "#5B8DEF" }}>New Application</h3>
                {[["Company", "company", "text"], ["Role / Job Title", "role", "text"], ["Date Applied", "date", "date"]].map(([lbl, key, type]) => (
                  <div key={key} style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>{lbl}</label>
                    <input type={type} value={jobForm[key]} onChange={e => setJobForm(p => ({ ...p, [key]: e.target.value }))} style={{ ...inputStyle, marginBottom: 0 }} placeholder={lbl} />
                  </div>
                ))}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Status</label>
                  <select value={jobForm.status} onChange={e => setJobForm(p => ({ ...p, status: e.target.value }))} style={{ ...inputStyle, marginBottom: 0 }}>
                    {["Applied", "Interview", "Offer", "Rejected", "Withdrawn"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { if (jobForm.company && jobForm.role) { setJobLog(p => [{ ...jobForm, id: Date.now() }, ...p]); setJobForm({ company: "", role: "", date: "", status: "Applied" }); setShowJobForm(false); } }} style={{ ...btnStyle("#5B8DEF"), padding: "10px 20px", flex: 1 }}>Save</button>
                  <button onClick={() => setShowJobForm(false)} style={{ ...btnStyle("rgba(255,255,255,0.08)"), padding: "10px 20px" }}>Cancel</button>
                </div>
              </div>
            )}
            {jobLog.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "rgba(255,255,255,0.2)", fontSize: 14 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                No applications yet. Start tracking your job search!
              </div>
            ) : jobLog.map(j => {
              const statusColors = { Applied: "#5B8DEF", Interview: "#E8A838", Offer: "#3DB88B", Rejected: "#E85B5B", Withdrawn: "#999" };
              const sc = statusColors[j.status] || "#999";
              return (
                <div key={j.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{j.company}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{j.role}</div>
                    {j.date && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>{j.date}</div>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: sc, background: sc + "22", padding: "4px 10px", borderRadius: 10 }}>{j.status}</span>
                    <button onClick={() => setJobLog(p => p.filter(x => x.id !== j.id))} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.2)", cursor: "pointer", fontSize: 16 }}>✕</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "resources" && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>🔗 Resources</h2>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Official links and tools for UK settlers</p>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 18, paddingBottom: 4 }}>
              {cats.map(c => (
                <button key={c} onClick={() => setResCat(c)} style={{ flex: "none", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", background: resCat === c ? "#3DB88B" : "rgba(255,255,255,0.05)", color: resCat === c ? "#fff" : "rgba(255,255,255,0.5)", border: `1px solid ${resCat === c ? "#3DB88B" : "rgba(255,255,255,0.08)"}` }}>{c}</button>
              ))}
            </div>
            {filteredRes.map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", marginBottom: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, textDecoration: "none", color: "#EEF2F7" }}>
                <span style={{ fontSize: 24 }}>{r.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{r.title}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{r.cat}</div>
                </div>
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 16 }}>↗</span>
              </a>
            ))}
          </div>
        )}

      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(8,17,28,0.95)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", padding: "8px 0 12px" }}>
        {[["roadmap", "🗺️", "Roadmap"], ["docs", "📄", "Documents"], ["jobs", "💼", "Jobs"], ["resources", "🔗", "Resources"]].map(([id, em, lbl]) => (
          <button key={id} onClick={() => setTab(id)} style={{ flex: 1, background: "transparent", border: "none", cursor: "pointer", padding: "4px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 20 }}>{em}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: tab === id ? "#3DB88B" : "rgba(255,255,255,0.3)" }}>{lbl}</span>
          </button>
        ))}
      </div>
    </div>
  );
}