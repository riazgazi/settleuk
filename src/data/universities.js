// University finder bands and search links — extracted from App.js

export const UNI_BANDS_BACHELOR = [
  { min: 5.0, label: "Top-tier eligible", desc: "Russell Group & top 20 universities likely within reach (with good IELTS).", examples: ["University of Manchester", "King's College London", "University of Leeds", "University of Birmingham"] },
  { min: 4.0, label: "Strong standing", desc: "Well-ranked universities widely accept this profile.", examples: ["Coventry University", "University of Hertfordshire", "Cardiff Metropolitan University", "Aston University"] },
  { min: 3.0, label: "Good standing", desc: "Many UK universities with foundation/pathway options will accept this.", examples: ["University of Sunderland", "University of East London", "Teesside University", "University of Bolton"] },
  { min: 0, label: "Foundation route likely", desc: "A foundation year before the bachelor's degree is commonly recommended.", examples: ["University of West London (foundation)", "Ravensbourne University (foundation)", "Pathway providers via Kaplan/INTO"] },
];

export const UNI_BANDS_MASTERS = [
  { min: 3.5, label: "Top-tier eligible", desc: "Strong CGPA — Russell Group postgraduate programs are realistic targets.", examples: ["University of Manchester", "University of Leeds", "Queen Mary University of London", "University of Sheffield"] },
  { min: 3.0, label: "Strong standing", desc: "Most well-ranked universities accept this CGPA for Master's admission.", examples: ["Coventry University", "University of Hertfordshire", "Aston University", "University of Portsmouth"] },
  { min: 2.5, label: "Good standing", desc: "Many universities accept with relevant work experience or a strong SOP.", examples: ["University of Sunderland", "University of Bolton", "University of East London", "Teesside University"] },
  { min: 0, label: "Pre-Master's route likely", desc: "A pre-master's / pathway program may be required first.", examples: ["University of Hertfordshire (pre-master's)", "Kaplan pathway centres", "INTO pathway centres"] },
];

export const SEARCH_LINKS = [
  { name: "UCAS Course Search", icon: "🎓", url: "https://www.ucas.com/explore/search/results" },
  { name: "Hotcourses Abroad", icon: "🔎", url: "https://www.hotcoursesabroad.com/" },
  { name: "FindAMasters", icon: "📚", url: "https://www.findamasters.com/" },
  { name: "British Council", icon: "🇬🇧", url: "https://www.britishcouncil.org/study-work-abroad/in-uk" },
];
export const getUniBand = (level, score, bachelorBands, masterBands) => {
  const bands = level === "bachelor" ? bachelorBands : masterBands;

  return (
    bands.find((band) => score >= band.min) ||
    bands[bands.length - 1]
  );
};

// ==================================================================
// University Explorer data — appended for the University Explorer
// Quick Tool (search/filter/compare/details/save). Everything above
// this line is untouched — UniversityFinder's band-estimate step
// keeps working exactly as before.
// ==================================================================

export const COUNTRIES = ["England", "Scotland", "Wales", "Northern Ireland"];

export const STUDY_LEVELS = [
  { id: "foundation", label: "Foundation" },
  { id: "bachelor", label: "Bachelor" },
  { id: "master", label: "Master" },
  { id: "mres", label: "MRes" },
  { id: "phd", label: "PhD" },
];

export const IELTS_OPTIONS = [
  { id: "none", label: "No IELTS", min: 0 },
  { id: "5.5", label: "5.5", min: 5.5 },
  { id: "6.0", label: "6.0", min: 6.0 },
  { id: "6.5", label: "6.5", min: 6.5 },
  { id: "7", label: "7+", min: 7 },
];

export const INTAKES = ["January", "May", "September"];

