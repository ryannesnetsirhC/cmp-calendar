/**
 * TABLE VIEW DATA — 2026-27 school year
 * --------------------------------------
 * This file holds the real "anchor" dates (Board Meetings, Finance
 * Committee, Accounting Close) plus the Holidays/Network Closures pulled
 * from the board-approved 2026-27 Network School Calendar. Everything
 * else in the table (Board Materials Ready, Final Financial Review,
 * Financial Review, Staffing Model Updates Due, SpEd Sheet Updates Due,
 * Principal Meeting, Principal Materials Ready, FC Materials Ready,
 * Documents Due to Vertex) is CALCULATED from these anchors by
 * schedule.js using the rules below:
 *   - Board Materials Ready   = Board Meeting date minus 3 days
 *   - Final Financial Review  = the Thursday on/before Board Materials Ready
 *   - Financial Review        = Final Financial Review date minus 7 days
 *                                (also always a Thursday)
 *   - Staffing Model Updates Due = Financial Review date minus 3 days
 *   - SpEd Sheet Updates Due  = Staffing Model Updates Due minus 2 BUSINESS days
 *   - Principal Meeting       = the Friday immediately before the Board Meeting
 *   - Principal Materials Ready = the day before the Principal Meeting (Thursday)
 *   - FC Materials Ready      = Finance Committee date minus 1 day
 *   - Documents Due to Vertex = Accounting Close date minus 6 days
 * If a calculated date lands on a Saturday or Sunday, it's automatically
 * rolled back to the preceding Friday (marked with * in the table).
 * If a calculated OR given date lands on a known school holiday or
 * network closure day, it's marked with † (shown, not moved).
 * Accounting Close dates that are still tentative are marked with ‡.
 *
 * Two exceptions: the Dec 14 and Jan 11 board cycles' Staffing Model
 * Updates Due would otherwise land during Thanksgiving/Christmas break,
 * so those two are hardcoded (in schedule.js) to the Tuesday after
 * school is back instead of calculated. Everything else here still
 * flows through the formulas above.
 *
 * EVERYTHING in the table is editable EXCEPT Board Meeting and Finance
 * Committee dates — use the inputs right in the table, then hit
 * "Save Changes" at the bottom of Table View. That generates an updated
 * OVERRIDES / NOTES_OVERRIDES block (see the bottom of this file) for
 * you to paste back in here. Each edit is a one-off override for that
 * specific cycle — the formula keeps running normally for every other
 * cycle. To undo an override, just delete its line down below (or
 * change the cell back in Table View and re-save).
 *
 * TO UPDATE ANCHORS: add/edit dates in the arrays below ("YYYY-MM-DD").
 */

const ANCHORS = {
  boardMeetings: [
    "2026-10-12", "2026-11-09", "2026-11-14", "2026-12-14", "2027-01-11",
    "2027-02-08", "2027-03-08", "2027-04-12", "2027-05-10", "2027-06-07",
    "2027-06-21",
  ],
  financeCommittee: [
    "2026-09-10", "2026-12-09", "2027-03-04", "2027-05-06", "2027-06-10",
  ],
  // "tentative: true" marks Accounting Close dates that are still
  // provisional — shown with a ‡ in the table instead of being treated
  // as final.
  accountingClose: [
    { date: "2026-08-24" },
    { date: "2026-09-18" },
    { date: "2026-10-12" },
    { date: "2026-11-13" },
    { date: "2026-12-18", tentative: true },
    { date: "2027-01-15", tentative: true },
    { date: "2027-02-19", tentative: true },
    { date: "2027-03-19", tentative: true },
    { date: "2027-04-16", tentative: true },
    { date: "2027-05-14", tentative: true },
    { date: "2027-06-11", tentative: true },
  ],
};

// Board Meeting dates listed here get NONE of the usual lead-up items
// (Board Materials Ready, Final Financial Review, Financial Review,
// Staffing Model Updates Due, SpEd Sheet Updates Due, Principal Meeting,
// Principal Materials Ready, Payroll/HR Check In, Coding Check In) —
// those cells are just left blank for that cycle. The Board Meeting
// date itself still shows normally. Use this for one-off/special
// meetings that don't follow the normal prep cycle.
const SKIP_LEADUP = new Set([
  "2026-11-14", // Special Saturday board meeting — no standard lead-up items
]);

