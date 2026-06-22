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
      { id: "t0-1", text: "Research UK universities on UCAS", priority: true, desc: "Browse UK universities, compare courses, rankings, and entry requirements all in one place. This is the official UK university search portal.", link: "https://www.ucas.com/explore/search/results" },
      { id: "t0-2", text: "Register for IELTS or PTE Academic", priority: true, autoAdvance: true, desc: "Most UK universities require an English proficiency score. IELTS Academic (6.0-7.0) is the most widely accepted. Book through British Council or IDP.", link: "https://www.ielts.org/book-a-test" },
      { id: "t0-3", text: "Prepare personal statement draft", desc: "A 500-word essay explaining why you want to study your chosen course. Universities use this to assess motivation and fit — start drafting early and revise multiple times.", link: "https://www.ucas.com/undergraduate/applying-university/how-write-ucas-undergraduate-personal-statement" },
      { id: "t0-4", text: "Check tuition fees and scholarship options", desc: "Compare tuition costs across shortlisted universities and check for Chevening, GREAT, or university-specific scholarships for Bangladeshi students.", link: "https://www.chevening.org/scholarships" },
      { id: "t0-5", text: "Contact university admissions teams", desc: "Email the international admissions office directly with questions about entry requirements, deadlines, or scholarships — many respond within a few days.", link: "https://www.ukcisa.org.uk" },
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
      { id: "t1-1", text: "Log in to portal & confirm offer received", priority: true, autoAdvance: true, desc: "Check your university's applicant portal regularly — offer letters are often sent there before email. Look for both conditional and unconditional offer types.", link: "https://www.ucas.com/track" },
      { id: "t1-2", text: "Prepare for possible interview", priority: true, desc: "Some courses (especially Medicine, Law, or competitive Master's programs) require an interview. Practice common questions about your motivation and career goals.", link: "https://www.ukcisa.org.uk" },
      { id: "t1-3", text: "Gather financial documents early", desc: "Start collecting bank statements, sponsorship letters, or scholarship confirmations now — visa applications later require very specific, recent documentation.", link: "https://www.gov.uk/student-visa/money" },
      { id: "t1-4", text: "Research student accommodation options", desc: "Compare university halls vs private student accommodation vs shared housing. Book early as popular options fill up fast, especially for September intake.", link: "https://www.studentcrowd.com" },
      { id: "t1-5", text: "Connect with current students on LinkedIn", desc: "Search your university name + course on LinkedIn to find current students. They can give honest insights about teaching quality, city life, and costs.", link: "https://www.linkedin.com" },
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
      { id: "t2-1", text: "Accept unconditional offer formally",  priority: true, desc: "Once all conditions (grades, English score) are met, formally accept your offer through the university portal. This locks in your place for the intake.", link: "https://www.ucas.com/track" },
      { id: "t2-2", text: "Pay tuition deposit to secure place",  priority: true, desc: "Most universities require a deposit (£500-£3000) to confirm your place and begin CAS processing. Keep the payment receipt — you'll need it for your visa.", link: "https://www.gov.uk/student-visa" },
      { id: "t2-3", text: "Request CAS number from university",   priority: true, autoAdvance: true, desc: "CAS (Confirmation of Acceptance for Studies) is a unique reference number required for your visa application. Request it once your deposit is paid and conditions met.", link: "https://www.gov.uk/guidance/sponsorship-immigration-rules" },
      { id: "t2-4", text: "Start saving bank statement (28 days)", desc: "UKVI requires proof of funds covering tuition + living costs maintained for 28 consecutive days without dipping below the required amount. Start this clock now.", link: "https://www.gov.uk/student-visa/money" },
      { id: "t2-5", text: "Book TB test appointment (Bangladesh)", desc: "Bangladesh is on the UK's TB testing list. You must get tested at an approved clinic before applying for your visa. Results are valid for 6 months.", link: "https://www.gov.uk/tb-test-visa" },
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
      { id: "t3-1", text: "Pay Immigration Health Surcharge (IHS)",   priority: true, desc: "The IHS gives you access to the NHS while studying in the UK. Pay it as part of your visa application — the amount depends on your course duration.", link: "https://www.gov.uk/healthcare-immigration-application" },
      { id: "t3-2", text: "Complete & submit online visa application", priority: true, autoAdvance: true, desc: "Apply for your Student visa online using your CAS number, passport, and financial documents. This is the official UK government application portal.", link: "https://www.gov.uk/student-visa/apply" },
      { id: "t3-3", text: "Prepare 28-day bank statement",            priority: true, desc: "Submit a bank statement showing the required funds held for 28 consecutive days, dated within 31 days of your visa application.", link: "https://www.gov.uk/student-visa/money" },
      { id: "t3-4", text: "Book biometric appointment at UKVCAS",     priority: true, desc: "After applying online, you must visit a UK Visa and Citizenship Application Services centre in Bangladesh to give fingerprints and a photo.", link: "https://www.ukvi-international.com" },
      { id: "t3-5", text: "Collect TB test certificate", desc: "Pick up your TB clearance certificate from the approved clinic — this must be uploaded as part of your visa application.", link: "https://www.gov.uk/tb-test-visa" },
      { id: "t3-6", text: "Book flights once visa is submitted", desc: "You can book flights provisionally once your visa is submitted, but avoid non-refundable tickets until the visa is actually approved.", link: "https://www.skyscanner.net" },
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
      { id: "t4-1", text: "Book flights — visa approved, time to fly!", priority: true, autoAdvance: true, desc: "Now that your visa is approved, book your flight to the UK. Try to arrive a few days before your course starts to settle in and sort accommodation.", link: "https://www.skyscanner.net" },
      { id: "t4-2", text: "Confirm university accommodation booking",    priority: true, desc: "Finalize your room booking with the university or private provider. Confirm move-in dates align with your flight arrival.", link: "https://www.studentcrowd.com" },
      { id: "t4-3", text: "Order eSIM (GiffGaff, Lebara)", desc: "Get a UK eSIM or physical SIM ready before you land so you have data and a UK number from day one. GiffGaff and Lebara are popular budget options.", link: "https://www.giffgaff.com" },
      { id: "t4-4", text: "Get travel insurance", desc: "Cover flight delays, lost luggage, and emergencies during travel. Some banks or credit cards include this — check before buying separately.", link: "https://www.gocompare.com/travel-insurance/" },
      { id: "t4-5", text: "Pack essentials — clothes for cold weather", desc: "UK winters are cold and wet. Pack a warm coat, waterproof shoes, and layers — buying these in the UK can be expensive initially.", link: "https://www.metoffice.gov.uk" },
      { id: "t4-6", text: "Inform home bank about travel", desc: "Notify your Bangladeshi bank of your travel dates so international card transactions aren't flagged or blocked while you're abroad.", link: "https://www.bb.org.bd" },
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
      { id: "t5-1", text: "Noted BRP Post Office — I have arrived in UK!", priority: true, autoAdvance: true, desc: "Check your visa vignette sticker — it states which Post Office branch you must collect your Biometric Residence Permit (BRP) from after arrival.", link: "https://www.gov.uk/biometric-residence-permits" },
      { id: "t5-2", text: "Download bank app (Monzo/Starling)", desc: "Monzo and Starling allow you to open a UK bank account quickly, even before you have a permanent address — useful in your first days.", link: "https://monzo.com" },
      { id: "t5-3", text: "Join university Facebook/WhatsApp groups", desc: "Search your university name + intake year on Facebook to find official and student-run groups. Great for asking arrival questions and finding flatmates.", link: "https://www.facebook.com" },
      { id: "t5-4", text: "Pack documents in hand luggage only", desc: "Never check in your passport, visa, CAS, offer letter, or financial documents. Keep all originals in your hand luggage in case checked bags are delayed or lost.", link: "https://www.gov.uk/student-visa" },
      { id: "t5-5", text: "Confirm airport pickup or transport", desc: "Arrange in advance how you'll get from the airport to your accommodation — university shuttle, pre-booked taxi, or public transport with luggage in mind.", link: "https://www.nationalexpress.com" },
      { id: "t5-6", text: "Exchange some cash to GBP", desc: "Carry a small amount of GBP cash (£100-200) for your first few days before your UK bank account is fully active.", link: "https://wise.com" },
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
      { id: "t6-1", text: "Collect BRP from Post Office",            priority: true, desc: "Visit the specific Post Office named on your visa vignette within 10 days of arrival, bringing your passport. This card is your legal proof of residence status.", link: "https://www.gov.uk/biometric-residence-permits" },
      { id: "t6-2", text: "Open Monzo or Starling bank account",     priority: true, desc: "These apps let you open an account with just your passport and UK address — no need to wait for a traditional bank's longer process.", link: "https://monzo.com" },
      { id: "t6-3", text: "Register at university — get student ID", priority: true, desc: "Complete in-person enrolment at your university to receive your official student ID card, needed for library access, discounts, and proof of status.", link: "https://www.ukcisa.org.uk" },
      { id: "t6-4", text: "Register with local NHS GP surgery", desc: "Find and register with a local GP (doctor) near your accommodation — this is free since you paid the Immigration Health Surcharge already.", link: "https://www.nhs.uk/service-search/find-a-gp" },
      { id: "t6-5", text: "Apply for NI Number (call 0800 141 2075)", desc: "A National Insurance Number is required to work legally and pay tax in the UK. Apply by phone — it can take 4-8 weeks to arrive by post.", link: "https://www.gov.uk/apply-national-insurance-number" },
      { id: "t6-6", text: "Get council tax exemption letter", desc: "Full-time students are usually exempt from council tax. Request an exemption certificate from your university to avoid being billed.", link: "https://www.gov.uk/council-tax/who-has-to-pay" },
    ],
    insights: [
      { type: "warn", title: "BRP first!",           sub: "Collect your BRP within 10 days — delays can cause legal issues." },
      { type: "tip",  title: "NI Number takes time", sub: "Apply for your National Insurance number now — it can take 4-8 weeks." },
    ],
  },
];

