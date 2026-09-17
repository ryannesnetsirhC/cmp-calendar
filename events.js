/**
 * EVENTS DATA — Calendar (month-grid) view, 2026-27 school year
 * ---------------------------------------------------------------
 * This is the ONLY file you need to edit to keep the Calendar page
 * current. Add, remove, or change entries below.
 *
 * Each event needs:
 *   date     - "YYYY-MM-DD"
 *   title    - shown on the calendar and in the upcoming list
 *   category - one of: "board", "finance", "accounting", "staffing",
 *              "sped", "other" (controls the color dot — see
 *              CATEGORIES below)
 *   note     - optional short description (shown in the upcoming list)
 *
 * These are your real Board Meeting, Finance Committee, and
 * Accounting Close dates. The more granular financial-ops dates
 * (Documents Due, Materials Ready, etc.) live on the Table View page
 * instead — this Calendar page is meant to show just the key
 * meetings/deadlines at a glance.
 *
 * Note: Nov 14, 2026 is a Saturday — kept as given (flagged as a
 * special/off-cycle board session).
 */

const CATEGORIES = {
  board:      { label: "Board Meeting",       color: "#2E6B4F" },
  finance:    { label: "Finance Committee",   color: "#C9973B" },
  accounting: { label: "Accounting Close",    color: "#3E6FA8" },
  staffing:   { label: "Staffing Model Download", color: "#8E5A9E" },
  sped:       { label: "SpEd Sheet Ready",     color: "#B5563C" },
  other:      { label: "Other",                color: "#6B6B6B" },
};

const EVENTS = [
  // Board Meetings
  { date: "2026-10-12", title: "Board Meeting", category: "board" },
  { date: "2026-11-09", title: "Board Meeting", category: "board" },
  { date: "2026-11-14", title: "Board Meeting", category: "board", note: "Special/off-cycle session (Saturday)" },
  { date: "2026-12-14", title: "Board Meeting", category: "board" },
  { date: "2027-01-11", title: "Board Meeting", category: "board" },
  { date: "2027-02-08", title: "Board Meeting", category: "board" },
  { date: "2027-03-08", title: "Board Meeting", category: "board" },
  { date: "2027-04-12", title: "Board Meeting", category: "board" },
  { date: "2027-05-10", title: "Board Meeting", category: "board" },
  { date: "2027-06-07", title: "Board Meeting", category: "board" },
  { date: "2027-06-21", title: "Board Meeting", category: "board" },

  // Finance Committee Meetings
  { date: "2026-09-10", title: "Finance Committee", category: "finance" },
  { date: "2026-12-09", title: "Finance Committee", category: "finance" },
  { date: "2027-03-04", title: "Finance Committee", category: "finance" },
  { date: "2027-05-06", title: "Finance Committee", category: "finance" },
  { date: "2027-06-10", title: "Finance Committee", category: "finance" },

  // Accounting Close (more months to be added once available)
  { date: "2026-08-24", title: "Accounting Close", category: "accounting" },
  { date: "2026-09-18", title: "Accounting Close", category: "accounting" },
  { date: "2026-10-12", title: "Accounting Close", category: "accounting" },
  { date: "2026-11-13", title: "Accounting Close", category: "accounting" },
];