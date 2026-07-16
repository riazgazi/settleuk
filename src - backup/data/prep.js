// CAS interview & UKVI prep data, used by PrepTab

const CAS_QA = [
  {
    q: "Why did you choose this university?",
    cat: "University",
    bn: "কেন এই বিশ্ববিদ্যালয় বেছে নিলেন?",
    a: "I chose [University Name] because of its strong reputation in [your course], its industry partnerships, and the quality of research facilities. I also carefully reviewed the course modules, which align with my career goals in [your field].",
    tip: "💡 University-র specific বৈশিষ্ট্য উল্লেখ করুন — ranking, course content, lecturers। Generic উত্তর এড়িয়ে চলুন।"
  },
  {
    q: "Why did you choose this specific course?",
    cat: "Course Module",
    bn: "কেন এই নির্দিষ্ট কোর্স বেছে নিলেন?",
    a: "My undergraduate background in [subject] gave me a strong foundation, and I want to specialise further in [course area]. This course covers [specific modules] which are directly relevant to my career plan of [goal].",
    tip: "💡 আপনার academic background-এর সাথে কোর্সের সংযোগ দেখান। Career goal স্পষ্টভাবে বলুন।"
  },
  {
    q: "How will you finance your studies?",
    cat: "Financial Sponsorship",
    bn: "পড়াশোনার খরচ কীভাবে চালাবেন?",
    a: "My studies will be funded by my family. My father/sponsor is a [profession] and has been saving specifically for this purpose. I have maintained the required funds in my bank account for more than 28 consecutive days as required by UKVI.",
    tip: "💡 Bank statement-এর সাথে মিলিয়ে বলুন। টাকার source স্পষ্ট করুন — চাকরি, ব্যবসা বা সম্পত্তি।"
  },
  {
    q: "What are your plans after completing the course?",
    cat: "Future Plans",
    bn: "কোর্স শেষে আপনার পরিকল্পনা কী?",
    a: "After completing my degree, I plan to return to Bangladesh and apply the skills and knowledge I have gained. I aim to work in [sector] where there is growing demand for [skill]. I have family and community ties that will bring me back.",
    tip: "💡 UK-তে থেকে যাওয়ার intention নেই — এটা স্পষ্ট করুন। Bangladesh-এ ফিরে আসার কারণ দিন।"
  },
  {
    q: "Do you have any family members in the UK?",
    cat: "Family",
    bn: "UK-তে আপনার কোনো পরিবার আছে?",
    a: "No, I do not have any immediate family members in the UK. My parents and siblings all live in Bangladesh. My purpose of travelling is purely for education.",
    tip: "💡 সত্য কথা বলুন। পরিবার থাকলে সেটা বলুন তবে সম্পর্ক এবং address উল্লেখ করুন।"
  },
  {
    q: "Have you visited the UK before?",
    cat: "Personal Information",
    bn: "আগে কি UK ভ্রমণ করেছেন?",
    a: "No, this will be my first visit to the UK. I have, however, visited [other countries if applicable] and have always returned to Bangladesh as planned.",
    tip: "💡 যদি আগে গিয়ে থাকেন — সঠিক তারিখ ও কারণ বলুন। যদি না গিয়ে থাকেন — সততার সাথে বলুন।"
  },
  {
    q: "What is your English language proficiency?",
    cat: "Personal Information",
    bn: "আপনার ইংরেজি দক্ষতা কেমন?",
    a: "I have an IELTS Academic score of [your score], with individual band scores of [Reading/Writing/Listening/Speaking]. I am confident in academic and conversational English and have been communicating in English throughout my academic career.",
    tip: "💡 আপনার actual IELTS score মুখস্থ রাখুন। Specific band scores জানা থাকা জরুরি।"
  },
  {
    q: "Who is your CAS sponsor?",
    cat: "University",
    bn: "আপনার CAS sponsor কে?",
    a: "My CAS sponsor is [University Name], which is a UKVI-licensed sponsor. My CAS number is [your CAS number], and it was issued on [date]. The course start date is [date].",
    tip: "💡 CAS letter সাথে রাখুন। CAS number, issue date, course start date মুখস্থ রাখুন।"
  },
  {
    q: "What facilities does this institute offer that attracted you?",
    cat: "University",
    bn: "এই প্রতিষ্ঠানের কোন সুবিধা আপনাকে আকর্ষণ করেছে?",
    a: "[University Name] offers modern libraries open 24/7, advanced computing facilities, dedicated research support, and well-equipped study spaces. It is also ranked [ranking detail] for [skills development / facilities / student support], which gave me confidence in the quality of education I will receive.",
    tip: "💡 অন্তত ৩টি specific facility + একটি official ranking/স্বীকৃতি উল্লেখ করুন — শুধু 'good environment' বললে চলবে না।"
  },
  {
    q: "Did you consider studying at any other institutes? If so, which ones?",
    cat: "University",
    bn: "আর কোনো প্রতিষ্ঠান বিবেচনা করেছিলেন?",
    a: "Yes, I also researched [Other University 1] and [Other University 2]. However, when I compared the course modules and rankings, [University Name] offered a stronger focus on [your specific area, e.g. digital management/research], which directly aligns with my career goal of becoming a [job title].",
    tip: "💡 'না, এটাই দেখেছি' বললে আগ্রহ কম মনে হবে। তাই অন্য ২টি university-র নাম বলে comparison করুন কেন এটাই সেরা।"
  },
  {
    q: "Do you know the address/location of your university?",
    cat: "University",
    bn: "আপনার ইউনিভার্সিটির লোকেশন জানেন?",
    a: "Yes, [University Name] is located at [campus address/city]. The campus is well-connected, with the city centre/station about [X] minutes away, which makes travel and daily life convenient.",
    tip: "💡 Campus address ও nearest station/city মুখস্থ রাখুন।"
  },
  {
    q: "Why did you choose your particular area of study?",
    cat: "Course Module",
    bn: "এই নির্দিষ্ট বিষয় কেন বেছে নিলেন?",
    a: "I have chosen this area because of the growing demand for professionals with knowledge in [field]. My academic background in [previous subject] gave me a strong foundation, and through [experience/work], I realised how important this field is for modern organisations.",
    tip: "💡 Personal motivation + market demand দুটোই উল্লেখ করুন।"
  },
  {
    q: "Tell me about your course modules and how the course is structured.",
    cat: "Course Module",
    bn: "কোর্সের মডিউল ও স্ট্রাকচার সম্পর্কে বলুন।",
    a: "My course is structured into [taught modules / research stages]. The core modules include [Module 1], [Module 2], and [Module 3], each carrying [credit] credits. [If applicable: There is also a major independent research project worth [credit] credits.] Together these build my knowledge in [subject] and develop my [skills, e.g. research and analytical skills].",
    tip: "💡 কমপক্ষে ৩টা মডিউলের নাম ও credit সংখ্যা মুখস্থ রাখুন। University website থেকে দেখে নিন।"
  },
  {
    q: "How is your course assessed?",
    cat: "Course Module",
    bn: "কোর্সটি কীভাবে assess করা হয়?",
    a: "My course is assessed through [assignments, presentations, research reports / written exams and coursework]. A major part of the assessment is [dissertation/final project], where I will apply what I have learned to a real research question or business case.",
    tip: "💡 University-র course page থেকে assessment method confirm করে নিন।"
  },
  {
    q: "How is this course related to your previous education?",
    cat: "Course Module",
    bn: "এই কোর্স আপনার আগের শিক্ষার সাথে কীভাবে সম্পর্কিত?",
    a: "My previous degree in [subject] gave me a strong foundation in [relevant area]. This course is a natural progression, as it builds on that knowledge while developing more specialised, advanced skills in [field], directly supporting my long-term career plan.",
    tip: "💡 Logical progression দেখান — আগের পড়াশোনা থেকে এই কোর্সে আসার যুক্তি স্পষ্ট করুন।"
  },
  {
    q: "Did you consider studying any other courses?",
    cat: "Course Module",
    bn: "অন্য কোনো কোর্স বিবেচনা করেছিলেন?",
    a: "I did briefly consider [alternative course], but I chose [Course Name] because it more closely matches my academic background and career goal of becoming a [job title], with a stronger focus on [specific strength of the course].",
    tip: "💡 শুধু 'না' না বলে একটা সৎ comparison করুন।"
  },
  {
    q: "What is the profession of your financial sponsor, and what is their income?",
    cat: "Financial Sponsorship",
    bn: "আপনার স্পনসরের পেশা ও আয় কত?",
    a: "My sponsor is my [father/mother], who works as a [profession] / runs a [business type]. Their approximate monthly income is [amount], and yearly income is [amount], which is sufficient to comfortably cover my tuition fees, accommodation, and living expenses.",
    tip: "💡 সুনির্দিষ্ট সংখ্যা (monthly/yearly) মুখস্থ রাখুন এবং bank statement-এর সাথে মিলিয়ে নিন।"
  },
  {
    q: "Do you have to pay back the money to your sponsor?",
    cat: "Financial Sponsorship",
    bn: "স্পনসরের টাকা কি ফেরত দিতে হবে?",
    a: "No, I do not need to repay this money. My [father/mother] is supporting my education voluntarily as part of family responsibility, not as a loan.",
    tip: "💡 যদি loan হয়, তাহলে সততার সাথে repayment plan উল্লেখ করুন।"
  },
  {
    q: "Do you know how to open a bank account in the UK?",
    cat: "Financial Sponsorship",
    bn: "UK-তে ব্যাংক একাউন্ট খোলা সম্পর্কে জানেন?",
    a: "Yes, as an international student I will need my passport, student visa, proof of UK address, and an enrolment letter from the university. I can apply online or in person, and popular student-friendly banks include HSBC, Barclays, NatWest, Lloyds, and Santander.",
    tip: "💡 ২-৩টা ব্যাংকের নাম এবং কী কী document লাগবে মনে রাখুন।"
  },
  {
    q: "How will you manage to pay your fees and living expenses?",
    cat: "Financial Sponsorship",
    bn: "ফি ও living expense কীভাবে ম্যানেজ করবেন?",
    a: "My tuition fees and living expenses will be covered through my sponsor's funds, which are already available and meet the UKVI 28-day requirement. I will also bring some initial cash to cover expenses immediately on arrival.",
    tip: "💡 28-day bank statement rule এবং arrival-cash এর কথা উল্লেখ করুন।"
  },
  {
    q: "What is your career plan after completing this course?",
    cat: "Future Plans",
    bn: "কোর্স শেষে আপনার ক্যারিয়ার প্ল্যান কী?",
    a: "After completing my degree, I plan to return to Bangladesh and work as a [job title] in [sector/companies, e.g. telecom, banking, FMCG]. The skills I gain — [skill 1], [skill 2] — will help me contribute to digital/organisational growth and eventually move into a senior or leadership role.",
    tip: "💡 একটা স্পষ্ট job title + ২-৩টা কোম্পানি/সেক্টরের নাম উল্লেখ করুন, যেন উত্তরটা specific ও বিশ্বাসযোগ্য মনে হয়।"
  },
  {
    q: "How does this course help you achieve your career plan?",
    cat: "Future Plans",
    bn: "এই কোর্স কীভাবে আপনার ক্যারিয়ার গোলে সাহায্য করবে?",
    a: "This course directly builds the skills required for my goal of becoming a [job title]. Modules such as [Module Name] develop my [specific skill], which I will apply in real organisational settings once I return to Bangladesh.",
    tip: "💡 প্রতিটি মডিউলকে নির্দিষ্ট career skill-এর সাথে সংযুক্ত করুন।"
  },
  {
    q: "Will you return to your home country after completing your studies?",
    cat: "Future Plans",
    bn: "পড়াশোনা শেষে দেশে ফিরবেন কি?",
    a: "Yes, I plan to return to Bangladesh after completing my studies. I have strong family ties, career opportunities, and responsibilities at home, and the qualification I gain in the UK will help me build a strong career there.",
    tip: "💡 'Strong ties' প্রমাণ করুন — পরিবার, সম্পত্তি, job prospect উল্লেখ করুন।"
  },
  {
    q: "Where will you live while studying, and have you booked it?",
    cat: "Accommodation",
    bn: "কোথায় থাকবেন এবং বুকিং দেওয়া হয়েছে কি?",
    a: "I plan to live in [university/private accommodation name]. [If booked: I have already confirmed my booking and have the confirmation letter with me.] [If not yet: I have shortlisted my accommodation and will confirm the booking once my visa is approved.]",
    tip: "💡 Accommodation-এর নাম, address এবং weekly/monthly cost মুখস্থ রাখুন।"
  },
  {
    q: "How much will your overall living expenses be, and can you break it down?",
    cat: "Accommodation",
    bn: "মোট living expense কত এবং breakdown দিতে পারবেন?",
    a: "My estimated monthly living expenses are around [£amount], which includes accommodation (£[amount]), food (£[amount]), transport (£[amount]), mobile/utilities (£[amount]), and miscellaneous costs (£[amount]). This is in line with the UKVI's required living-cost figures.",
    tip: "💡 UKVI living cost: London-এর বাইরে প্রায় £1,023/month, লন্ডনে £1,334/month — এই figure-এর সাথে মিলিয়ে বলুন।"
  },
];

