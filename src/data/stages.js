// Journey stages, statuses, and auto-advance mapping — extracted from App.js
// NOTE: only change vs original file is the addition of `destination` on each
// STAGES entry, per explicit instruction to keep the Start Now → setTab
// mapping data-driven instead of hardcoded in HomeDashboard.

export const STATUSES = [
  { id: 0, label: "Just researching", sub: "Exploring UK study options", emoji: "🔍" },
  { id: 1, label: "Applied to university", sub: "Waiting for offer letter", emoji: "📝" },
  { id: 2, label: "Offer received", sub: "Got conditional/unconditional offer", emoji: "🎉" },
  { id: 3, label: "CAS received", sub: "University sent CAS number", emoji: "📋" },
  { id: 4, label: "Visa applied", sub: "Application submitted", emoji: "⏳" },
  { id: 5, label: "Visa approved", sub: "Ready to travel to UK", emoji: "✅" },
  { id: 6, label: "Already in UK", sub: "Arrived and settling", emoji: "🇬🇧" },
];

export const ALL_STAGE_NAMES = ["Research", "Apply", "Offer", "CAS", "Visa", "Approved", "UK"];

export const AUTO_ADVANCE = {
  "t0-2": 1,
  "t1-1": 2,
  "t2-3": 3,
  "t3-2": 4,
  "t4-1": 5,
  "t5-1": 6,
};

