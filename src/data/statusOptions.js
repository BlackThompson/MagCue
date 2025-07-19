// User status configuration
export const statusOptions = [
    { key: "online", label: "🟢 Online", score: -1 },
    { key: "available", label: "🟡 Available", score: -2 },
    { key: "away", label: "🟠 Away", score: -3 },
    { key: "busy", label: "🔴 Busy", score: -3 },
    { key: "sleeping", label: "😴 Sleeping", score: -4 },
    { key: "dnd", label: "⛔ Do Not Disturb", score: -4 },
    { key: "oncall", label: "📞 On a Call", score: -5 },
    { key: "offline", label: "⚫ Offline", score: -5 }
]; 