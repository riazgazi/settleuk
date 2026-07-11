// Cost calculator fixed values and expense category metadata — extracted from App.js

export const COST_FIXED = { ielts: 200, visa: 490, cas: 150, deposit: 1334, bio: 19 };
export const UNI_TUITION_MAP = { northumbria: 12000, manchester: 22000, sheffield: 18000, coventry: 13500, huddersfield: 14000 };

export const EXPENSE_CAT_META = {
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
