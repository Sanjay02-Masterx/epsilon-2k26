/**
 * registrationStatus.js
 * Auto-computes registration status based on current date vs March 16 event.
 * Import this in EventCard.jsx and EventDetails.jsx.
 */

const EVENT_DAY   = new Date("2026-03-16T00:00:00+05:30");
const CLOSES_SOON = new Date("2026-03-14T00:00:00+05:30"); // 2 days before = warning

export function getRegistrationStatus() {
  const now = Date.now();
  const eventMs   = EVENT_DAY.getTime();
  const closingMs = CLOSES_SOON.getTime();

  if (now >= eventMs)   return "closed";
  if (now >= closingMs) return "closing";
  return "open";
}

/**
 * Returns { label, color, bg, border, icon, dot } for each status.
 */
export function getStatusStyle(status) {
  switch (status) {
    case "closed":
      return {
        icon:   "✕",
        label:  "Closed",
        color:  "#9ca3af",
        bg:     "rgba(55,65,81,0.75)",
        border: "rgba(107,114,128,0.4)",
        dot:    "#6b7280",
      };
    case "closing":
      return {
        icon:   "⚡",
        label:  "Closing Soon",
        color:  "#fbbf24",
        bg:     "rgba(120,80,0,0.6)",
        border: "rgba(251,191,36,0.45)",
        dot:    "#fbbf24",
      };
    case "open":
    default:
      return {
        icon:   "●",
        label:  "Open",
        color:  "#4ade80",
        bg:     "rgba(0,80,30,0.6)",
        border: "rgba(74,222,128,0.4)",
        dot:    "#4ade80",
      };
  }
}