const DOCS = [
  { id: "d1",  name: "Passport",           hint: "Valid 6+ months",           icon: "🛂", desc: "Your passport must be valid for at least 6 months beyond your intended stay in the UK. Renew early if it's close to expiring — this is required for every stage from visa application to BRP collection.", link: "https://www.passport.gov.bd" },
  { id: "d2",  name: "Offer Letter",        hint: "Conditional/unconditional", icon: "📄", desc: "Issued by your university confirming your place on a course. A conditional offer requires you to meet certain requirements (grades, English score) before it becomes unconditional.", link: "https://www.ucas.com/track" },
  { id: "d3",  name: "CAS Number",          hint: "From university",           icon: "🎓", desc: "Confirmation of Acceptance for Studies — a unique reference number from your university required to apply for your Student visa. Issued after you accept your offer and pay any deposit.", link: "https://www.gov.uk/guidance/sponsorship-immigration-rules" },
  { id: "d4",  name: "IELTS Certificate",   hint: "Score 6.0+ usually",        icon: "📝", desc: "Proof of English proficiency required by most UK universities and for the visa application. Most courses need an overall score of 6.0-7.0, with no band below a set minimum.", link: "https://www.ielts.org" },
  { id: "d5",  name: "Bank Statement",      hint: "28 consecutive days",       icon: "💷", desc: "Must show funds covering tuition and living costs maintained for 28 consecutive days, dated within 31 days of your visa application. Any dip below the required amount restarts the 28-day clock.", link: "https://www.gov.uk/student-visa/money" },
  { id: "d6",  name: "TB Test Result",      hint: "From approved clinic",      icon: "🩺", desc: "Bangladesh is on the UK's TB testing list, so this certificate is mandatory for the visa. Must be from a UK-approved clinic and is valid for 6 months.", link: "https://www.gov.uk/tb-test-visa" },
  { id: "d7",  name: "Passport Photos",     hint: "2 recent photos",           icon: "🖼️", desc: "Recent passport-style photos meeting UK visa specifications (plain background, no glasses glare, neutral expression) — needed for visa forms and BRP application.", link: "https://www.gov.uk/photos-for-passports" },
  { id: "d8",  name: "IHS Receipt",         hint: "After payment",             icon: "🛡️", desc: "Proof of payment for the Immigration Health Surcharge, which gives you NHS access while studying. Keep this receipt safe — you may need to show it to register with a GP.", link: "https://www.gov.uk/healthcare-immigration-application" },
  { id: "d9",  name: "Personal Statement",  hint: "For visa form",             icon: "✍️", desc: "A written explanation of your study plans and reasons for choosing the UK and your course — sometimes requested as supporting evidence in the visa application.", link: "https://www.ucas.com/undergraduate/applying-university/how-write-ucas-undergraduate-personal-statement" },
  { id: "d10", name: "Accommodation Proof", hint: "Uni halls or rental",       icon: "🏠", desc: "Confirmation letter or tenancy agreement showing where you'll live in the UK — useful for visa support and for registering with a GP or bank.", link: "https://www.studentcrowd.com" },
  { id: "d11", name: "BRP / Visa Vignette", hint: "After visa approval",       icon: "🪪", desc: "Your Biometric Residence Permit is your physical proof of visa status in the UK. Collect it from the Post Office named on your visa sticker within 10 days of arrival.", link: "https://www.gov.uk/biometric-residence-permits" },
  { id: "d12", name: "NI Number Letter",    hint: "From HMRC",                 icon: "🔢", desc: "Official letter confirming your National Insurance Number, required to work legally and pay tax in the UK. Apply by phone after arrival — it can take 4-8 weeks.", link: "https://www.gov.uk/apply-national-insurance-number" },
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
// DATA: Packing Planner
// ============================================================
const PACKING_CATEGORIES = [
  {
    id: "docs", name: "Documents", icon: "📄", color: "#5B8DEF",
    items: [
      { id: "p-doc-1", name: "Passport", weight: 0 },
      { id: "p-doc-2", name: "BRP / Visa vignette", weight: 0 },
      { id: "p-doc-3", name: "CAS letter", weight: 0 },
      { id: "p-doc-4", name: "Offer letter", weight: 0 },
      { id: "p-doc-5", name: "IELTS certificate", weight: 0 },
      { id: "p-doc-6", name: "Academic transcripts & certificates", weight: 0.3 },
      { id: "p-doc-7", name: "TB test certificate", weight: 0 },
      { id: "p-doc-8", name: "Bank statements (printed)", weight: 0.1 },
      { id: "p-doc-9", name: "Passport photos", weight: 0 },
      { id: "p-doc-10", name: "Accommodation confirmation", weight: 0 },
    ],
  },
  {
    id: "winter", name: "Winter Clothes", icon: "🧥", color: "#06b6d4",
    items: [
      { id: "p-win-1", name: "Heavy winter coat", weight: 1.5 },
      { id: "p-win-2", name: "Waterproof jacket", weight: 0.6 },
      { id: "p-win-3", name: "Sweaters / jumpers (3-4)", weight: 1.2 },
      { id: "p-win-4", name: "Thermal innerwear", weight: 0.4 },
      { id: "p-win-5", name: "Warm socks (5+ pairs)", weight: 0.3 },
      { id: "p-win-6", name: "Gloves", weight: 0.1 },
      { id: "p-win-7", name: "Scarf / muffler", weight: 0.15 },
      { id: "p-win-8", name: "Beanie / winter hat", weight: 0.1 },
      { id: "p-win-9", name: "Waterproof shoes/boots", weight: 1.0 },
    ],
  },
  {
    id: "regular", name: "Regular Clothes", icon: "👕", color: "#84cc16",
    items: [
      { id: "p-reg-1", name: "T-shirts / shirts (6-8)", weight: 1.0 },
      { id: "p-reg-2", name: "Trousers / jeans (4-5)", weight: 1.5 },
      { id: "p-reg-3", name: "Formal wear (1-2 sets)", weight: 0.8 },
      { id: "p-reg-4", name: "Sleepwear", weight: 0.3 },
      { id: "p-reg-5", name: "Undergarments (10+)", weight: 0.4 },
      { id: "p-reg-6", name: "Regular shoes / sneakers", weight: 0.7 },
      { id: "p-reg-7", name: "Belt", weight: 0.1 },
    ],
  },
  {
    id: "electronics", name: "Electronics", icon: "🔌", color: "#a78bfa",
    items: [
      { id: "p-ele-1", name: "Laptop + charger", weight: 1.8 },
      { id: "p-ele-2", name: "Phone + charger", weight: 0.2 },
      { id: "p-ele-3", name: "UK plug adapter (Type G)", weight: 0.1 },
      { id: "p-ele-4", name: "Power bank", weight: 0.3 },
      { id: "p-ele-5", name: "Headphones/earbuds", weight: 0.1 },
      { id: "p-ele-6", name: "Multi-port charger/extension", weight: 0.2 },
    ],
  },
  {
    id: "toiletries", name: "Toiletries", icon: "🧴", color: "#f43f5e",
    items: [
      { id: "p-toi-1", name: "Toothbrush & toothpaste", weight: 0.1 },
      { id: "p-toi-2", name: "Skincare basics", weight: 0.3 },
      { id: "p-toi-3", name: "Travel-size shampoo/soap", weight: 0.2 },
      { id: "p-toi-4", name: "Razor / shaving kit", weight: 0.1 },
      { id: "p-toi-5", name: "Sanitary products (few weeks' supply)", weight: 0.3 },
      { id: "p-toi-6", name: "Towel (quick-dry travel towel)", weight: 0.3 },
    ],
  },
  {
    id: "kitchen", name: "Kitchen & Food", icon: "🍳", color: "#fb923c",
    items: [
      { id: "p-kit-1", name: "Favourite spices (sealed)", weight: 0.5 },
      { id: "p-kit-2", name: "Instant noodles / snacks", weight: 0.5 },
      { id: "p-kit-3", name: "Small cooking utensil set", weight: 0.4 },
      { id: "p-kit-4", name: "Reusable water bottle", weight: 0.2 },
      { id: "p-kit-5", name: "Lunch box / tiffin", weight: 0.2 },
    ],
  },
  {
    id: "academic", name: "Academic Supplies", icon: "📚", color: "#f59e0b",
    items: [
      { id: "p-aca-1", name: "Notebooks & stationery", weight: 0.4 },
      { id: "p-aca-2", name: "Calculator (if needed)", weight: 0.2 },
      { id: "p-aca-3", name: "Backpack/laptop bag", weight: 0.6 },
      { id: "p-aca-4", name: "USB drive", weight: 0.05 },
    ],
  },
  {
    id: "money", name: "Money & Cards", icon: "💳", color: "#00c896",
    items: [
      { id: "p-mon-1", name: "GBP cash (£100-200)", weight: 0 },
      { id: "p-mon-2", name: "International debit/credit card", weight: 0 },
      { id: "p-mon-3", name: "Travel money card (Wise/Revolut)", weight: 0 },
    ],
  },
  {
    id: "health", name: "Health & Medicine", icon: "💊", color: "#ec4899",
    items: [
      { id: "p-hea-1", name: "Prescription medicines (with letter)", weight: 0.2 },
      { id: "p-hea-2", name: "Basic first-aid items", weight: 0.2 },
      { id: "p-hea-3", name: "Spare glasses/contact lenses", weight: 0.1 },
      { id: "p-hea-4", name: "Vitamins/supplements", weight: 0.2 },
    ],
  },
  {
    id: "misc", name: "Miscellaneous", icon: "🎒", color: "#7d8590",
    items: [
      { id: "p-mis-1", name: "Photos of family", weight: 0.05 },
      { id: "p-mis-2", name: "Small gift items / souvenirs", weight: 0.3 },
      { id: "p-mis-3", name: "Lock for luggage", weight: 0.1 },
      { id: "p-mis-4", name: "Umbrella (compact)", weight: 0.3 },
      { id: "p-mis-5", name: "Reusable shopping bag", weight: 0.05 },
    ],
  },
];

const LUGGAGE_PRESETS = [
  { id: "23", label: "23 kg (Standard checked bag)", limit: 23 },
  { id: "30", label: "30 kg (Extra baggage)", limit: 30 },
  { id: "32", label: "32 kg (Max single bag - most airlines)", limit: 32 },
  { id: "custom", label: "Custom limit", limit: null },
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

// ============================================================
// COST CALCULATOR + EXPENSE TRACKER — data
// ============================================================
const COST_FIXED = { ielts: 200, visa: 490, cas: 150, deposit: 1334, bio: 19 };
const UNI_TUITION_MAP = { northumbria: 12000, manchester: 22000, sheffield: 18000, coventry: 13500, huddersfield: 14000 };

const EXPENSE_CAT_META = {
  visa:      { icon: "🛂", color: "#4a9eff" },
  ielts:     { icon: "📝", color: "#00c896" },
  travel:    { icon: "✈️", color: "#f59e0b" },
  tuition:   { icon: "🎓", color: "#a78bfa" },
  living:    { icon: "🏠", color: "#fb923c" },
  food:      { icon: "🍜", color: "#f43f5e" },
  mobile:    { icon: "📱", color: "#06b6d4" },
  transport: { icon: "🚌", color: "#84cc16" },
  health:    { icon: "💊", color: "#ec4899" },
  other:     { icon: "📦", color: "#7d8590" },
};

const fmtGBP = (v) => "£" + parseFloat(v || 0).toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const gbp2bdt = (v, rate) => "৳ " + Math.round((v || 0) * rate).toLocaleString("en-IN");
const formatMonth = (mmyyyy) => {
  const parts = mmyyyy.split("/");
  if (parts.length !== 2) return mmyyyy;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months[parseInt(parts[0]) - 1] + " " + parts[1];
};


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
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
      <circle cx={cx} cy={cy - r} r={4} fill="rgba(255,255,255,0.12)" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray 0.8s ease" }} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill="#EEF2F7" fontSize="16" fontWeight="800">{score}</text>
      <text x={cx} y={cy + 9} textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize="8">/100</text>
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
        <div style={{ fontSize: 13, fontWeight: 800, color: labelColor, marginBottom: 7, lineHeight: 1.3 }}>
          {score} of 100 points
          <span style={{
            display: "inline-block", marginLeft: 8,
            fontSize: 10, fontWeight: 700,
            color: labelColor, background: labelColor + "20",
            padding: "1px 8px", borderRadius: 20,
          }}>{label}</span>
        </div>

        <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 5, overflow: "hidden", marginBottom: 7 }}>
          <div style={{ height: "100%", width: `${score}%`, background: barGradient, borderRadius: 5, transition: "width 0.6s ease" }} />
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: hints.length ? 8 : 0 }}>
          <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.28)" }}>✅ {completedTasks} tasks</span>
          <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.28)" }}>📄 {completedDocs} docs</span>
        </div>

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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "rgba(255,255,255,0.3)" }}>
          Current Status
        </span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.22)", fontStyle: "italic" }}>tap to change</span>
      </div>

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
// COMPONENT: Inline info expand panel — used by Tasks & Docs
// ============================================================
function InfoExpand({ desc, link, accent }) {
  return (
    <div style={{
      marginTop: 8, marginLeft: 32,
      padding: "10px 12px",
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${accent}33`,
      borderRadius: 10,
      animation: "infoFadeIn 0.18s ease",
    }}>
      <style>{`@keyframes infoFadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.55, marginBottom: link ? 9 : 0 }}>
        {desc}
      </div>
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 11, fontWeight: 700, color: accent,
          textDecoration: "none",
          padding: "5px 11px",
          background: accent + "18",
          border: `1px solid ${accent}40`,
          borderRadius: 8,
        }}>
          🔗 Learn more / Official link ↗
        </a>
      )}
    </div>
  );
}