const UKVI_QA = [
  {
    q: "What is the purpose of your visit to the UK?",
    cat: "Personal Information",
    bn: "UK ভ্রমণের উদ্দেশ্য কী?",
    a: "I am travelling to the UK to pursue my [undergraduate/postgraduate] studies at [University Name]. I have been accepted onto the [Course Name] programme commencing [Month Year].",
    tip: "💡 সংক্ষিপ্ত ও স্পষ্ট উত্তর দিন। University নাম ও course নাম সঠিকভাবে বলুন।"
  },
  {
    q: "How long do you intend to stay in the UK?",
    cat: "Future Plans",
    bn: "UK-তে কতদিন থাকার পরিকল্পনা?",
    a: "I intend to stay for the duration of my course, which is [1/2/3] year(s). My visa is valid until [date], and I plan to return to Bangladesh upon completing my studies.",
    tip: "💡 Visa validity-র বেশি থাকার কথা বলবেন না। Course duration স্পষ্ট করুন।"
  },
  {
    q: "Where will you be living in the UK?",
    cat: "Accommodation",
    bn: "UK-তে কোথায় থাকবেন?",
    a: "I will be staying at [university accommodation name / private address]. I have already confirmed my accommodation booking and have the confirmation letter with me.",
    tip: "💡 Accommodation letter সাথে রাখুন। Address মুখস্থ রাখুন।"
  },
  {
    q: "How much money do you have to support yourself?",
    cat: "Financial Sponsorship",
    bn: "নিজেকে সাপোর্ট করার জন্য কত টাকা আছে?",
    a: "I have sufficient funds to cover my tuition fees and living expenses. My bank statement shows I have maintained [amount] for the required 28-day period. My sponsor is my [father/mother] who supports my education.",
    tip: "💡 Bank statement-এর exact amount বলুন। UKVI requirement হলো tuition + £1,023-£1,334/month living cost।"
  },
  {
    q: "Have you ever been refused a UK visa before?",
    cat: "Personal Information",
    bn: "আগে কি UK visa refusal হয়েছিল?",
    a: "Yes/No. [If yes: I was refused in [year] due to [reason]. Since then, I have [addressed the issue — e.g., improved finances, got IELTS, stronger ties to home country] and I believe my application is now much stronger.]",
    tip: "💡 সত্য বলুন — মিথ্যা বললে permanent ban হতে পারে। Refusal-এর কারণ ও সমাধান explain করুন।"
  },
  {
    q: "Do you intend to work while studying?",
    cat: "Future Plans",
    bn: "পড়াশোনার পাশাপাশি কাজ করার পরিকল্পনা আছে?",
    a: "Yes, my Student visa permits me to work up to 20 hours per week during term time and full-time during holidays. However, my primary purpose is studying, and any part-time work would be supplementary only.",
    tip: "💡 Student visa-র 20 hour rule জানুন। Main purpose পড়াশোনা — এটা emphasise করুন।"
  },
  {
    q: "What ties do you have to Bangladesh?",
    cat: "Family",
    bn: "Bangladesh-এর সাথে আপনার কী সম্পর্ক আছে?",
    a: "I have strong ties to Bangladesh. My parents and family live there. My father runs a [business/works as] in Bangladesh, and I am expected to return and contribute to the family. I also have property interests / career opportunities waiting for me there.",
    tip: "💡 এটাই সবচেয়ে গুরুত্বপূর্ণ প্রশ্ন। Strong ties prove করুন — family, property, job prospect, business।"
  },
  {
    q: "Why not study in Bangladesh instead?",
    cat: "Course Module",
    bn: "Bangladesh-এ না পড়ে UK-তে কেন?",
    a: "While Bangladesh has good universities, the specific programme I am interested in — [course name] — with the level of research, industry exposure, and international recognition offered by [University Name] is not available at the same standard in Bangladesh. This qualification will significantly enhance my career prospects upon return.",
    tip: "💡 UK education-এর specific advantage বলুন — course quality, research, international recognition।"
  },
  {
    q: "Why did you choose this institute over others (UKVI deep-dive)?",
    cat: "University",
    bn: "অন্য প্রতিষ্ঠানের বদলে কেন এটি বেছে নিলেন? (গভীর প্রশ্ন)",
    a: "I chose [University Name] for three specific reasons: first, its official recognition — it holds a [TEF rating / ranking] from [official body]; second, its [research impact / industry connection], which shows the course leads to real-world outcomes; and third, the course structure itself, which combines [unique combination, e.g. AI + Business] that I could not find elsewhere.",
    tip: "💡 শুধু 'ভালো ইউনিভার্সিটি' বললে চলবে না — অফিসিয়াল র্যাঙ্কিং/স্বীকৃতির নাম উল্লেখ করুন (যেমন TEF, REF, Advance HE)।"
  },
  {
    q: "What is the Genuine Student Test, and how do you meet it?",
    cat: "Personal Information",
    bn: "Genuine Student Test কী এবং আপনি কীভাবে সেটা পূরণ করেন?",
    a: "I understand UKVI checks whether I am a genuine student rather than someone planning to work illegally. I can show this through my consistent academic background, a clear course choice linked to my career goal, sufficient funds, confirmed accommodation, and strong ties — such as family and career prospects — back in Bangladesh.",
    tip: "💡 Officer যাচাই করতে চায় আপনি আসলেই পড়তে যাচ্ছেন কিনা। Consistent answer ও documents দিয়ে এটা প্রমাণ করুন।"
  },
  {
    q: "Are you aware of the Graduate Route (Post-Study Work) visa? Will you use it to work instead of focusing on study?",
    cat: "Future Plans",
    bn: "গ্র্যাজুয়েট রুট ভিসা সম্পর্কে জানেন? এটা দিয়ে কি পড়ার বদলে কাজ করবেন?",
    a: "Yes, I am aware that the Graduate Route allows international students to work for 2 years after completing their degree. However, my primary goal is to complete my studies and gain academic/research skills. If I take any short-term work or internship afterwards, it will be for skill development, not as my main purpose for coming to the UK.",
    tip: "💡 PSW/Graduate Route নিয়ে honest থাকুন কিন্তু বারবার ক্লিয়ার করুন: main purpose পড়াশোনা, কাজ নয়।"
  },
  {
    q: "Do you understand the Points-Based System (PBS) requirements for your visa?",
    cat: "Visa & Immigration",
    bn: "ভিসার Points-Based System (PBS) সম্পর্কে জানেন?",
    a: "Yes. The Student visa requires 70 points in total — 50 points from a valid CAS issued by a licensed sponsor, 10 points from proof of English language ability, and 10 points from evidence of sufficient maintenance funds. I have met all three requirements.",
    tip: "💡 50+10+10 = 70 points — এই breakdown মুখস্থ রাখুন।"
  },
  {
    q: "What are your responsibilities as a student visa holder?",
    cat: "Visa & Immigration",
    bn: "স্টুডেন্ট ভিসা ধারক হিসেবে আপনার কী কী দায়িত্ব আছে?",
    a: "I understand I must attend classes regularly, make satisfactory academic progress, work only within the permitted hours (up to 20 hours per week in term time), have enough funds for tuition and living costs, and keep my university and the Home Office updated with my contact details.",
    tip: "💡 Attendance, work-hour limit, financial proof, contact updates — এই ৪টি পয়েন্ট স্পষ্টভাবে বলুন।"
  },
  {
    q: "Are you using an education agent? What services have they provided?",
    cat: "Personal Information",
    bn: "কোনো এজেন্ট ব্যবহার করছেন? তারা কী সাহায্য করেছে?",
    a: "[Yes/No]. [If yes: My agent helped with the application process, choosing the right course, and document preparation. However, all final decisions about my course and university were made by me.]",
    tip: "💡 Agent থাকলে honestly বলুন, কিন্তু এটা স্পষ্ট করুন যে সিদ্ধান্ত আপনার নিজের।"
  },
  {
    q: "Do you have any relatives in the UK?",
    cat: "Family",
    bn: "UK-তে কোনো আত্মীয় আছে?",
    a: "[Yes/No]. [If yes: state the relationship, their name, address, and profession clearly and consistently with your documents.]",
    tip: "💡 থাকলে relationship, address ও profession স্পষ্টভাবে বলুন — অস্পষ্টতা সন্দেহ তৈরি করে।"
  },
  {
    q: "Are you married, or do you have any dependants travelling with you?",
    cat: "Family",
    bn: "আপনি বিবাহিত কি, বা কোনো dependent সাথে আসছে?",
    a: "[Yes/No]. [If yes: My spouse/dependant will [accompany me / stay in Bangladesh], and their profile is [brief detail]. I have the supporting documents for this if needed.]",
    tip: "💡 Marital status সম্পর্কিত প্রশ্নে honestly এবং সংক্ষেপে উত্তর দিন।"
  },
  {
    q: "How will you handle currency exchange rate fluctuations?",
    cat: "Financial Sponsorship",
    bn: "টাকার exchange rate পরিবর্তন হলে কীভাবে সামলাবেন?",
    a: "My sponsor has already arranged some additional funds to cover possible increases in cost due to exchange rate changes, so my tuition and living expenses remain secure regardless of currency fluctuation.",
    tip: "💡 Extra buffer fund-এর কথা উল্লেখ করুন যাতে exchange rate risk address হয়।"
  },
  {
    q: "What cultural differences or challenges do you expect in the UK, and how will you adapt?",
    cat: "Future Plans",
    bn: "UK-তে কী কালচারাল চ্যালেঞ্জ হতে পারে এবং কীভাবে adapt করবেন?",
    a: "I may need time to get used to different accents, social norms, and classroom styles. I plan to stay open-minded, ask questions when needed, and participate in student activities and orientation programmes to adapt quickly.",
    tip: "💡 Challenge স্বীকার করুন কিন্তু সাথে adaptation plan-ও বলুন — এটা maturity দেখায়।"
  },
  {
    q: "How will you manage your time between studies and other responsibilities?",
    cat: "Future Plans",
    bn: "পড়াশোনা ও অন্যান্য দায়িত্বের মধ্যে সময় কীভাবে ম্যানেজ করবেন?",
    a: "I will create a weekly timetable with fixed hours for lectures, assignments, and self-study, while also balancing rest and social activities to stay motivated and avoid burnout.",
    tip: "💡 একটা সংক্ষিপ্ত ও বাস্তবসম্মত weekly-routine উদাহরণ দিন।"
  },
  {
    q: "Tell me about the UK's culture and weather.",
    cat: "Personal Information",
    bn: "UK-এর culture ও weather সম্পর্কে বলুন।",
    a: "The UK has a temperate maritime climate — mild summers (around 18-25°C) and cool, damp winters (0-7°C), with rain possible throughout the year. Culturally, it is diverse and multicultural, known for punctuality, politeness, and a strong tradition in sport, literature, and the arts.",
    tip: "💡 Weather + ১-২টা cultural point মিলিয়ে সংক্ষেপে বলুন, যাতে স্বাভাবিক মনে হয়।"
  },
];

const QA_CATEGORIES = [
  { id: "all",                    label: "All",                    icon: "📌" },
  { id: "Personal Information",   label: "Personal Information",   icon: "🧍" },
  { id: "University",             label: "University",             icon: "🎓" },
  { id: "Family",                 label: "Family",                 icon: "👨‍👩‍👧" },
  { id: "Course Module",          label: "Course Module",          icon: "📘" },
  { id: "Future Plans",           label: "Future Plans",           icon: "🚀" },
  { id: "Financial Sponsorship",  label: "Financial Sponsorship",  icon: "💰" },
  { id: "Accommodation",          label: "Accommodation",          icon: "🏠" },
  { id: "Visa & Immigration",     label: "Visa & Immigration",     icon: "🛂" },
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

export { CAS_QA, UKVI_QA, QA_CATEGORIES, REFUSAL_REASONS };
