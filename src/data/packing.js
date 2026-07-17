// Packing planner categories and luggage presets — extracted from App.js
//
// Each item carries:
//   buy          "bd" | "uk" | "either" | "optional"  — used by the Buy Location filter
//   travellerTags (optional array) — used by the Traveller filter, e.g. ["female"].
//     Items with NO travellerTags are considered universal and always show,
//     regardless of which traveller chips are active.
//
// Only items that are clearly gender/family-specific in real life are tagged
// below (e.g. sanitary products -> female). Nothing else in the current list
// is inherently gender- or family-specific, so most items stay untagged and
// always visible — the Traveller filter narrows the few that genuinely apply.

export const BUY_LOCATIONS = {
  bd: { label: "Better Buy in Bangladesh", short: "Better Buy in BD", emoji: "🇧🇩", color: "#00c896" },
  uk: { label: "Better Buy in UK", short: "Better Buy in UK", emoji: "🇬🇧", color: "#4A90D9" },
  either: { label: "Either Country", short: "Either Country", emoji: "🌍", color: "#7d8590" },
  optional: { label: "Optional", short: "Optional", emoji: "⭐", color: "#E8A838" },
};

export const TRAVELLER_FILTERS = [
  { id: "male", label: "Male", emoji: "👨" },
  { id: "female", label: "Female", emoji: "👩" },
  { id: "single", label: "Single", emoji: "👤" },
  { id: "family", label: "With Family", emoji: "👨‍👩‍👧" },
  { id: "kids", label: "Kids", emoji: "👶" },
  { id: "dependents", label: "Dependents", emoji: "👥" },
];

