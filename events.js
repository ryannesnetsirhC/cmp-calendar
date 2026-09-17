/**
 * EVENTS DATA
 * -----------
 * This is the ONLY file you need to edit to keep the calendar current.
 * Add, remove, or change entries below — no other code needs to change.
 *
 * Each event needs:
 *   date     - "YYYY-MM-DD"
 *   title    - shown on the calendar and in the upcoming list
 *   category - one of: "board", "finance", "staffing", "sped", "other"
 *              (controls the color dot/badge — see CATEGORIES below)
 *   note     - optional short description (shown in the upcoming list)
 *
 * NOTE: The dates below are SAMPLE placeholders so you can see the site
 * working. Replace them with your real dates before sharing with a client.
 */

const CATEGORIES = {
  board:    { label: "Board Meeting",             color: "#2E6B4F" },
  finance:  { label: "Finance Committee Meeting",  color: "#C9973B" },
  staffing: { label: "Staffing Model Download",    color: "#3E6FA8" },
  sped:     { label: "SpEd Sheet Ready",           color: "#8E5A9E" },
  other:    { label: "Other",                      color: "#6B6B6B" },
};

const EVENTS = [
  { date: "2026-09-24", title: "Board Meeting", category: "board", note: "Quarterly board session" },
  { date: "2026-10-01", title: "Finance Committee Meeting", category: "finance", note: "Monthly budget review" },
  { date: "2026-10-05", title: "Staffing Model Download", category: "staffing", note: "Updated staffing model available" },
  { date: "2026-10-15", title: "SpEd Sheet Ready", category: "sped", note: "SpEd contracted services recon sheet published" },
  { date: "2026-10-22", title: "Board Meeting", category: "board", note: "Quarterly board session" },
  { date: "2026-11-05", title: "Finance Committee Meeting", category: "finance", note: "Monthly budget review" },
  { date: "2026-11-12", title: "Staffing Model Download", category: "staffing", note: "Updated staffing model available" },
  { date: "2026-11-19", title: "SpEd Sheet Ready", category: "sped", note: "SpEd contracted services recon sheet published" },
  { date: "2026-12-03", title: "Board Meeting", category: "board", note: "Quarterly board session" },
  { date: "2026-12-10", title: "Finance Committee Meeting", category: "finance", note: "Monthly budget review" },
];
