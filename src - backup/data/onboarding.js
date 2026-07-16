// Static content for the Onboarding screen.
// Keeping this separate from markup means copy changes (icons, labels,
// colors, avatar URLs) never require touching component code.

export const locationBadges = {
    from: { icon: "📍", label: "Bangladesh", flag: "🇧🇩" },
    to: { icon: "📍", label: "United Kingdom", flag: "🇬🇧" },
};

export const journeySteps = [
    { id: "research", icon: "🔍", label: "Research", color: "c-purple" },
    { id: "apply", icon: "📝", label: "Apply", color: "c-blue" },
    { id: "offer", icon: "✉️", label: "Offer", color: "c-green" },
    { id: "cas", icon: "🪪", label: "CAS", color: "c-purple" },
    { id: "visa", icon: "🌐", label: "Visa", color: "c-blue" },
    { id: "arrive", icon: "✈️", label: "Arrive UK", color: "c-green" },
];

export const guideDescription =
  "Everything you need to study in the UK and build your future, all in one place.";

export const featureCards = [
    {
        id: "step-by-step",
        icon: "🗺️",
        iconColor: "fi-purple",
        title: "Step by Step",
        description: "Structured guidance for every stage",
    },
    {
        id: "stay-on-track",
        icon: "📅",
        iconColor: "fi-green",
        title: "Stay on Track",
        description: "Never miss important deadlines",
    },
    {
        id: "all-in-one-place",
        icon: "📄",
        iconColor: "fi-yellow",
        title: "All in One Place",
        description: "Documents, tasks, resources & more",
    },
    {
        id: "track-progress",
        icon: "📊",
        iconColor: "fi-blue",
        title: "Track Progress",
        description: "Monitor your journey to success",
    },
];

export const journeyStats = [
    { id: "students-guided", value: "2K+", label: "Students Guided" },
    { id: "visa-success", value: "98%", label: "Visa Success Stories" },
];

export const trustCopy = {
    title: "Trusted by 2,000+ Students",
    subtitle: "Your data is safe and secure with us.",
};

export const trustAvatars = [
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/men/65.jpg",
];

export const trustMoreBadge = "+2K";

export const ctaLabel = "Let's Start Your Journey";
export const signInCopy = {
    prompt: "Already have an account?",
    action: "Sign In",
};