function UniversityFinderFlow({ onClose, onSaveProfile, savedAcademic }) {
  const [step, setStep] = useState("intro");
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

        <div style={{ width: 40, height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 4, margin: "0 auto 18px" }} />

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

        {step === "level" && (
          <div>
            <button onClick={() => setStep("intro")} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13, marginBottom: 14, padding: 0 }}>← Back</button>
            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Which level are you applying for?</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12.5, marginBottom: 18 }}>This determines which grades we'll ask for next.</p>

            <button onClick={() => { setLevel("bachelor"); setStep("form"); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px", marginBottom: 10, background: level === "bachelor" ? "rgba(61,184,139,0.12)" : "rgba(255,255,255,0.05)", border: level === "bachelor" ? "1.5px solid #3DB88B" : "1.5px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "#fff", cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: 22 }}>🎓</span>
              <span><div style={{ fontWeight: 800, fontSize: 14 }}>Bachelor's Degree</div><div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)" }}>Undergraduate — based on SSC & HSC GPA</div></span>
            </button>

            <button onClick={() => { setLevel("masters"); setStep("form"); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px", background: level === "masters" ? "rgba(61,184,139,0.12)" : "rgba(255,255,255,0.05)", border: level === "masters" ? "1.5px solid #3DB88B" : "1.5px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "#fff", cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: 22 }}>📘</span>
              <span><div style={{ fontWeight: 800, fontSize: 14 }}>Master's Degree</div><div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)" }}>Postgraduate — based on Bachelor's CGPA</div></span>
            </button>

            <button onClick={handleSkip} style={{ ...btn("transparent"), marginTop: 16, border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>⚪ Skip for Now</button>
          </div>
        )}

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


// ============================================================
// COMPONENT: Costs Tab — Calculator + Expense Tracker
// ============================================================
function CostsTab() {
  const [panel, setPanel] = useState("calc");

  // ── Calculator state ──
  const [duration, setDuration] = useState(2);
  const [dependents, setDependents] = useState(0);
  const [uniPreset, setUniPreset] = useState("custom");
  const [tuition, setTuition] = useState(28000);              // TOTAL tuition for full course
  const [tuitionPaidPct, setTuitionPaidPct] = useState(100);   // % of tuition paid upfront
  const [rate, setRate] = useState(153);

  // ── Tracker state ──
  const [expenses, setExpenses] = useState(() => loadLS("settleuk_expenses", []));
  const [phase, setPhase] = useState("all");
  const [cat, setCat] = useState("all");
  const [expName, setExpName] = useState("");
  const [expAmt, setExpAmt] = useState("");
  const [expCat, setExpCat] = useState("visa");
  const [expPhase, setExpPhase] = useState("bd");

  useEffect(() => { saveLS("settleuk_expenses", expenses); }, [expenses]);

  useEffect(() => {
    if (uniPreset !== "custom" && UNI_TUITION_MAP[uniPreset]) {
      setTuition(UNI_TUITION_MAP[uniPreset] * duration);
    }
  }, [uniPreset, duration]);

  // ── Calculator derived values ──
  const totalTuition    = parseFloat(tuition) || 0;          // total tuition for WHOLE course
  const dur              = duration;
  const dep              = dependents;
  const ihsDur            = dur + 0.5;  // IHS visa duration = course length + 0.5 year
  const ihsTotal          = 776 * ihsDur * (1 + dep);
  const airTotal          = 600 * (1 + dep);
  const tuitionPayable    = totalTuition * (tuitionPaidPct / 100); // amount paid NOW based on %
  const tuitionRemaining  = totalTuition - tuitionPayable;
  const depVisa           = dep * 490;
  const depIHS            = dep * 776 * ihsDur;
  const fixedTotal        = COST_FIXED.ielts + COST_FIXED.visa + ihsTotal + COST_FIXED.cas + airTotal + COST_FIXED.deposit + COST_FIXED.bio;
  const variableTotal     = tuitionPayable + depVisa + depIHS;
  const grandTotal        = fixedTotal + variableTotal;

  const row = (icon, dotClass, label, sub, gbp) => ({ icon, dotClass, label, sub, gbp });
  const rows = [
    row("●", "", "IELTS Exam Fee", "British Council / IDP", COST_FIXED.ielts),
    row("●", "", "UK Visa Application", "Student visa fee", COST_FIXED.visa),
    row("●", "", "Immigration Health Surcharge", `£776/yr × ${ihsDur} yr${ihsDur > 1 ? "s" : ""} × ${1 + dep} person${1 + dep > 1 ? "s" : ""}`, ihsTotal),
    row("●", "", "CAS & Admin Fees", "University document charges", COST_FIXED.cas),
    row("●", "", "Air Ticket (DAC → UK)", dep ? `Applicant + ${dep} dep.` : "Applicant only", airTotal),
    row("●", "", "Initial Cash Deposit", "UKVI savings evidence", COST_FIXED.deposit),
    row("●", "", "Biometric (eVisa)", "Visa application centre", COST_FIXED.bio),
  ];
  const variableRows = [
    row("◆", "variable", `Tuition Payment (${tuitionPaidPct}%)`, `£${totalTuition.toLocaleString()} total × ${tuitionPaidPct}%`, tuitionPayable),
    row("◇", "optional", "Dependent Visa(s)", dep ? `£490 × ${dep} dependent${dep > 1 ? "s" : ""}` : "N/A", depVisa),
    row("◇", "optional", "Dependent IHS", dep ? `£776 × ${ihsDur}yr × ${dep} dep.` : "N/A", depIHS),
  ];

  // ── Tracker derived values ──
  const filteredExpenses = expenses.filter(e => (phase === "all" || e.phase === phase) && (cat === "all" || e.cat === cat));
  const byMonth = {};
  [...filteredExpenses].reverse().forEach(exp => {
    const m = exp.date.slice(3);
    if (!byMonth[m]) byMonth[m] = [];
    byMonth[m].push(exp);
  });

  const totalSpent = expenses.reduce((s, e) => s + e.amt, 0);
  const preSpent    = expenses.filter(e => e.phase === "bd").reduce((s, e) => s + e.amt, 0);
  const ukSpent     = expenses.filter(e => e.phase === "uk").reduce((s, e) => s + e.amt, 0);
  const budgetPct   = grandTotal > 0 ? Math.min(100, (totalSpent / grandTotal) * 100) : 0;
  const remaining   = Math.max(0, grandTotal - totalSpent);
  const barColor    = budgetPct < 50 ? "#00c896" : budgetPct < 80 ? "#f59e0b" : "#ef4444";

  const catTotals = {};
  expenses.forEach(e => { catTotals[e.cat] = (catTotals[e.cat] || 0) + e.amt; });
  const maxCat = Math.max(...Object.values(catTotals), 1);

  const addExpense = () => {
    const amt = parseFloat(expAmt);
    if (!expName.trim() || !amt || amt <= 0) return;
    setExpenses(p => [...p, {
      id: Date.now(), name: expName.trim(), amt, cat: expCat, phase: expPhase,
      date: new Date().toLocaleDateString("en-GB"),
    }]);
    setExpName(""); setExpAmt("");
  };
  const deleteExpense = (id) => setExpenses(p => p.filter(e => e.id !== id));

  const C = {
    surface: "#161b22", surface2: "#1c2330", border: "#2a3441",
    green: "#00c896", greenDim: "rgba(0,200,150,0.12)",
    blue: "#4a9eff", blueDim: "rgba(74,158,255,0.12)",
    amber: "#f59e0b", red: "#ef4444",
    text: "#e6edf3", textMuted: "#7d8590", textDim: "#4d5560",
  };
  const card = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 14 };
  const selectStyle = {
    width: "100%", background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8,
    color: C.text, fontSize: 13, padding: "8px 10px", fontFamily: "inherit", outline: "none",
  };
  const fInput = { flex: 1, background: "#0d1117", border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, padding: "9px 10px", fontFamily: "inherit", outline: "none", minWidth: 0 };

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        <div onClick={() => setPanel("calc")} style={{
          flex: 1, padding: "10px 8px", background: panel === "calc" ? C.greenDim : C.surface2,
          border: `1px solid ${panel === "calc" ? C.green : C.border}`, borderRadius: 10,
          cursor: "pointer", fontSize: 12, fontWeight: 700, textAlign: "center",
          color: panel === "calc" ? C.green : C.textMuted,
        }}>🧮 Calculate Your Cost</div>
        <div onClick={() => setPanel("track")} style={{
          flex: 1, padding: "10px 8px", background: panel === "track" ? C.greenDim : C.surface2,
          border: `1px solid ${panel === "track" ? C.green : C.border}`, borderRadius: 10,
          cursor: "pointer", fontSize: 12, fontWeight: 700, textAlign: "center",
          color: panel === "track" ? C.green : C.textMuted,
        }}>📊 Expense Tracker</div>
      </div>

      {panel === "calc" && (
        <div>
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>📋 Your Criteria</div>
              <div style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: C.greenDim, color: C.green, border: "1px solid rgba(0,200,150,.3)" }}>Set your plan</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 4 }}>
              <div>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Course Duration</div>
                <select value={duration} onChange={e => setDuration(parseInt(e.target.value))} style={selectStyle}>
                  <option value={1}>1 Year</option>
                  <option value={2}>2 Years</option>
                  <option value={3}>3 Years</option>
                  <option value={4}>4 Years</option>
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Dependent?</div>
                <select value={dependents} onChange={e => setDependents(parseInt(e.target.value))} style={selectStyle}>
                  <option value={0}>No Dependent</option>
                  <option value={1}>1 Dependent</option>
                  <option value={2}>2 Dependents</option>
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>University (tuition preset)</div>
                <select value={uniPreset} onChange={e => setUniPreset(e.target.value)} style={selectStyle}>
                  <option value="custom">Enter manually below</option>
                  <option value="northumbria">Northumbria University (~£12,000/yr)</option>
                  <option value="manchester">University of Manchester (~£22,000/yr)</option>
                  <option value="sheffield">University of Sheffield (~£18,000/yr)</option>
                  <option value="coventry">Coventry University (~£13,500/yr)</option>
                  <option value="huddersfield">University of Huddersfield (~£14,000/yr)</option>
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Total Tuition Fee (£ for full course)</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="number" value={tuition} onChange={e => setTuition(e.target.value)} style={{ flex: 1, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, padding: "8px 10px", fontFamily: "inherit", outline: "none" }} />
                  <div style={{ background: C.greenDim, border: "1px solid rgba(0,200,150,.3)", color: C.green, fontSize: 11, fontWeight: 700, padding: "0 10px", borderRadius: 8, display: "flex", alignItems: "center" }}>£ total</div>
                </div>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>First-Time Payment (% of total tuition)</div>
                <select value={tuitionPaidPct} onChange={e => setTuitionPaidPct(parseInt(e.target.value))} style={selectStyle}>
                  <option value={50}>50%</option>
                  <option value={60}>60%</option>
                  <option value={70}>70%</option>
                  <option value={100}>100% (full course)</option>
                </select>
                <div style={{ fontSize: 10.5, color: C.textDim, marginTop: 5, lineHeight: 1.5 }}>
                  💡 Calculation is based on your selected %. Select <strong style={{ color: C.green }}>100%</strong> to see the full course cost.
                </div>
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>📌 Cost Breakdown</div>
              <div style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: C.greenDim, color: C.green, border: "1px solid rgba(0,200,150,.3)" }}>Auto-calculated</div>
            </div>

            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 13, top: 4, bottom: 4, width: 2, backgroundImage: `repeating-linear-gradient(to bottom, ${C.border} 0, ${C.border} 6px, transparent 6px, transparent 12px)` }} />

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th colSpan={2} style={{ textAlign: "left", paddingLeft: 24, fontSize: 10, fontWeight: 600, color: C.textDim, textTransform: "uppercase", letterSpacing: 0.5, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>Item</th>
                    <th style={{ textAlign: "right", fontSize: 10, fontWeight: 600, color: C.green, textTransform: "uppercase", letterSpacing: 0.5, paddingBottom: 8, borderBottom: `1px solid ${C.border}`, minWidth: 72 }}>GBP (£)</th>
                    <th style={{ textAlign: "right", fontSize: 10, fontWeight: 600, color: C.blue, textTransform: "uppercase", letterSpacing: 0.5, paddingBottom: 8, borderBottom: `1px solid ${C.border}`, minWidth: 90 }}>BDT (৳)</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td style={{ width: 28, textAlign: "center", padding: "9px 0", borderTop: i > 0 ? `1px solid rgba(42,52,65,.5)` : "none" }}>
                        <div style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${C.green}`, background: "#0d1117", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 7, color: C.green, position: "relative", zIndex: 1 }}>{r.icon}</div>
                      </td>
                      <td style={{ paddingLeft: 8, padding: "9px 0 9px 8px", borderTop: i > 0 ? `1px solid rgba(42,52,65,.5)` : "none" }}>
                        <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{r.label}</div>
                        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>{r.sub}</div>
                      </td>
                      <td style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: C.green, whiteSpace: "nowrap", paddingRight: 8, borderTop: i > 0 ? `1px solid rgba(42,52,65,.5)` : "none" }}>{fmtGBP(r.gbp)}</td>
                      <td style={{ textAlign: "right", fontSize: 11, color: C.blue, whiteSpace: "nowrap", padding: "9px 0", borderTop: i > 0 ? `1px solid rgba(42,52,65,.5)` : "none" }}>{gbp2bdt(r.gbp, rate)}</td>
                    </tr>
                  ))}

                  <tr>
                    <td colSpan={4} style={{ padding: "10px 0 6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: 0.6 }}>
                        <span style={{ flex: 1, height: 1, background: C.border }} />
                        Variable / Recurring
                        <span style={{ flex: 1, height: 1, background: C.border }} />
                      </div>
                    </td>
                  </tr>

                  {variableRows.map((r, i) => {
                    const dotColor = r.dotClass === "variable" ? C.blue : C.amber;
                    return (
                      <tr key={i}>
                        <td style={{ width: 28, textAlign: "center", padding: "9px 0" }}>
                          <div style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${dotColor}`, background: "#0d1117", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 7, color: dotColor, position: "relative", zIndex: 1 }}>{r.icon}</div>
                        </td>
                        <td style={{ padding: "9px 0 9px 8px" }}>
                          <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{r.label}</div>
                          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>{r.sub}</div>
                        </td>
                        <td style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: C.green, whiteSpace: "nowrap", paddingRight: 8 }}>{fmtGBP(r.gbp)}</td>
                        <td style={{ textAlign: "right", fontSize: 11, color: C.blue, whiteSpace: "nowrap", padding: "9px 0" }}>{gbp2bdt(r.gbp, rate)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", gap: 14, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 11, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}><span style={{ color: C.green }}>●</span> Fixed</span>
              <span style={{ fontSize: 11, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}><span style={{ color: C.blue }}>◆</span> Variable</span>
              <span style={{ fontSize: 11, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}><span style={{ color: C.amber }}>◇</span> If applicable</span>
            </div>
          </div>

          <div style={{ background: "linear-gradient(135deg, rgba(0,200,150,.08), rgba(74,158,255,.06))", border: "1px solid rgba(0,200,150,.25)", borderRadius: 12, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>ESTIMATED TOTAL COST</div>
                <div style={{ fontSize: 11, color: C.textDim }}>{dur}-yr · {dep === 0 ? "No dependent" : `${dep} dependent${dep > 1 ? "s" : ""}`}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.green }}>{fmtGBP(grandTotal)}</div>
                <div style={{ fontSize: 13, color: C.blue, marginTop: 1 }}>{gbp2bdt(grandTotal, rate)}</div>
              </div>
            </div>
            <hr style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: "10px 0" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10 }}>
                <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 3 }}>FIXED COSTS</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.green }}>{fmtGBP(fixedTotal)}</div>
                <div style={{ fontSize: 11, color: C.blue }}>{gbp2bdt(fixedTotal, rate)}</div>
              </div>
              <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10 }}>
                <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 3 }}>TUITION + DEP</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.blue }}>{fmtGBP(variableTotal)}</div>
                <div style={{ fontSize: 11, color: C.blue }}>{gbp2bdt(variableTotal, rate)}</div>
              </div>
            </div>
            {tuitionRemaining > 0 && (
              <div style={{ marginTop: 10, background: "rgba(232,168,56,0.08)", border: "1px solid rgba(232,168,56,0.25)", borderRadius: 8, padding: "8px 10px", fontSize: 11, color: C.textMuted, lineHeight: 1.5 }}>
                ⚠️ <strong style={{ color: "#E8A838" }}>Remaining tuition not included above:</strong> {fmtGBP(tuitionRemaining)} ({gbp2bdt(tuitionRemaining, rate)}) — payable later during your course.
              </div>
            )}
            <div style={{ fontSize: 11, color: C.textMuted, textAlign: "center", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              💱 £1 =
              <input type="number" value={rate} onChange={e => setRate(parseFloat(e.target.value) || 153)} style={{ width: 52, background: "none", border: "none", borderBottom: `1px solid ${C.border}`, color: C.blue, fontSize: 11, textAlign: "center", padding: "0 2px", fontFamily: "inherit", outline: "none" }} />
              BDT
            </div>
          </div>
        </div>
      )}

      {panel === "track" && (
        <div>
          <div style={{ display: "flex", background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 3, gap: 3, marginBottom: 14 }}>
            {[["all", "🌐 All Journey", C.green], ["bd", "🇧🇩 Pre-Arrival", C.amber], ["uk", "🇬🇧 In UK", C.blue]].map(([id, lbl, color]) => (
              <button key={id} onClick={() => setPhase(id)} style={{
                flex: 1, padding: "8px 4px", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 600,
                cursor: "pointer", background: phase === id ? C.surface : "none",
                color: phase === id ? color : C.textMuted,
                boxShadow: phase === id ? "0 1px 4px rgba(0,0,0,.4)" : "none",
              }}>{lbl}</button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
            <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 8px" }}>
              <div style={{ fontSize: 9, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>Total Spent</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.green }}>{fmtGBP(totalSpent)}</div>
              <div style={{ fontSize: 10, color: C.textMuted, marginTop: 1 }}>{gbp2bdt(totalSpent, rate)}</div>
            </div>
            <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 8px" }}>
              <div style={{ fontSize: 9, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>🇧🇩 Pre-Arrival</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.amber }}>{fmtGBP(preSpent)}</div>
              <div style={{ fontSize: 10, color: C.textMuted, marginTop: 1 }}>{gbp2bdt(preSpent, rate)}</div>
            </div>
            <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 8px" }}>
              <div style={{ fontSize: 9, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>🇬🇧 In UK</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.blue }}>{fmtGBP(ukSpent)}</div>
              <div style={{ fontSize: 10, color: C.textMuted, marginTop: 1 }}>{gbp2bdt(ukSpent, rate)}</div>
            </div>
          </div>

          <div style={{ ...card, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Budget vs Estimated</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 11, color: C.textMuted }}>
              <span>Spent: {fmtGBP(totalSpent)}</span>
              <span>Budget: {fmtGBP(grandTotal)}</span>
            </div>
            <div style={{ height: 6, background: C.surface2, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${budgetPct}%`, background: barColor, borderRadius: 3, transition: "width 0.5s ease" }} />
            </div>
            <div style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}>{budgetPct.toFixed(1)}% used · {fmtGBP(remaining)} remaining</div>
          </div>

          <div style={{ ...card, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>By Category</div>
            {Object.keys(catTotals).length === 0 ? (
              <div style={{ fontSize: 12, color: C.textDim, textAlign: "center", padding: "8px 0" }}>No expenses yet</div>
            ) : (
              Object.entries(catTotals).sort((a, b) => b[1] - a[1]).map(([c, amt]) => {
                const meta = EXPENSE_CAT_META[c] || EXPENSE_CAT_META.other;
                const pct = (amt / maxCat * 100).toFixed(0);
                return (
                  <div key={c} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: meta.color, flexShrink: 0 }} />
                    <div style={{ fontSize: 12, color: C.textMuted, width: 70, flexShrink: 0 }}>{meta.icon} {c}</div>
                    <div style={{ flex: 1, height: 5, background: C.surface2, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: meta.color, borderRadius: 3, transition: "width 0.5s ease" }} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, width: 52, textAlign: "right", flexShrink: 0, color: meta.color }}>{fmtGBP(amt)}</div>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 12, paddingBottom: 2 }}>
            {[["all", "All"], ["visa", "🛂 Visa"], ["ielts", "📝 IELTS"], ["travel", "✈️ Travel"], ["tuition", "🎓 Tuition"], ["living", "🏠 Living"], ["food", "🍜 Food"], ["mobile", "📱 Mobile"], ["transport", "🚌 Transport"], ["health", "💊 Health"], ["other", "📦 Other"]].map(([id, lbl]) => (
              <div key={id} onClick={() => setCat(id)} style={{
                flex: "0 0 auto", padding: "5px 12px", background: cat === id ? C.greenDim : C.surface2,
                border: `1px solid ${cat === id ? C.green : C.border}`, borderRadius: 20, cursor: "pointer",
                fontSize: 11, fontWeight: 600, color: cat === id ? C.green : C.textMuted, whiteSpace: "nowrap",
              }}>{lbl}</div>
            ))}
          </div>

          <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>+ Log New Expense</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input value={expName} onChange={e => setExpName(e.target.value)} placeholder="Description (e.g. IELTS registration)" style={{ ...fInput, flex: 2 }} />
              <div style={{ position: "relative", flex: 1 }}>
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, fontWeight: 700, color: C.green, pointerEvents: "none" }}>£</span>
                <input type="number" step="0.01" value={expAmt} onChange={e => setExpAmt(e.target.value)} placeholder="0.00" style={{ width: "100%", background: "#0d1117", border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, padding: "9px 10px 9px 22px", fontFamily: "inherit", outline: "none" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <select value={expCat} onChange={e => setExpCat(e.target.value)} style={fInput}>
                <option value="visa">🛂 Visa</option>
                <option value="ielts">📝 IELTS</option>
                <option value="travel">✈️ Travel</option>
                <option value="tuition">🎓 Tuition</option>
                <option value="living">🏠 Living</option>
                <option value="food">🍜 Food</option>
                <option value="mobile">📱 Mobile</option>
                <option value="transport">🚌 Transport</option>
                <option value="health">💊 Health</option>
                <option value="other">📦 Other</option>
              </select>
              <select value={expPhase} onChange={e => setExpPhase(e.target.value)} style={fInput}>
                <option value="bd">🇧🇩 Pre-Arrival (BD)</option>
                <option value="uk">🇬🇧 In UK</option>
              </select>
              <button onClick={addExpense} style={{ background: C.green, color: "#000", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>Add</button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredExpenses.length === 0 ? (
              <div style={{ textAlign: "center", padding: "28px 16px", color: C.textMuted }}>
                <div style={{ fontSize: 38, marginBottom: 8 }}>💳</div>
                <p style={{ fontSize: 13, lineHeight: 1.5 }}>No expenses logged yet.<br />Track from your first IELTS payment<br />all the way through life in the UK.</p>
              </div>
            ) : (
              Object.entries(byMonth).map(([month, exps]) => (
                <div key={month}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: 0.6, padding: "6px 0 4px", marginTop: 4 }}>{formatMonth(month)}</div>
                  {exps.map(exp => {
                    const meta = EXPENSE_CAT_META[exp.cat] || EXPENSE_CAT_META.other;
                    return (
                      <div key={exp.id} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 12, padding: "11px 12px", display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0, background: meta.color + "22" }}>{meta.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: C.text }}>{exp.name}</div>
                          <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2, display: "flex", alignItems: "center", gap: 5 }}>
                            <span style={{ display: "inline-block", fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: exp.phase === "uk" ? "rgba(74,158,255,.15)" : "rgba(245,158,11,.15)", color: exp.phase === "uk" ? C.blue : C.amber }}>
                              {exp.phase === "uk" ? "🇬🇧 In UK" : "🇧🇩 Pre-Arrival"}
                            </span>
                            {exp.cat} · {exp.date}
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 800, color: C.green }}>{fmtGBP(exp.amt)}</div>
                          <div style={{ fontSize: 10, color: C.blue, marginTop: 1 }}>{gbp2bdt(exp.amt, rate)}</div>
                        </div>
                        <button onClick={() => deleteExpense(exp.id)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: 16, padding: 4, lineHeight: 1, flexShrink: 0 }}>×</button>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}


// ============================================================
// DATA: CAS & UKVI Preparation
// ============================================================
const CAS_QA = [
  {
    q: "Why did you choose this university?",
    bn: "কেন এই বিশ্ববিদ্যালয় বেছে নিলেন?",
    a: "I chose [University Name] because of its strong reputation in [your course], its industry partnerships, and the quality of research facilities. I also carefully reviewed the course modules, which align with my career goals in [your field].",
    tip: "💡 University-র specific বৈশিষ্ট্য উল্লেখ করুন — ranking, course content, lecturers। Generic উত্তর এড়িয়ে চলুন।"
  },
  {
    q: "Why did you choose this specific course?",
    bn: "কেন এই নির্দিষ্ট কোর্স বেছে নিলেন?",
    a: "My undergraduate background in [subject] gave me a strong foundation, and I want to specialise further in [course area]. This course covers [specific modules] which are directly relevant to my career plan of [goal].",
    tip: "💡 আপনার academic background-এর সাথে কোর্সের সংযোগ দেখান। Career goal স্পষ্টভাবে বলুন।"
  },
  {
    q: "How will you finance your studies?",
    bn: "পড়াশোনার খরচ কীভাবে চালাবেন?",
    a: "My studies will be funded by my family. My father/sponsor is a [profession] and has been saving specifically for this purpose. I have maintained the required funds in my bank account for more than 28 consecutive days as required by UKVI.",
    tip: "💡 Bank statement-এর সাথে মিলিয়ে বলুন। টাকার source স্পষ্ট করুন — চাকরি, ব্যবসা বা সম্পত্তি।"
  },
  {
    q: "What are your plans after completing the course?",
    bn: "কোর্স শেষে আপনার পরিকল্পনা কী?",
    a: "After completing my degree, I plan to return to Bangladesh and apply the skills and knowledge I have gained. I aim to work in [sector] where there is growing demand for [skill]. I have family and community ties that will bring me back.",
    tip: "💡 UK-তে থেকে যাওয়ার intention নেই — এটা স্পষ্ট করুন। Bangladesh-এ ফিরে আসার কারণ দিন।"
  },
  {
    q: "Do you have any family members in the UK?",
    bn: "UK-তে আপনার কোনো পরিবার আছে?",
    a: "No, I do not have any immediate family members in the UK. My parents and siblings all live in Bangladesh. My purpose of travelling is purely for education.",
    tip: "💡 সত্য কথা বলুন। পরিবার থাকলে সেটা বলুন তবে সম্পর্ক এবং address উল্লেখ করুন।"
  },
  {
    q: "Have you visited the UK before?",
    bn: "আগে কি UK ভ্রমণ করেছেন?",
    a: "No, this will be my first visit to the UK. I have, however, visited [other countries if applicable] and have always returned to Bangladesh as planned.",
    tip: "💡 যদি আগে গিয়ে থাকেন — সঠিক তারিখ ও কারণ বলুন। যদি না গিয়ে থাকেন — সততার সাথে বলুন।"
  },
  {
    q: "What is your English language proficiency?",
    bn: "আপনার ইংরেজি দক্ষতা কেমন?",
    a: "I have an IELTS Academic score of [your score], with individual band scores of [Reading/Writing/Listening/Speaking]. I am confident in academic and conversational English and have been communicating in English throughout my academic career.",
    tip: "💡 আপনার actual IELTS score মুখস্থ রাখুন। Specific band scores জানা থাকা জরুরি।"
  },
  {
    q: "Who is your CAS sponsor?",
    bn: "আপনার CAS sponsor কে?",
    a: "My CAS sponsor is [University Name], which is a UKVI-licensed sponsor. My CAS number is [your CAS number], and it was issued on [date]. The course start date is [date].",
    tip: "💡 CAS letter সাথে রাখুন। CAS number, issue date, course start date মুখস্থ রাখুন।"
  },
];

const UKVI_QA = [
  {
    q: "What is the purpose of your visit to the UK?",
    bn: "UK ভ্রমণের উদ্দেশ্য কী?",
    a: "I am travelling to the UK to pursue my [undergraduate/postgraduate] studies at [University Name]. I have been accepted onto the [Course Name] programme commencing [Month Year].",
    tip: "💡 সংক্ষিপ্ত ও স্পষ্ট উত্তর দিন। University নাম ও course নাম সঠিকভাবে বলুন।"
  },
  {
    q: "How long do you intend to stay in the UK?",
    bn: "UK-তে কতদিন থাকার পরিকল্পনা?",
    a: "I intend to stay for the duration of my course, which is [1/2/3] year(s). My visa is valid until [date], and I plan to return to Bangladesh upon completing my studies.",
    tip: "💡 Visa validity-র বেশি থাকার কথা বলবেন না। Course duration স্পষ্ট করুন।"
  },
  {
    q: "Where will you be living in the UK?",
    bn: "UK-তে কোথায় থাকবেন?",
    a: "I will be staying at [university accommodation name / private address]. I have already confirmed my accommodation booking and have the confirmation letter with me.",
    tip: "💡 Accommodation letter সাথে রাখুন। Address মুখস্থ রাখুন।"
  },
  {
    q: "How much money do you have to support yourself?",
    bn: "নিজেকে সাপোর্ট করার জন্য কত টাকা আছে?",
    a: "I have sufficient funds to cover my tuition fees and living expenses. My bank statement shows I have maintained [amount] for the required 28-day period. My sponsor is my [father/mother] who supports my education.",
    tip: "💡 Bank statement-এর exact amount বলুন। UKVI requirement হলো tuition + £1,023-£1,334/month living cost।"
  },
  {
    q: "Have you ever been refused a UK visa before?",
    bn: "আগে কি UK visa refusal হয়েছিল?",
    a: "Yes/No. [If yes: I was refused in [year] due to [reason]. Since then, I have [addressed the issue — e.g., improved finances, got IELTS, stronger ties to home country] and I believe my application is now much stronger.]",
    tip: "💡 সত্য বলুন — মিথ্যা বললে permanent ban হতে পারে। Refusal-এর কারণ ও সমাধান explain করুন।"
  },
  {
    q: "Do you intend to work while studying?",
    bn: "পড়াশোনার পাশাপাশি কাজ করার পরিকল্পনা আছে?",
    a: "Yes, my Student visa permits me to work up to 20 hours per week during term time and full-time during holidays. However, my primary purpose is studying, and any part-time work would be supplementary only.",
    tip: "💡 Student visa-র 20 hour rule জানুন। Main purpose পড়াশোনা — এটা emphasise করুন।"
  },
  {
    q: "What ties do you have to Bangladesh?",
    bn: "Bangladesh-এর সাথে আপনার কী সম্পর্ক আছে?",
    a: "I have strong ties to Bangladesh. My parents and family live there. My father runs a [business/works as] in Bangladesh, and I am expected to return and contribute to the family. I also have property interests / career opportunities waiting for me there.",
    tip: "💡 এটাই সবচেয়ে গুরুত্বপূর্ণ প্রশ্ন। Strong ties prove করুন — family, property, job prospect, business।"
  },
  {
    q: "Why not study in Bangladesh instead?",
    bn: "Bangladesh-এ না পড়ে UK-তে কেন?",
    a: "While Bangladesh has good universities, the specific programme I am interested in — [course name] — with the level of research, industry exposure, and international recognition offered by [University Name] is not available at the same standard in Bangladesh. This qualification will significantly enhance my career prospects upon return.",
    tip: "💡 UK education-এর specific advantage বলুন — course quality, research, international recognition।"
  },
];

const REFUSAL_REASONS = [
  {
    code: "V4.2(a)",
    title: "Insufficient funds / Bank statement issues",
    bn: "অপর্যাপ্ত ব্যাংক ব্যালেন্স",
    desc: "UKVI was not satisfied that you have sufficient funds to cover tuition and living costs, OR funds were not held for the required 28 consecutive days.",
    fix: "✅ সমাধান: Bank statement-এ required amount 28 দিন ধরে রাখুন। Fund-এর source document দিন (salary slip, business income, property documents)।"
  },
  {
    code: "V4.2(e)",
    title: "Genuine Student test failed",
    bn: "Genuine Student প্রমাণে ব্যর্থ",
    desc: "The Entry Clearance Officer was not convinced that your primary intention is to study, or that you will leave the UK at the end of your studies.",
    fix: "✅ সমাধান: Strong ties to Bangladesh prove করুন। Future career plan লিখুন। Personal statement শক্তিশালী করুন।"
  },
  {
    code: "V4.2(b)",
    title: "Course / CAS issues",
    bn: "CAS বা কোর্স সমস্যা",
    desc: "The CAS details do not match your application, or the course does not meet the required academic progression.",
    fix: "✅ সমাধান: CAS number, course name, start date verify করুন। Academic progression logical কিনা দেখুন।"
  },
  {
    code: "V4.2(c)",
    title: "English language not satisfied",
    bn: "ইংরেজি দক্ষতা অপর্যাপ্ত",
    desc: "Your IELTS or English qualification was not accepted, expired, or the score was below the university/UKVI requirement.",
    fix: "✅ সমাধান: Valid IELTS score নিশ্চিত করুন (2 বছরের মধ্যে)। Required band scores check করুন।"
  },
  {
    code: "V4.2(f)",
    title: "Immigration history concerns",
    bn: "আগের ভিসা রেকর্ড সমস্যা",
    desc: "Previous overstay, refusal, or immigration violation was found in your travel history.",
    fix: "✅ সমাধান: সব previous visa history সৎভাবে declare করুন। Immigration lawyer-এর সাহায্য নিন।"
  },
];

// ============================================================
// COMPONENT: Prep Tab — CAS & UKVI Preparation
// ============================================================
function PrepTab() {
  const [section, setSection] = useState("cas");
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

  const C = { green: "#3DB88B", blue: "#5B8DEF", amber: "#E8A838", red: "#E85B5B" };

  const SectionBtn = ({ id, icon, label }) => (
    <button onClick={() => setSection(id)} style={{
      flex: 1, padding: "9px 6px", border: "none", borderRadius: 10, cursor: "pointer",
      background: section === id ? "rgba(61,184,139,0.12)" : "rgba(255,255,255,0.04)",
      borderBottom: section === id ? "2px solid #3DB88B" : "2px solid transparent",
      color: section === id ? C.green : "rgba(255,255,255,0.4)",
      fontSize: 11, fontWeight: section === id ? 800 : 500,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
    }}>
      <span style={{ fontSize: 16 }}>{icon}</span>{label}
    </button>
  );

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
            <div style={{ fontSize: 13, fontWeight: 700, color: "#EEF2F7", marginBottom: 2 }}>{item.q}</div>
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
            <div style={{ fontSize: 15, fontWeight: 800, color: "#EEF2F7", marginBottom: 6 }}>📋 CAS Interview কী?</div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>
              CAS (Confirmation of Acceptance for Studies) interview সাধারণত হয় না — এটা একটা document/number। তবে কিছু ক্ষেত্রে university বা UKVI আপনাকে <strong style={{ color: "#5B8DEF" }}>Genuine Student Interview</strong>-এর জন্য ডাকতে পারে। এই interview-এ তারা verify করে যে আপনি সত্যিই পড়তে আসছেন।
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
              {[["🎯 কে নেয়?", "UKVI Entry Clearance Officer"], ["📍 কোথায়?", "VFS/UKVCAS Centre, Dhaka"], ["⏱️ কতক্ষণ?", "১০-২০ মিনিট"], ["📅 কখন?", "Visa application-এর পর"]].map(([label, val], i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#EEF2F7" }}>{val}</div>
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
          {CAS_QA.map((item, i) => <QACard key={i} item={item} i={i} accentColor={C.blue} />)}
        </div>
      )}

      {section === "ukvi" && (
        <div>
          <div style={{ background: "rgba(61,184,139,0.08)", border: "1px solid rgba(61,184,139,0.25)", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#EEF2F7", marginBottom: 6 }}>🎤 UKVI Interview কী?</div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>
              UK Visas and Immigration (UKVI) কিছু applicant-কে <strong style={{ color: "#3DB88B" }}>Credibility Interview</strong>-এর জন্য ডাকে। এটা mandatory নয় — শুধু যাদের application-এ কোনো concern দেখা যায় তাদের ডাকা হয়। Interview-এ তারা জানতে চায় আপনি সত্যিকারের student কিনা।
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
              {[["🎯 কে নেয়?", "UKVI ECO (Entry Clearance Officer)"], ["📍 কোথায়?", "Phone বা VFS Centre"], ["⏱️ কতক্ষণ?", "১৫-৩০ মিনিট"], ["📅 কখন?", "যেকোনো সময় visa process-এ"]].map(([label, val], i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#EEF2F7" }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "rgba(232,91,91,0.07)", border: "1px solid rgba(232,91,91,0.2)", borderRadius: 12, padding: "11px 14px", marginBottom: 14, fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
            🔴 <strong style={{ color: "#E85B5B" }}>সতর্কতা:</strong> UKVI interview-এ মিথ্যা বললে permanent ban হতে পারে। সব সময় সত্য কথা বলুন, এমনকি যদি তা আপনার বিরুদ্ধেও যায়।
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.28)", marginBottom: 10 }}>
            Common Questions — tap to see answers
          </div>
          {UKVI_QA.map((item, i) => <QACard key={i} item={item} i={i} accentColor={C.green} />)}
        </div>
      )}

      {section === "refusal" && (
        <div>
          <div style={{ background: "rgba(232,91,91,0.07)", border: "1px solid rgba(232,91,91,0.25)", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#EEF2F7", marginBottom: 6 }}>❌ Visa Refusal — কী করবেন?</div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>
              Refusal letter-এ একটি <strong style={{ color: "#E85B5B" }}>refusal code</strong> থাকে যা কারণ নির্দেশ করে। এই code বুঝে পরবর্তী application শক্তিশালী করুন। নিচে সবচেয়ে সাধারণ refusal codes এবং সমাধান দেওয়া হলো।
            </div>
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.28)", marginBottom: 10 }}>Common Refusal Reasons</div>
          {REFUSAL_REASONS.map((r, i) => (
            <div key={i} style={{ marginBottom: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#E85B5B", background: "rgba(232,91,91,0.15)", padding: "2px 8px", borderRadius: 6, fontFamily: "monospace" }}>{r.code}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#EEF2F7" }}>{r.title}</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontStyle: "italic", marginBottom: 7 }}>{r.bn}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, marginBottom: 8 }}>{r.desc}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5, padding: "8px 10px", background: "rgba(61,184,139,0.07)", border: "1px solid rgba(61,184,139,0.2)", borderRadius: 8 }}>{r.fix}</div>
            </div>
          ))}

          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.28)", marginBottom: 10 }}>📎 আপনার Refusal Letters / Documents</div>

            <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileUpload} style={{ display: "none" }} />
            <button onClick={() => fileInputRef.current?.click()} style={{ width: "100%", padding: "13px", background: "rgba(91,141,239,0.08)", border: "2px dashed rgba(91,141,239,0.4)", borderRadius: 12, color: "#5B8DEF", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>
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
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#EEF2F7", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                      <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>{f.size} · Uploaded {f.date}</div>
                    </div>
                    <button onClick={() => setViewingPdf(viewingPdf === f.id ? null : f.id)} style={{ background: viewingPdf === f.id ? "rgba(61,184,139,0.15)" : "rgba(255,255,255,0.06)", border: "1px solid " + (viewingPdf === f.id ? "#3DB88B55" : "rgba(255,255,255,0.12)"), borderRadius: 7, color: viewingPdf === f.id ? "#3DB88B" : "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, cursor: "pointer", padding: "5px 10px", flexShrink: 0 }}>
                      {viewingPdf === f.id ? "Close" : "View"}
                    </button>
                    <button onClick={() => deletePdf(f.id)} style={{ background: "none", border: "none", color: "rgba(232,91,91,0.5)", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "2px 4px", flexShrink: 0 }}>×</button>
                  </div>

                  {viewingPdf === f.id && pdfData[f.id] && (
                    <div style={{ marginBottom: 10, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(91,141,239,0.3)" }}>
                      <div style={{ background: "rgba(91,141,239,0.08)", padding: "8px 14px", fontSize: 12, color: "#5B8DEF", fontWeight: 700, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>📄 {f.name}</span>
                        <a href={pdfData[f.id]} download={f.name} style={{ fontSize: 11, color: "#5B8DEF", textDecoration: "none", background: "rgba(91,141,239,0.15)", padding: "3px 10px", borderRadius: 6 }}>⬇ Download</a>
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

// ============================================================
// COMPONENT: Packing Planner Tab
// ============================================================
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
  const weightColor = weightPct < 70 ? "#3DB88B" : weightPct < 95 ? "#E8A838" : "#E85B5B";

  const C = { green: "#3DB88B", blue: "#5B8DEF", amber: "#E8A838", red: "#E85B5B", surface2: "#1c2330", border: "#2a3441", textMuted: "#7d8590" };

  return (
    <div>
      <div style={{ background: "rgba(91,141,239,0.08)", border: "1px solid rgba(91,141,239,0.25)", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#EEF2F7", marginBottom: 6 }}>🧳 Packing Planner</div>
        <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
          Plan and track everything you need to pack for the UK. Check off items as you pack them, and monitor your luggage weight against the airline limit.
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 0.5 }}>Packing Progress</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: "#3DB88B" }}>{checkedCount} / {totalItems} items</span>
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 6, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${overallPct}%`, background: "linear-gradient(90deg,#534AB7,#3DB88B)", borderRadius: 6, transition: "width 0.4s" }} />
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
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#EEF2F7" }}>{cat.name}</div>
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
                        <span style={{ fontSize: 13, color: checked[item.id] ? "rgba(255,255,255,0.35)" : "#EEF2F7", textDecoration: checked[item.id] ? "line-through" : "none" }}>{item.name}</span>
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
  const [expandedTask,  setExpandedTask]  = useState(null);
  const [expandedDoc,   setExpandedDoc]   = useState(null);
  const [showPackingFromSettings, setShowPackingFromSettings] = useState(false);

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

  const statusId = profile.statusId || 0;

  // Packing Planner visibility:
  // - stage 4 (Visa applied) and stage 5 (Visa approved): visible in nav + triggers
  // - stage 6 (Already in UK) and earlier stages: hidden from nav automatically, but reachable from Settings
  const packingAutoVisible = statusId === 4 || statusId === 5;

  // ── Packing Planner via Settings (always reachable) ────────
  if (showPackingFromSettings) {
    return (
      <div style={{ minHeight: "100vh", background: "#08111C", fontFamily: "Arial, sans-serif", color: "#EEF2F7", paddingBottom: 40 }}>
        <div style={{ position: "sticky", top: 0, background: "#08111C", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 10, zIndex: 10 }}>
          <button onClick={() => setShowPackingFromSettings(false)} style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 8, color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 14, padding: "8px 12px" }}>← Back</button>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>🧳 Packing Planner</h2>
        </div>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 20px" }}>
          <PackingTab />
        </div>
      </div>
    );
  }

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

          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>⚠️</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#E85B5B", marginBottom: 6 }}>You're skipping ahead!</div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
              You're jumping to <strong style={{ color: "#EEF2F7" }}>{toStage.emoji} {toStage.label}</strong> but these priority tasks are still incomplete:
            </div>
          </div>

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

          <div style={{ padding: "9px 12px", background: "rgba(232,168,56,0.08)", border: "1px solid rgba(232,168,56,0.22)", borderRadius: 10, marginBottom: 18, fontSize: 11.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
            🕒 <strong style={{ color: "#E8A838" }}>Recommendation:</strong> Go back and complete these tasks first. Skipping may cause issues in your UK application journey.
          </div>

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

          {/* Packing Planner — always reachable from Settings */}
          <button onClick={() => { setShowSettings(false); setShowPackingFromSettings(true); }} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", marginBottom: 12,
            background: "rgba(91,141,239,0.08)", border: "1px solid rgba(91,141,239,0.25)", borderRadius: 12,
            color: "#5B8DEF", fontSize: 14, fontWeight: 700, cursor: "pointer", textAlign: "left",
          }}>
            <span style={{ fontSize: 18 }}>🧳</span> Open Packing Planner
          </button>

          <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "12px 0 24px" }} />
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
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: "linear-gradient(135deg,#c0398a,#7b3fb5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: "#fff", letterSpacing: 0.3 }}>
              GB
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#3DB88B", whiteSpace: "nowrap" }}>SettleUK</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 500, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                Hello, {profile.name}! {arrivalDays !== null && (arrivalDays > 0 ? `· ${arrivalDays} days to arrival` : "· You're in the UK now! 🇬🇧")}
              </div>
            </div>
            <span style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", padding: "5px 13px", background: "rgba(61,184,139,0.1)", border: "1px solid rgba(61,184,139,0.4)", borderRadius: 20, fontSize: 11.5, fontWeight: 700, color: "#3DB88B", whiteSpace: "nowrap" }}>
              {sg.name}
            </span>
            <button onClick={() => { setEditProfile({ name: profile.name, arrival: profile.arrival }); setShowSettings(true); }} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: 15, width: 34, height: 34, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>⚙️</button>
          </div>
          {/* Nav tabs */}
          <div style={{ display: "flex", overflowX: "auto", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {[["home","🏠","Home"],["tasks","✅","Tasks"],["costs","💷","Costs"],["docs","📄","Docs"],["prep","📚","CAS&UKVI"], ...(packingAutoVisible ? [["packing","🧳","Packing"]] : []), ["guides","📖","Guides"]].map(([id,em,lbl]) => (
              <button key={id} onClick={() => setTab(id)} style={{ flex: "none", padding: "10px 14px", background: "transparent", border: "none", borderBottom: tab === id ? "2px solid #3DB88B" : "2px solid transparent", color: tab === id ? "#3DB88B" : "rgba(255,255,255,0.38)", fontSize: 12.5, fontWeight: tab === id ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 5 }}>
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
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Welcome back, {profile.name} 👋</div>
              <StatusDropdown statusId={statusId} onChange={changeStatus} />
            </div>

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

            <div style={{ background: "rgba(61,184,139,0.06)", border: "1px solid rgba(61,184,139,0.16)", borderRadius: 12, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>😊</span>
              <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.62)", lineHeight: 1.5 }}>{sg.emotion}</span>
            </div>

            <NextBestAction sg={sg} onStart={() => setTab("tasks")} />

            {/* Priority Packing banner — Visa Approved stage only */}
            {statusId === 5 && (
              <div onClick={() => setTab("packing")} style={{
                marginBottom: 16, padding: "14px 16px", borderRadius: 14, cursor: "pointer",
                background: "rgba(232,168,56,0.1)", border: "1.5px solid rgba(232,168,56,0.4)",
                boxShadow: "0 0 0 4px rgba(232,168,56,0.08)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.8, color: "#E8A838" }}>⚡ Priority Action</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 24 }}>🧳</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 900, color: "#EEF2F7" }}>Complete Your Packing List</div>
                    <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>You're flying soon! Check your luggage weight limit.</div>
                  </div>
                </div>
                <button style={{ width: "100%", padding: "9px 0", background: "#E8A838", border: "none", borderRadius: 10, color: "#08111C", fontSize: 13.5, fontWeight: 800, cursor: "pointer" }}>
                  Open Packing Planner →
                </button>
              </div>
            )}

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

            <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.28)", margin: "18px 0 10px" }}>Quick Actions</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <QuickCard icon="📄" title="Documents" sub={`${docsReadyCount} of ${DOCS.length} ready`}       pct={docPct}  onClick={() => setTab("docs")} />
              <QuickCard icon="✅" title="Tasks"     sub={`${completedTasksCount} of ${sg.tasks.length} done`} pct={taskPct} onClick={() => setTab("tasks")} />
              <QuickCard icon="💷" title="Cost Calculator" sub="Plan your budget" onClick={() => setTab("costs")} />
              <QuickCard icon="📚" title="CAS & UKVI Prep" sub="Interview Q&A guide" onClick={() => setTab("prep")} />
              <QuickCard icon="🏦" title="Banking guide" sub="Open Monzo"       onClick={() => setTab("guides")} />
              <QuickCard icon="🏥" title="NHS guide"     sub="Register with GP" onClick={() => setTab("guides")} />
            </div>
          </div>
        )}

        {/* ── COSTS TAB ── */}
        {tab === "costs" && <CostsTab />}

        {/* ── TASKS TAB ── */}
        {tab === "tasks" && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 19, fontWeight: 800 }}>{sg.name} tasks</h2>
            <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "rgba(255,255,255,0.38)" }}>{completedTasksCount} of {sg.tasks.length} completed · {sg.deadline}</p>

            {/* Unlock Packing Planner card — Visa Applied stage only */}
            {statusId === 4 && (
              <div onClick={() => setTab("packing")} style={{
                marginBottom: 14, padding: "14px 16px", borderRadius: 14, cursor: "pointer",
                background: "rgba(91,141,239,0.08)", border: "1px solid rgba(91,141,239,0.3)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 22 }}>🧳</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#5B8DEF" }}>Start Your Packing Planner</div>
                    <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>Visa submitted! Time to plan what to pack for UK.</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#5B8DEF", background: "rgba(91,141,239,0.15)", padding: "3px 10px", borderRadius: 20 }}>UNLOCK NOW</span>
                  <span style={{ fontSize: 13, color: "#5B8DEF", fontWeight: 700 }}>Open Packing Planner →</span>
                </div>
              </div>
            )}

            {sg.tasks.map(task => {
              const isExpanded = expandedTask === task.id;
              return (
                <div key={task.id} style={{ marginBottom: 7 }}>
                  <div style={{ display: "flex", gap: 12, padding: "13px 14px", background: taskDone[task.id] ? "rgba(61,184,139,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${taskDone[task.id] ? "#3DB88B44" : "rgba(255,255,255,0.06)"}`, borderRadius: 12, alignItems: "flex-start" }}>
                    <div onClick={() => toggleTask(task.id)} style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 2, cursor: "pointer", border: `2px solid ${taskDone[task.id] ? "#3DB88B" : "rgba(255,255,255,0.2)"}`, background: taskDone[task.id] ? "#3DB88B" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                      {taskDone[task.id] && "✓"}
                    </div>
                    <div onClick={() => toggleTask(task.id)} style={{ flex: 1, cursor: "pointer" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13.5, fontWeight: 700, textDecoration: taskDone[task.id] ? "line-through" : "none", color: taskDone[task.id] ? "rgba(255,255,255,0.28)" : "#EEF2F7" }}>{task.text}</span>
                        {task.priority    && !taskDone[task.id] && <span style={{ fontSize: 9.5, fontWeight: 700, color: "#E8A838", background: "#E8A83820", padding: "2px 7px", borderRadius: 8 }}>PRIORITY</span>}
                        {task.autoAdvance && !taskDone[task.id] && <span style={{ fontSize: 9.5, fontWeight: 700, color: "#5B8DEF", background: "rgba(91,141,239,0.15)", padding: "2px 7px", borderRadius: 8 }}>AUTO-ADVANCE</span>}
                      </div>
                    </div>
                    {task.desc && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setExpandedTask(isExpanded ? null : task.id); }}
                        style={{
                          flexShrink: 0, width: 24, height: 24, borderRadius: "50%",
                          background: isExpanded ? "rgba(91,141,239,0.2)" : "rgba(255,255,255,0.06)",
                          border: `1px solid ${isExpanded ? "#5B8DEF" : "rgba(255,255,255,0.12)"}`,
                          color: isExpanded ? "#5B8DEF" : "rgba(255,255,255,0.4)",
                          fontSize: 12, fontWeight: 700, cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        ℹ️
                      </button>
                    )}
                  </div>
                  {isExpanded && task.desc && (
                    <InfoExpand desc={task.desc} link={task.link} accent="#5B8DEF" />
                  )}
                </div>
              );
            })}
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
            <div>
              {DOCS.map(doc => {
                const isExpanded = expandedDoc === doc.id;
                return (
                  <div key={doc.id} style={{ marginBottom: 8 }}>
                    <div style={{ padding: "12px 14px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, background: docChecked[doc.id] ? "rgba(61,184,139,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${docChecked[doc.id] ? "#3DB88B55" : "rgba(255,255,255,0.07)"}` }}>
                      <span onClick={() => toggleDoc(doc.id)} style={{ fontSize: 22, cursor: "pointer", flexShrink: 0 }}>{doc.icon}</span>
                      <div onClick={() => toggleDoc(doc.id)} style={{ flex: 1, cursor: "pointer", minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: docChecked[doc.id] ? "rgba(255,255,255,0.35)" : "#EEF2F7", textDecoration: docChecked[doc.id] ? "line-through" : "none" }}>{doc.name}</div>
                        <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.28)", marginTop: 1 }}>{doc.hint}</div>
                      </div>
                      {doc.desc && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setExpandedDoc(isExpanded ? null : doc.id); }}
                          style={{
                            flexShrink: 0, width: 24, height: 24, borderRadius: "50%",
                            background: isExpanded ? "rgba(91,141,239,0.2)" : "rgba(255,255,255,0.06)",
                            border: `1px solid ${isExpanded ? "#5B8DEF" : "rgba(255,255,255,0.12)"}`,
                            color: isExpanded ? "#5B8DEF" : "rgba(255,255,255,0.4)",
                            fontSize: 12, fontWeight: 700, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >
                          ℹ️
                        </button>
                      )}
                      <div onClick={() => toggleDoc(doc.id)} style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, cursor: "pointer", border: `2px solid ${docChecked[doc.id] ? "#3DB88B" : "rgba(255,255,255,0.2)"}`, background: docChecked[doc.id] ? "#3DB88B" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>
                        {docChecked[doc.id] && "✓"}
                      </div>
                    </div>
                    {isExpanded && doc.desc && (
                      <InfoExpand desc={doc.desc} link={doc.link} accent="#5B8DEF" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PREP TAB ── */}
        {tab === "prep" && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 19, fontWeight: 800 }}>📚 CAS & UKVI Preparation</h2>
            <p style={{ margin: "0 0 16px", fontSize: 12.5, color: "rgba(255,255,255,0.38)" }}>Interview guide, sample Q&A, and refusal letter analysis</p>
            <PrepTab />
          </div>
        )}

        {/* ── PACKING TAB ── */}
        {tab === "packing" && packingAutoVisible && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 19, fontWeight: 800 }}>🧳 Packing Planner</h2>
            <p style={{ margin: "0 0 16px", fontSize: 12.5, color: "rgba(255,255,255,0.38)" }}>Plan and track your luggage for the UK</p>
            <PackingTab />
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
        {[["home","🏠","Home"],["tasks","✅","Tasks"],["costs","💷","Costs"],["docs","📄","Docs"],["prep","📚","Prep"], ...(packingAutoVisible ? [["packing","🧳","Packing"]] : []), ["guides","📖","Guides"]].map(([id,em,lbl]) => (
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