export const PACKING_CATEGORIES = [
  {
    id: "winter", name: "Winter Clothes", icon: "🧥", color: "#06b6d4",
    items: [
      { id: "p-win-1", name: "Heavy winter coat", weight: 1.5, buy: "uk" },
      { id: "p-win-2", name: "Waterproof jacket", weight: 0.6, buy: "uk" },
      { id: "p-win-3", name: "Sweaters / jumpers (3-4)", weight: 1.2, buy: "bd" },
      { id: "p-win-4", name: "Thermal innerwear", weight: 0.4, buy: "bd" },
      { id: "p-win-5", name: "Warm socks (5+ pairs)", weight: 0.3, buy: "bd" },
      { id: "p-win-6", name: "Gloves", weight: 0.1, buy: "either" },
      { id: "p-win-7", name: "Scarf / muffler", weight: 0.15, buy: "bd" },
      { id: "p-win-8", name: "Beanie / winter hat", weight: 0.1, buy: "either" },
      { id: "p-win-9", name: "Waterproof shoes/boots", weight: 1.0, buy: "uk" },
    ],
  },
  {
    id: "regular", name: "Regular Clothes", icon: "👕", color: "#84cc16",
    items: [
      { id: "p-reg-1", name: "T-shirts / shirts (6-8)", weight: 1.0, buy: "bd" },
      { id: "p-reg-2", name: "Trousers / jeans (4-5)", weight: 1.5, buy: "bd" },
      { id: "p-reg-3", name: "Formal wear (1-2 sets)", weight: 0.8, buy: "bd" },
      { id: "p-reg-4", name: "Sleepwear", weight: 0.3, buy: "bd" },
      { id: "p-reg-5", name: "Undergarments (10+)", weight: 0.4, buy: "bd" },
      { id: "p-reg-6", name: "Regular shoes / sneakers", weight: 0.7, buy: "either" },
      { id: "p-reg-7", name: "Belt", weight: 0.1, buy: "bd" },
    ],
  },
  {
    id: "electronics", name: "Electronics", icon: "🔌", color: "#a78bfa",
    items: [
      { id: "p-ele-1", name: "Laptop + charger", weight: 1.8, buy: "either" },
      { id: "p-ele-2", name: "Phone + charger", weight: 0.2, buy: "either" },
      { id: "p-ele-3", name: "UK plug adapter (Type G)", weight: 0.1, buy: "bd" },
      { id: "p-ele-4", name: "Power bank", weight: 0.3, buy: "bd" },
      { id: "p-ele-5", name: "Headphones/earbuds", weight: 0.1, buy: "either" },
      { id: "p-ele-6", name: "Multi-port charger/extension", weight: 0.2, buy: "uk" },
    ],
  },
  {
    id: "toiletries", name: "Toiletries", icon: "🧴", color: "#f43f5e",
    items: [
      { id: "p-toi-1", name: "Toothbrush & toothpaste", weight: 0.1, buy: "either" },
      { id: "p-toi-2", name: "Skincare basics", weight: 0.3, buy: "bd" },
      { id: "p-toi-3", name: "Travel-size shampoo/soap", weight: 0.2, buy: "optional" },
      { id: "p-toi-4", name: "Razor / shaving kit", weight: 0.1, buy: "either" },
      { id: "p-toi-5", name: "Sanitary products (few weeks' supply)", weight: 0.3, buy: "bd", travellerTags: ["female"] },
      { id: "p-toi-6", name: "Towel (quick-dry travel towel)", weight: 0.3, buy: "uk" },
    ],
  },
  {
    id: "kitchen", name: "Kitchen & Food", icon: "🍳", color: "#fb923c",
    items: [
      { id: "p-kit-1", name: "Favourite spices (sealed)", weight: 0.5, buy: "bd" },
      { id: "p-kit-2", name: "Instant noodles / snacks", weight: 0.5, buy: "bd" },
      { id: "p-kit-3", name: "Small cooking utensil set", weight: 0.4, buy: "uk", travellerTags: ["family", "dependents"] },
      { id: "p-kit-4", name: "Reusable water bottle", weight: 0.2, buy: "either" },
      { id: "p-kit-5", name: "Lunch box / tiffin", weight: 0.2, buy: "either", travellerTags: ["family", "kids", "dependents"] },
    ],
  },
  {
    id: "academic", name: "Academic Supplies", icon: "📚", color: "#f59e0b",
    items: [
      { id: "p-aca-1", name: "Notebooks & stationery", weight: 0.4, buy: "uk" },
      { id: "p-aca-2", name: "Calculator (if needed)", weight: 0.2, buy: "either" },
      { id: "p-aca-3", name: "Backpack/laptop bag", weight: 0.6, buy: "bd" },
      { id: "p-aca-4", name: "USB drive", weight: 0.05, buy: "either" },
    ],
  },
  {
    id: "money", name: "Money & Cards", icon: "💳", color: "#00c896",
    items: [
      { id: "p-mon-1", name: "GBP cash (£100-200)", weight: 0, buy: "bd" },
      { id: "p-mon-2", name: "International debit/credit card", weight: 0, buy: "bd" },
      { id: "p-mon-3", name: "Travel money card (Wise/Revolut)", weight: 0, buy: "bd" },
    ],
  },
  {
    id: "health", name: "Health & Medicine", icon: "💊", color: "#ec4899",
    items: [
      { id: "p-hea-1", name: "Prescription medicines (with letter)", weight: 0.2, buy: "bd" },
      { id: "p-hea-2", name: "Basic first-aid items", weight: 0.2, buy: "bd" },
      { id: "p-hea-3", name: "Spare glasses/contact lenses", weight: 0.1, buy: "bd" },
      { id: "p-hea-4", name: "Vitamins/supplements", weight: 0.2, buy: "bd" },
      { id: "p-hea-5", name: "Children's medicine & thermometer", weight: 0.15, buy: "bd", travellerTags: ["kids", "family"] },
    ],
  },
  {
    id: "misc", name: "Miscellaneous", icon: "🎒", color: "#7d8590",
    items: [
      { id: "p-mis-1", name: "Photos of family", weight: 0.05, buy: "bd" },
      { id: "p-mis-2", name: "Small gift items / souvenirs", weight: 0.3, buy: "bd" },
      { id: "p-mis-3", name: "Lock for luggage", weight: 0.1, buy: "bd" },
      { id: "p-mis-4", name: "Umbrella (compact)", weight: 0.3, buy: "optional" },
      { id: "p-mis-5", name: "Reusable shopping bag", weight: 0.05, buy: "optional" },
      { id: "p-mis-6", name: "Kids' toys / comfort items", weight: 0.3, buy: "bd", travellerTags: ["kids"] },
    ],
  },
];

export const LUGGAGE_PRESETS = [
  { id: "23", label: "23 kg (Standard checked bag)", limit: 23 },
  { id: "30", label: "30 kg (Extra baggage)", limit: 30 },
  { id: "32", label: "32 kg (Max single bag - most airlines)", limit: 32 },
  { id: "custom", label: "Custom limit", limit: null },
];