// School Holidays and Network Closures from the board-approved 2026-27
// Network School Calendar — used to flag dates with a †, never to move
// them. "type: holiday" = School Holiday (salmon/* on the official
// calendar); "type: closure" = Network Closure - All Staff Off (green
// on the official calendar). Staff In-Service Days and Parent/Teacher
// Conference early-release days from that calendar are intentionally
// NOT included here (not flagged, per your scope).
const HOLIDAYS = {
  "2026-07-01": { label: "School Holiday", type: "holiday" },
  "2026-07-02": { label: "School Holiday", type: "holiday" },
  "2026-07-03": { label: "School Holiday", type: "holiday" },
  "2026-07-06": { label: "Network Closure - All Staff Off", type: "closure" },
  "2026-07-07": { label: "Network Closure - All Staff Off", type: "closure" },
  "2026-07-08": { label: "Network Closure - All Staff Off", type: "closure" },
  "2026-07-09": { label: "Network Closure - All Staff Off", type: "closure" },
  "2026-07-10": { label: "Network Closure - All Staff Off", type: "closure" },
  "2026-09-07": { label: "Labor Day", type: "holiday" },
  "2026-11-11": { label: "Veterans Day", type: "holiday" },
  "2026-11-26": { label: "Thanksgiving", type: "holiday" },
  "2026-11-27": { label: "Day after Thanksgiving", type: "holiday" },
  "2026-12-24": { label: "School Holiday (Christmas Eve)", type: "holiday" },
  "2026-12-25": { label: "Christmas Day", type: "holiday" },
  "2026-12-27": { label: "Network Closure - All Staff Off", type: "closure" },
  "2026-12-28": { label: "Network Closure - All Staff Off", type: "closure" },
  "2026-12-29": { label: "Network Closure - All Staff Off", type: "closure" },
  "2026-12-30": { label: "Network Closure - All Staff Off", type: "closure" },
  "2026-12-31": { label: "School Holiday (New Year's Eve)", type: "holiday" },
  "2027-01-01": { label: "New Year's Day", type: "holiday" },
  "2027-01-18": { label: "MLK Day (observed)", type: "holiday" },
  "2027-02-15": { label: "Presidents Day (observed)", type: "holiday" },
  "2027-03-22": { label: "Network Closure - All Staff Off (Spring Break)", type: "closure" },
  "2027-03-23": { label: "Network Closure - All Staff Off (Spring Break)", type: "closure" },
  "2027-03-24": { label: "Network Closure - All Staff Off (Spring Break)", type: "closure" },
  "2027-03-25": { label: "Network Closure - All Staff Off (Spring Break)", type: "closure" },
  "2027-03-26": { label: "Network Closure - All Staff Off (Spring Break)", type: "closure" },
  "2027-05-31": { label: "Memorial Day", type: "holiday" },
  "2027-06-18": { label: "Juneteenth (observed)", type: "holiday" },
  "2027-06-28": { label: "Network Closure - All Staff Off", type: "closure" },
  "2027-06-29": { label: "Network Closure - All Staff Off", type: "closure" },
  "2027-06-30": { label: "Network Closure - All Staff Off", type: "closure" },
};

const TABLE_META = {
  title: "2026-27 CMP Monthly Financial Calendar",
  updated: "",
  footnote: "Board Meetings: 9am–12pm  •  * = moved from a weekend to the prior Friday   † = falls on a school holiday or network closure day  •  ‡ = tentative, subject to change  •  🟧 due within 5 days   🟨 due within 10 days",
};

// Column order, left to right — walking backward from Board Meeting
// (farthest right) through the items that lead up to it. Payroll/HR and
// Coding Check In aren't part of that lead-up chain, so they sit at the
// far left as background admin items.
const TABLE_COLUMNS = [
  { key: "payrollCheckIn", label: "Payroll/HR Check In", owner: "Sinnai/Meghan/Vertex", cadence: "", role: "hr" },
  { key: "codingCheckIn", label: "Coding Check In", owner: "Kosha/Vertex", cadence: "", role: "koshaap" },
  { key: "spedSheetUpdatesDue", label: "SpEd Sheet Updates Due", owner: "SpEd", cadence: "2 Business Days Prior", role: "sped" },
  { key: "staffingModel", label: "Staffing Model Updates Due", owner: "HR", cadence: "3 Days Prior", role: "hr" },
  { key: "financialReview", label: "Financial Review", owner: "Varies", cadence: "Thursday", role: null },
  { key: "finalFinancialReview", label: "Final Financial Review", owner: "Matt/Vertex", cadence: "Thursday", role: "matt" },
  { key: "principalMaterials", label: "Principal Materials Ready", owner: "Vertex", cadence: "Thursday", role: "principals" },
  { key: "principalMeeting", label: "Principal Meeting", owner: "Vertex, Principals", cadence: "Friday", role: "principals" },
  { key: "financeCommitteeMaterials", label: "Finance Committee Materials Ready", owner: "Vertex", cadence: "1 Day Prior", role: null },
  { key: "financeCommittee", label: "Finance Committee", owner: "Vertex, Finance Committee", cadence: "", role: null },
  { key: "docsToVertex", label: "Documents due to Vertex", owner: "Kosha/AP", cadence: "6 Days Prior", role: "koshaap" },
  { key: "acctClose", label: "Accounting Close", owner: "Vertex", cadence: "Varies", role: null },
  { key: "boardMaterials", label: "Board Materials Ready", owner: "Vertex", cadence: "3 Days Prior", role: null },
  { key: "boardMeeting", label: "Board Meeting", owner: "", cadence: "", role: null },
];

// Every column is editable in Table View except these two.
const EDITABLE_COLUMNS = new Set(
  TABLE_COLUMNS.map((c) => c.key).filter((k) => k !== "boardMeeting" && k !== "financeCommittee")
);

const ROLE_FILTERS = [
  { key: "all", label: "All" },
  { key: "hr", label: "HR" },
  { key: "principals", label: "Principals/Site Leads" },
  { key: "matt", label: "Matt" },
  { key: "koshaap", label: "Kosha/AP" },
  { key: "sped", label: "SpEd" },
];

// Row order for the grid — a full school year, July through June.
const MONTH_ORDER = [
  "July", "August", "September", "October", "November", "December",
  "January", "February", "March", "April", "May", "June",
];

// ---------------------------------------------------------------------
// MANUAL OVERRIDES — generated by the "Save Changes" button in Table
// View. Each entry is a one-off override for one specific cycle (keyed
// by that cycle's anchor date — the Board Meeting, Finance Committee,
// or Accounting Close date it belongs to). The formula in schedule.js
// still runs normally for every other cycle. To restore a cell to its
// calculated value, delete its line here (or change it back in Table
// View and hit Save Changes again).
// ---------------------------------------------------------------------
const OVERRIDES = {
  // Example: staffingModel: { "2026-10-12": "2026-10-08" },
};

// Freeform Notes column text, one entry per month row.
const NOTES_OVERRIDES = {
  // Example: "October": "Board retreat this month.",
};