export const UNIVERSITY_LIST = [
  {
    id: "birmingham",
    name: "University of Birmingham",
    logo: "🏛️",
    city: "Birmingham",
    country: "England",
    ranking: "UK Top 20",
    studyLevels: ["bachelor", "master"],
    duration: { bachelor: "3 years", master: "1 year" },
    tuitionPerYear: 22000,
    livingCostPerYear: 12000,
    ieltsMin: 6.5,
    intakes: ["September", "January"],
    entryRequirement: "CGPA 3.0+/4.0 or equivalent, IELTS 6.5 overall",
    courses: ["Computer Science", "Business Management", "Civil Engineering"],
    scholarships: ["Global Excellence Scholarship — up to £4,000/year"],
    about:
      "A Russell Group university known for research strength across engineering, business, and computer science, with a large international student community.",
    website: "https://www.birmingham.ac.uk",
  },
  {
    id: "glasgow",
    name: "University of Glasgow",
    logo: "🏛️",
    city: "Glasgow",
    country: "Scotland",
    ranking: "UK Top 15",
    studyLevels: ["bachelor", "master", "phd"],
    duration: { bachelor: "4 years", master: "1 year", phd: "3-4 years" },
    tuitionPerYear: 24500,
    livingCostPerYear: 11500,
    ieltsMin: 6.5,
    intakes: ["September"],
    entryRequirement: "CGPA 3.2+/4.0, IELTS 6.5 (no band below 6.0)",
    courses: ["Data Science", "Economics", "Mechanical Engineering"],
    scholarships: ["International Leadership Scholarship — up to £5,000"],
    about:
      "One of the UK's oldest universities, strong in social sciences and engineering, set in a compact campus close to Glasgow city centre.",
    website: "https://www.gla.ac.uk",
  },
  {
    id: "cardiff",
    name: "Cardiff University",
    logo: "🏛️",
    city: "Cardiff",
    country: "Wales",
    ranking: "UK Top 30",
    studyLevels: ["bachelor", "master"],
    duration: { bachelor: "3 years", master: "1 year" },
    tuitionPerYear: 19500,
    livingCostPerYear: 10500,
    ieltsMin: 6.0,
    intakes: ["September", "January"],
    entryRequirement: "CGPA 2.8+/4.0 or equivalent, IELTS 6.0 overall",
    courses: ["Journalism", "Architecture", "Biosciences"],
    scholarships: ["Vice-Chancellor's International Scholarship — 20% tuition"],
    about:
      "A Russell Group university with a well-known journalism school and a compact, walkable campus in the Welsh capital.",
    website: "https://www.cardiff.ac.uk",
  },
  {
    id: "queens-belfast",
    name: "Queen's University Belfast",
    logo: "🏛️",
    city: "Belfast",
    country: "Northern Ireland",
    ranking: "UK Top 40",
    studyLevels: ["bachelor", "master", "mres"],
    duration: { bachelor: "3 years", master: "1 year", mres: "1 year" },
    tuitionPerYear: 18000,
    livingCostPerYear: 9500,
    ieltsMin: 6.0,
    intakes: ["September"],
    entryRequirement: "CGPA 2.75+/4.0 or equivalent, IELTS 6.0 overall",
    courses: ["Law", "Pharmacy", "Software Engineering"],
    scholarships: ["International Excellence Scholarship — up to £3,000"],
    about:
      "A Russell Group university offering a lower cost of living than most UK cities, with strengths in law and pharmacy.",
    website: "https://www.qub.ac.uk",
  },
  {
    id: "leeds",
    name: "University of Leeds",
    logo: "🏛️",
    city: "Leeds",
    country: "England",
    ranking: "UK Top 15",
    studyLevels: ["bachelor", "master", "phd"],
    duration: { bachelor: "3 years", master: "1 year", phd: "3-4 years" },
    tuitionPerYear: 23500,
    livingCostPerYear: 11000,
    ieltsMin: 6.5,
    intakes: ["September", "January"],
    entryRequirement: "CGPA 3.0+/4.0 or equivalent, IELTS 6.5 (no band below 5.5)",
    courses: ["Business Analytics", "Textile Technology", "Mechanical Engineering"],
    scholarships: ["Leeds International Excellence Scholarship — £5,000"],
    about:
      "A large Russell Group university with strong industry links, including a well-regarded textile and materials programme.",
    website: "https://www.leeds.ac.uk",
  },
  {
    id: "dundee",
    name: "University of Dundee",
    logo: "🏛️",
    city: "Dundee",
    country: "Scotland",
    ranking: "UK Top 50",
    studyLevels: ["bachelor", "master", "foundation"],
    duration: { foundation: "1 year", bachelor: "4 years", master: "1 year" },
    tuitionPerYear: 17500,
    livingCostPerYear: 9000,
    ieltsMin: 6.0,
    intakes: ["September", "January"],
    entryRequirement: "CGPA 2.5+/4.0 or equivalent, IELTS 6.0 overall",
    courses: ["Life Sciences", "Game Design", "Nursing"],
    scholarships: ["Dundee Global Scholarship — up to £2,000"],
    about:
      "Known for life sciences and a well-regarded game design programme, with one of the lowest costs of living among Scottish cities.",
    website: "https://www.dundee.ac.uk",
  },
  {
    id: "coventry",
    name: "Coventry University",
    logo: "🏛️",
    city: "Coventry",
    country: "England",
    ranking: "UK Top 60",
    studyLevels: ["bachelor", "master"],
    duration: { bachelor: "3 years", master: "1 year" },
    tuitionPerYear: 16500,
    livingCostPerYear: 9500,
    ieltsMin: 5.5,
    intakes: ["September", "January", "May"],
    entryRequirement: "CGPA 2.5+/4.0 or equivalent, IELTS 5.5-6.0 depending on course",
    courses: ["Automotive Engineering", "Logistics", "Computer Science"],
    scholarships: ["Coventry Global Scholarship — 15-25% tuition"],
    about:
      "A modern university with strong automotive and logistics industry ties, and one of the more accessible IELTS requirements on this list.",
    website: "https://www.coventry.ac.uk",
  },
  {
    id: "aberdeen",
    name: "University of Aberdeen",
    logo: "🏛️",
    city: "Aberdeen",
    country: "Scotland",
    ranking: "UK Top 35",
    studyLevels: ["bachelor", "master", "phd"],
    duration: { bachelor: "4 years", master: "1 year", phd: "3-4 years" },
    tuitionPerYear: 21000,
    livingCostPerYear: 10000,
    ieltsMin: 6.0,
    intakes: ["September"],
    entryRequirement: "CGPA 2.8+/4.0 or equivalent, IELTS 6.0 overall",
    courses: ["Petroleum Engineering", "Law", "Business Management"],
    scholarships: ["Aberdeen Global Undergraduate Scholarship — £4,000"],
    about:
      "One of the UK's oldest universities, with a globally recognised petroleum engineering programme tied to the North Sea energy sector.",
    website: "https://www.abdn.ac.uk",
  },
  {
    id: "sheffield-hallam",
    name: "Sheffield Hallam University",
    logo: "🏛️",
    city: "Sheffield",
    country: "England",
    ranking: "UK Top 80",
    studyLevels: ["bachelor", "master"],
    duration: { bachelor: "3 years", master: "1 year" },
    tuitionPerYear: 15500,
    livingCostPerYear: 9000,
    ieltsMin: 5.5,
    intakes: ["September", "January"],
    entryRequirement: "CGPA 2.5+/4.0 or equivalent, IELTS 5.5-6.0",
    courses: ["Fashion Management", "Computing", "Events Management"],
    scholarships: ["International Merit Scholarship — up to £2,000"],
    about:
      "A modern, career-focused university with a lower entry threshold and one of the more affordable tuition levels on this list.",
    website: "https://www.shu.ac.uk",
  },
  {
    id: "ulster",
    name: "Ulster University",
    logo: "🏛️",
    city: "Belfast",
    country: "Northern Ireland",
    ranking: "UK Top 90",
    studyLevels: ["bachelor", "master", "foundation"],
    duration: { foundation: "1 year", bachelor: "3 years", master: "1 year" },
    tuitionPerYear: 15000,
    livingCostPerYear: 8500,
    ieltsMin: 5.5,
    intakes: ["September", "January"],
    entryRequirement: "CGPA 2.3+/4.0 or equivalent, IELTS 5.5-6.0",
    courses: ["Business Studies", "Cyber Security", "Architecture"],
    scholarships: ["Vice-Chancellor's Scholarship — up to £2,500"],
    about:
      "One of the most affordable options on this list for both tuition and living cost, with a growing cyber security programme.",
    website: "https://www.ulster.ac.uk",
  },
];
