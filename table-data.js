/**
 * TABLE VIEW DATA — 2026-27 school year
 * --------------------------------------
 * This file holds only the real "anchor" dates you gave us. Everything
 * else (Board Materials Ready, Final Financial Review, FC Materials
 * Ready, Documents Due to Vertex) is CALCULATED from these anchors by
 * table.js using the rules you specified:
 *   - Board Materials Ready  = Board Meeting date  minus 3 days
 *   - Final Financial Review = Board Materials Ready minus 2 days
 *   - FC Materials Ready     = Finance Committee date minus 1 day
 *   - Documents Due to Vertex = Accounting Close date minus 6 days
 *   - Financial Review = Final Financial Review date minus 7 days
 * If a calculated date lands on a Saturday or Sunday, it's automatically
 * rolled back to the preceding Friday (marked with * in the table).
 * If a calculated OR given date lands on a known school holiday, it's
 * marked with † (shown, not moved).
 *
 * TO UPDATE: add/edit dates in the arrays below ("YYYY-MM-DD").
 * Nothing else in this file needs to change.
 *
 * Still blank this round (no data given yet) — Principal Meeting (and
 * therefore Principal Materials Ready, which depends on it), Payroll/HR
 * Check In, and Coding Check In. Add data for these the same way once
 * you have it.
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
  accountingClose: [
    "2026-08-24", "2026-09-18", "2026-10-12", "2026-11-13",
    // Add Dec 2026 – Jun 2027 accounting close dates here once you have them.
  ],
  staffingModel: [
    "2026-09-15", "2026-10-12",
    // Add more Staffing Model Updates Due dates here once you have them.
  ],
};

// Common school-calendar holidays for this range — used only to flag
// dates with a †, never to move them. Add more if you spot a collision.
const HOLIDAYS = {
  "2026-09-07": "Labor Day",
  "2026-11-11": "Veterans Day",
  "2026-11-26": "Thanksgiving",
  "2026-11-27": "Day after Thanksgiving",
  "2026-12-25": "Christmas Day",
  "2027-01-01": "New Year's Day",
  "2027-01-18": "MLK Day (observed)",
  "2027-02-15": "Presidents Day (observed)",
  "2027-03-31": "Cesar Chavez Day",
  "2027-05-31": "Memorial Day",
  "2027-06-19": "Juneteenth",
};

const TABLE_META = {
  title: "2026-27 CMP Monthly Financial Calendar",
  updated: "",
  footnote: "Board Meetings: 9am–12pm  •  * = moved from a weekend to the prior Friday   † = falls on a school holiday",
};

// Column order, left to right. "role" tags which position-type filter
// a column belongs to (null = only shows under "All").
const TABLE_COLUMNS = [
  { key: "docsToVertex", label: "Documents due to Vertex", owner: "Kosha/AP, SpEd", cadence: "6 Days Prior", role: "koshaap" },
  { key: "acctClose", label: "Accounting Close", owner: "EdTec", cadence: "Varies", role: null },
  { key: "staffingModel", label: "Staffing Model Updates Due", owner: "HR", cadence: "", role: "hr" },
  { key: "financialReview", label: "Financial Review", owner: "Varies", cadence: "Wednesday", role: null },
  { key: "principalMaterials", label: "Principal Materials Ready", owner: "EdTec", cadence: "Thursday", role: "principals" },
  { key: "principalMeeting", label: "Principal Meeting", owner: "EdTec, Principals", cadence: "Friday", role: "principals" },
  { key: "financeCommitteeMaterials", label: "Finance Committee Materials Ready", owner: "EdTec", cadence: "1 Day Prior", role: null },
  { key: "finalFinancialReview", label: "Final Financial Review", owner: "Matt/EdTec", cadence: "", role: "matt" },
  { key: "financeCommittee", label: "Finance Committee", owner: "EdTec, Finance Committee", cadence: "", role: null },
  { key: "boardMaterials", label: "Board Materials Ready", owner: "EdTec", cadence: "3 Days Prior", role: null },
  { key: "boardMeeting", label: "Board Meeting", owner: "", cadence: "", role: null },
  { key: "payrollCheckIn", label: "Payroll/HR Check In", owner: "Sinnai/Meghan/EdTec", cadence: "", role: "hr" },
  { key: "codingCheckIn", label: "Coding Check In", owner: "Kosha/EdTec", cadence: "", role: "koshaap" },
];

const ROLE_FILTERS = [
  { key: "all", label: "All" },
  { key: "hr", label: "HR" },
  { key: "principals", label: "Principals/Site Leads" },
  { key: "matt", label: "Matt" },
  { key: "koshaap", label: "Kosha/AP" },
];

// Row order for the grid — a full school year, July through June.
const MONTH_ORDER = [
  "July", "August", "September", "October", "November", "December",
  "January", "February", "March", "April", "May", "June",
];