export const insightMeta = (type) => ({
    icon: type === "warn" ? "⚠️" : type === "tip" ? "💡" : "ℹ️",
    bg: type === "warn" ? "rgba(232,91,91,0.08)" : type === "tip" ? "rgba(61,184,139,0.07)" : "rgba(91,141,239,0.07)",
    border: type === "warn" ? "rgba(232,91,91,0.3)" : type === "tip" ? "rgba(61,184,139,0.22)" : "rgba(91,141,239,0.22)",
    color: type === "warn" ? "#CF142B" : type === "tip" ? "#1D9E6A" : "#4A90D9",
    badge: type === "warn"
        ? { label: "🔴 Urgent", c: "#CF142B", bg: "rgba(232,91,91,0.18)" }
        : type === "tip"
            ? { label: "🟢 Tip", c: "#1D9E6A", bg: "rgba(61,184,139,0.15)" }
            : { label: "🟡 Important", c: "#E8A838", bg: "rgba(232,168,56,0.15)" },
});