export const STAGES = [
  {
    id: 0, name: "Research & IELTS",
    nextAction: "Book IELTS test", deadline: "ASAP — 6-12 months before intake", deadlineUrgency: "medium",
    destination: "academic_profile",
    emotion: "Great time to start! Early preparation means better university options.",
    accentBtn: "#185FA5", chipColor: "#185FA5",
    tasks: [
      { id: "t0-1", text: "Research UK universities on UCAS", priority: true, desc: "Browse UK universities, compare courses, rankings, and entry requirements all in one place. This is the official UK university search portal.", link: "https://www.ucas.com/explore/search/results" },
      { id: "t0-2", text: "Register for IELTS or PTE Academic", priority: true, autoAdvance: true, desc: "Most UK universities require an English proficiency score. IELTS Academic (6.0-7.0) is the most widely accepted. Book through British Council or IDP.", link: "https://www.ielts.org/book-a-test" },
      { id: "t0-3", text: "Prepare personal statement draft", desc: "A 500-word essay explaining why you want to study your chosen course. Universities use this to assess motivation and fit — start drafting early and revise multiple times.", link: "https://www.ucas.com/undergraduate/applying-university/how-write-ucas-undergraduate-personal-statement" },
      { id: "t0-4", text: "Check tuition fees and scholarship options", desc: "Compare tuition costs across shortlisted universities and check for Chevening, GREAT, or university-specific scholarships for Bangladeshi students.", link: "https://www.chevening.org/scholarships" },
      { id: "t0-5", text: "Contact university admissions teams", desc: "Email the international admissions office directly with questions about entry requirements, deadlines, or scholarships — many respond within a few days.", link: "https://www.ukcisa.org.uk" },
    ],
    insights: [
      { type: "tip", title: "Start early", sub: "Universities with September intake usually open applications 12 months ahead." },
      { type: "info", title: "IELTS validity", sub: "IELTS scores are valid for 2 years — plan your test date accordingly." },
    ],
  },
  {
    id: 1, name: "University application",
    nextAction: "Follow up with admissions", deadline: "Check portal this week", deadlineUrgency: "high",
    destination: "tasks",
    emotion: "Application submitted! Most universities reply within 4-8 weeks. Stay patient.",
    accentBtn: "#534AB7", chipColor: "#534AB7",
    tasks: [
      { id: "t1-1", text: "Log in to portal & confirm offer received", priority: true, autoAdvance: true, desc: "Check your university's applicant portal regularly — offer letters are often sent there before email. Look for both conditional and unconditional offer types.", link: "https://www.ucas.com/track" },
      { id: "t1-2", text: "Prepare for possible interview", priority: true, desc: "Some courses (especially Medicine, Law, or competitive Master's programs) require an interview. Practice common questions about your motivation and career goals.", link: "https://www.ukcisa.org.uk" },
      { id: "t1-3", text: "Gather financial documents early", desc: "Start collecting bank statements, sponsorship letters, or scholarship confirmations now — visa applications later require very specific, recent documentation.", link: "https://www.gov.uk/student-visa/money" },
      { id: "t1-4", text: "Research student accommodation options", desc: "Compare university halls vs private student accommodation vs shared housing. Book early as popular options fill up fast, especially for September intake.", link: "https://www.studentcrowd.com" },
      { id: "t1-5", text: "Connect with current students on LinkedIn", desc: "Search your university name + course on LinkedIn to find current students. They can give honest insights about teaching quality, city life, and costs.", link: "https://www.linkedin.com" },
    ],
    insights: [
      { type: "tip", title: "Be reachable", sub: "Universities may email or call for interviews — check spam folder regularly." },
      { type: "info", title: "Average wait", sub: "Most UK universities respond within 4-8 weeks of application." },
    ],
  },
  {
    id: 2, name: "Offer received",
    nextAction: "Accept offer and pay deposit", deadline: "Check offer letter for deadline", deadlineUrgency: "high",
    destination: "tasks",
    emotion: "Congratulations! Time to accept your offer and prepare for CAS.",
    accentBtn: "#0F6E56", chipColor: "#0F6E56",
    tasks: [
      { id: "t2-1", text: "Accept unconditional offer formally", priority: true, desc: "Once all conditions (grades, English score) are met, formally accept your offer through the university portal. This locks in your place for the intake.", link: "https://www.ucas.com/track" },
      { id: "t2-2", text: "Pay tuition deposit to secure place", priority: true, desc: "Most universities require a deposit (£500-£3000) to confirm your place and begin CAS processing. Keep the payment receipt — you'll need it for your visa.", link: "https://www.gov.uk/student-visa" },
      { id: "t2-3", text: "Request CAS number from university", priority: true, autoAdvance: true, desc: "CAS (Confirmation of Acceptance for Studies) is a unique reference number required for your visa application. Request it once your deposit is paid and conditions met.", link: "https://www.gov.uk/guidance/sponsorship-immigration-rules" },
      { id: "t2-4", text: "Start saving bank statement (28 days)", desc: "UKVI requires proof of funds covering tuition + living costs maintained for 28 consecutive days without dipping below the required amount. Start this clock now.", link: "https://www.gov.uk/student-visa/money" },
      { id: "t2-5", text: "Book TB test appointment (Bangladesh)", desc: "Bangladesh is on the UK's TB testing list. You must get tested at an approved clinic before applying for your visa. Results are valid for 6 months.", link: "https://www.gov.uk/tb-test-visa" },
    ],
    insights: [
      { type: "warn", title: "Conditional offer?", sub: "Make sure you meet all conditions before requesting CAS." },
      { type: "tip", title: "Bank statement timing", sub: "Start your 28-day bank statement period now — it takes time to build up." },
    ],
  },
  {
    id: 3, name: "CAS received",
    nextAction: "Submit visa application online", deadline: "At least 3 months before intake", deadlineUrgency: "critical",
    destination: "prep",
    emotion: "CAS received — this is the most critical stage. Apply for visa immediately.",
    accentBtn: "#993C1D", chipColor: "#993C1D",
    tasks: [
      { id: "t3-1", text: "Pay Immigration Health Surcharge (IHS)", priority: true, desc: "The IHS gives you access to the NHS while studying in the UK. Pay it as part of your visa application — the amount depends on your course duration.", link: "https://www.gov.uk/healthcare-immigration-application" },
      { id: "t3-2", text: "Complete & submit online visa application", priority: true, autoAdvance: true, desc: "Apply for your Student visa online using your CAS number, passport, and financial documents. This is the official UK government application portal.", link: "https://www.gov.uk/student-visa/apply" },
      { id: "t3-3", text: "Prepare 28-day bank statement", priority: true, desc: "Submit a bank statement showing the required funds held for 28 consecutive days, dated within 31 days of your visa application.", link: "https://www.gov.uk/student-visa/money" },
      { id: "t3-4", text: "Book biometric appointment at UKVCAS", priority: true, desc: "After applying online, you must visit a UK Visa and Citizenship Application Services centre in Bangladesh to give fingerprints and a photo.", link: "https://www.ukvi-international.com" },
      { id: "t3-5", text: "Collect TB test certificate", desc: "Pick up your TB clearance certificate from the approved clinic — this must be uploaded as part of your visa application.", link: "https://www.gov.uk/tb-test-visa" },
      { id: "t3-6", text: "Book flights once visa is submitted", desc: "You can book flights provisionally once your visa is submitted, but avoid non-refundable tickets until the visa is actually approved.", link: "https://www.skyscanner.net" },
    ],
    insights: [
      { type: "warn", title: "Bank statement risk", sub: "Must show funds for 28 consecutive days. Any dip restarts the count." },
      { type: "tip", title: "Apply early for visa", sub: "Average processing: 3 weeks. Apply soon to stay safe before intake." },
      { type: "info", title: "TB test required", sub: "Bangladesh is on the TB test list. Book appointment before visa application." },
    ],
  },
  {
    id: 4, name: "Visa applied",
    nextAction: "Prepare pre-departure checklist", deadline: "Decision usually in 3 weeks", deadlineUrgency: "medium",
    destination: "prep",
    emotion: "Visa submitted! Average decision time: 3 weeks. Use this time to prep for departure.",
    accentBtn: "#854F0B", chipColor: "#854F0B",
    tasks: [
      { id: "t4-1", text: "Book flights — visa approved, time to fly!", priority: true, autoAdvance: true, desc: "Now that your visa is approved, book your flight to the UK. Try to arrive a few days before your course starts to settle in and sort accommodation.", link: "https://www.skyscanner.net" },
      { id: "t4-2", text: "Confirm university accommodation booking", priority: true, desc: "Finalize your room booking with the university or private provider. Confirm move-in dates align with your flight arrival.", link: "https://www.studentcrowd.com" },
      { id: "t4-3", text: "Order eSIM (GiffGaff, Lebara)", desc: "Get a UK eSIM or physical SIM ready before you land so you have data and a UK number from day one. GiffGaff and Lebara are popular budget options.", link: "https://www.giffgaff.com" },
      { id: "t4-4", text: "Get travel insurance", desc: "Cover flight delays, lost luggage, and emergencies during travel. Some banks or credit cards include this — check before buying separately.", link: "https://www.gocompare.com/travel-insurance/" },
      { id: "t4-5", text: "Pack essentials — clothes for cold weather", desc: "UK winters are cold and wet. Pack a warm coat, waterproof shoes, and layers — buying these in the UK can be expensive initially.", link: "https://www.metoffice.gov.uk" },
      { id: "t4-6", text: "Inform home bank about travel", desc: "Notify your Bangladeshi bank of your travel dates so international card transactions aren't flagged or blocked while you're abroad.", link: "https://www.bb.org.bd" },
    ],
    insights: [
      { type: "tip", title: "Use the waiting time well", sub: "Visa decisions take about 3 weeks — perfect time to prep for departure." },
      { type: "info", title: "Priority service", sub: "Priority visa service gives a decision in 5 working days if short on time." },
    ],
  },
  {
    id: 5, name: "Visa approved",
    nextAction: "Check BRP collection Post Office", deadline: "Note it in your visa vignette", deadlineUrgency: "high",
    destination: "packing",
    emotion: "Visa approved! You are going to the UK. Final preparations — almost there!",
    accentBtn: "#0F6E56", chipColor: "#0F6E56",
    tasks: [
      { id: "t5-1", text: "Noted BRP Post Office — I have arrived in UK!", priority: true, autoAdvance: true, desc: "Check your visa vignette sticker — it states which Post Office branch you must collect your Biometric Residence Permit (BRP) from after arrival.", link: "https://www.gov.uk/biometric-residence-permits" },
      { id: "t5-2", text: "Download bank app (Monzo/Starling)", desc: "Monzo and Starling allow you to open a UK bank account quickly, even before you have a permanent address — useful in your first days.", link: "https://monzo.com" },
      { id: "t5-3", text: "Join university Facebook/WhatsApp groups", desc: "Search your university name + intake year on Facebook to find official and student-run groups. Great for asking arrival questions and finding flatmates.", link: "https://www.facebook.com" },
      { id: "t5-4", text: "Pack documents in hand luggage only", desc: "Never check in your passport, visa, CAS, offer letter, or financial documents. Keep all originals in your hand luggage in case checked bags are delayed or lost.", link: "https://www.gov.uk/student-visa" },
      { id: "t5-5", text: "Confirm airport pickup or transport", desc: "Arrange in advance how you'll get from the airport to your accommodation — university shuttle, pre-booked taxi, or public transport with luggage in mind.", link: "https://www.nationalexpress.com" },
      { id: "t5-6", text: "Exchange some cash to GBP", desc: "Carry a small amount of GBP cash (£100-200) for your first few days before your UK bank account is fully active.", link: "https://wise.com" },
    ],
    insights: [
      { type: "warn", title: "BRP collection deadline", sub: "You must collect your BRP within 10 days of arrival or as stated on your visa." },
      { type: "tip", title: "Keep documents handy", sub: "Passport, visa, offer letter, CAS — all in hand luggage, never checked baggage." },
    ],
  },
  {
    id: 6, name: "Arrived in UK",
    nextAction: "Collect BRP from Post Office", deadline: "Within 10 days of arrival", deadlineUrgency: "critical",
    destination: "guides",
    emotion: "Welcome to the UK! Complete these tasks in order — do not delay BRP collection.",
    accentBtn: "#0F6E56", chipColor: "#0F6E56",
    tasks: [
      { id: "t6-1", text: "Collect BRP from Post Office", priority: true, desc: "Visit the specific Post Office named on your visa vignette within 10 days of arrival, bringing your passport. This card is your legal proof of residence status.", link: "https://www.gov.uk/biometric-residence-permits" },
      { id: "t6-2", text: "Open Monzo or Starling bank account", priority: true, desc: "These apps let you open an account with just your passport and UK address — no need to wait for a traditional bank's longer process.", link: "https://monzo.com" },
      { id: "t6-3", text: "Register at university — get student ID", priority: true, desc: "Complete in-person enrolment at your university to receive your official student ID card, needed for library access, discounts, and proof of status.", link: "https://www.ukcisa.org.uk" },
      { id: "t6-4", text: "Register with local NHS GP surgery", desc: "Find and register with a local GP (doctor) near your accommodation — this is free since you paid the Immigration Health Surcharge already.", link: "https://www.nhs.uk/service-search/find-a-gp" },
      { id: "t6-5", text: "Apply for NI Number (call 0800 141 2075)", desc: "A National Insurance Number is required to work legally and pay tax in the UK. Apply by phone — it can take 4-8 weeks to arrive by post.", link: "https://www.gov.uk/apply-national-insurance-number" },
      { id: "t6-6", text: "Get council tax exemption letter", desc: "Full-time students are usually exempt from council tax. Request an exemption certificate from your university to avoid being billed.", link: "https://www.gov.uk/council-tax/who-has-to-pay" },
    ],
    insights: [
      { type: "warn", title: "BRP first!", sub: "Collect your BRP within 10 days — delays can cause legal issues." },
      { type: "tip", title: "NI Number takes time", sub: "Apply for your National Insurance number now — it can take 4-8 weeks." },
    ],
  },
];
