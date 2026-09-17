/**
 * TABLE VIEW DATA
 * ---------------
 * Drives table.html — a spreadsheet-style grid (months as rows,
 * activity types as columns), matching the layout of the CMP Monthly
 * Financial Calendar.
 *
 * This was transcribed from a screenshot of that spreadsheet, so a
 * few cells need your eyes before this goes to a client:
 *   - July / "Documents due to EdTec": source showed #VALUE! (a
 *     formula error in the original sheet) — left blank here.
 *   - September / "Documents due to EdTec": source column was too
 *     narrow to read (showed ###########) — left blank here.
 *   - April / "Coding Check In": source showed "22-Jan", which looks
 *     out of place in an April row — double check this one.
 *   - The original had a second, empty "August" row right after the
 *     filled-in one; it looked like a stray blank row, so it's not
 *     included here. Add it back if it was intentional.
 * Everything else was legible and transcribed as shown.
 */

const TABLE_META = {
  title: "2025-26 CMP Monthly Financial Calendar",
  updated: "10/21/2025",
  footnote: "Board Meetings: 9am–12pm",
};

// Column order matches the source sheet, left to right.
const TABLE_COLUMNS = [
  { key: "docsToEdTec", label: "Documents due to EdTec", owner: "Kosha/AP, SpEd", cadence: "5 Days Prior" },
  { key: "acctClose", label: "Accounting Close", owner: "EdTec", cadence: "Varies" },
  { key: "staffingModel", label: "Staffing Model Updates Due", owner: "HR", cadence: "" },
  { key: "financialReview", label: "Financial Review", owner: "Varies", cadence: "Wednesday" },
  { key: "principalMaterials", label: "Principal Materials Ready", owner: "EdTec", cadence: "Thursday" },
  { key: "principalMeeting", label: "Principal Meeting", owner: "EdTec, Principals", cadence: "Friday" },
  { key: "financeCommitteeMaterials", label: "Finance Committee Materials Ready", owner: "EdTec", cadence: "Tuesday" },
  { key: "finalFinancialReview", label: "Final Financial Review", owner: "Matt/EdTec", cadence: "Wednesday" },
  { key: "financeCommittee", label: "Finance Committee", owner: "EdTec, Finance Committee", cadence: "Thursday" },
  { key: "boardMaterials", label: "Board Materials Ready", owner: "EdTec", cadence: "Friday" },
  { key: "boardMeeting", label: "Board Meeting", owner: "", cadence: "Monday" },
  { key: "payrollCheckIn", label: "Payroll/HR Check In", owner: "Sinnai/Meghan/EdTec", cadence: "" },
  { key: "codingCheckIn", label: "Coding Check In", owner: "Kosha/EdTec", cadence: "" },
];

// highlight: "row"  -> whole row shaded (major board deliverable months)
//            "note" -> just the Notes cell shaded (no-presentation months)
//            null   -> no shading
const TABLE_MONTHS = [
  {
    month: "July", highlight: null, notes: "",
    values: {},
  },
  {
    month: "August", highlight: null, notes: "",
    values: {
      docsToEdTec: "", acctClose: "w/August (9/22)", staffingModel: "26-Jul",
      financialReview: "28-Jul", principalMaterials: "", principalMeeting: "-",
      financeCommitteeMaterials: "3-Aug", finalFinancialReview: "4-Aug",
      financeCommittee: "", boardMaterials: "6-Aug", boardMeeting: "9-Aug",
      payrollCheckIn: "", codingCheckIn: "",
    },
  },
  {
    month: "September", highlight: null, notes: "24-25 Unaudited Actuals",
    values: {
      docsToEdTec: "", acctClose: "", staffingModel: "25-Aug",
      financialReview: "27-Aug", principalMaterials: "28-Aug", principalMeeting: "29-Aug",
      financeCommitteeMaterials: "2-Sep", finalFinancialReview: "3-Sep",
      financeCommittee: "4-Sep", boardMaterials: "5-Sep", boardMeeting: "8-Sep",
      payrollCheckIn: "", codingCheckIn: "",
    },
  },
  {
    month: "October", highlight: "note", notes: "NO PRESENTATION - internal August financial update",
    values: {
      docsToEdTec: "12-Sep", acctClose: "18-Sep", staffingModel: "29-Sep",
      financialReview: "1-Oct", principalMaterials: "2-Oct", principalMeeting: "3-Oct",
      financeCommitteeMaterials: "", finalFinancialReview: "8-Oct",
      financeCommittee: "", boardMaterials: "10-Oct", boardMeeting: "13-Oct",
      payrollCheckIn: "20-Oct", codingCheckIn: "",
    },
  },
  {
    month: "November", highlight: "note", notes: "NO PRESENTATION",
    values: {
      docsToEdTec: "18-Oct", acctClose: "23-Oct", staffingModel: "27-Oct",
      financialReview: "29-Oct", principalMaterials: "30-Oct", principalMeeting: "31-Oct",
      financeCommitteeMaterials: "", finalFinancialReview: "5-Nov",
      financeCommittee: "", boardMaterials: "7-Nov", boardMeeting: "10-Nov",
      payrollCheckIn: "", codingCheckIn: "",
    },
  },
  {
    month: "December", highlight: "row", notes: "24-25 Audit and First Interim (October 2025) Financials",
    values: {
      docsToEdTec: "18-Nov", acctClose: "24-Nov", staffingModel: "17-Nov",
      financialReview: "19-Nov", principalMaterials: "26-Nov", principalMeeting: "1-Dec",
      financeCommitteeMaterials: "3-Dec", finalFinancialReview: "3-Dec",
      financeCommittee: "4-Dec", boardMaterials: "5-Dec", boardMeeting: "8-Dec",
      payrollCheckIn: "-", codingCheckIn: "-",
    },
  },
  {
    month: "January", highlight: null,
    notes: "NO PRESENTATION; payroll check in (Sept-Nov) and internal November financials",
    values: {
      docsToEdTec: "11-Dec", acctClose: "18-Dec", staffingModel: "15-Dec",
      financialReview: "17-Dec", principalMaterials: "2-Jan", principalMeeting: "5-Jan",
      financeCommitteeMaterials: "-", finalFinancialReview: "7-Jan",
      financeCommittee: "-", boardMaterials: "9-Jan", boardMeeting: "12-Jan",
      payrollCheckIn: "12-Jan", codingCheckIn: "21-Jan",
    },
  },
  {
    month: "February", highlight: null, notes: "NO PRESENTATION; internal December financials",
    values: {
      docsToEdTec: "4-Jan", acctClose: "9-Jan", staffingModel: "26-Jan",
      financialReview: "28-Jan", principalMaterials: "29-Jan", principalMeeting: "30-Jan",
      financeCommitteeMaterials: "", finalFinancialReview: "4-Feb",
      financeCommittee: "", boardMaterials: "6-Feb", boardMeeting: "9-Feb",
      payrollCheckIn: "", codingCheckIn: "",
    },
  },
  {
    month: "March", highlight: "row", notes: "Second Interim (January 2026) Financials",
    values: {
      docsToEdTec: "17-Feb", acctClose: "23-Feb", staffingModel: "23-Feb",
      financialReview: "25-Feb", principalMaterials: "26-Feb", principalMeeting: "27-Feb",
      financeCommitteeMaterials: "4-Mar", finalFinancialReview: "4-Mar",
      financeCommittee: "5-Mar", boardMaterials: "6-Mar", boardMeeting: "9-Mar",
      payrollCheckIn: "-", codingCheckIn: "-",
    },
  },
  {
    month: "April", highlight: null,
    notes: "NO BOARD PRESENTATION; payroll check in (Dec-Feb) and internal February financials",
    values: {
      docsToEdTec: "13-Mar", acctClose: "19-Mar", staffingModel: "30-Mar",
      financialReview: "1-Apr", principalMaterials: "2-Apr", principalMeeting: "3-Apr",
      financeCommitteeMaterials: "", finalFinancialReview: "8-Apr",
      financeCommittee: "", boardMaterials: "10-Apr", boardMeeting: "13-Apr",
      payrollCheckIn: "13-Apr", codingCheckIn: "22-Jan",
    },
  },
  {
    month: "May", highlight: null, notes: "March 2026 Financials, 26-27 Budget Draft",
    values: {
      docsToEdTec: "3-Apr", acctClose: "9-Apr", staffingModel: "27-Apr",
      financialReview: "29-Apr", principalMaterials: "30-Apr", principalMeeting: "1-May",
      financeCommitteeMaterials: "", finalFinancialReview: "6-May",
      financeCommittee: "7-May", boardMaterials: "8-May", boardMeeting: "11-May",
      payrollCheckIn: "-", codingCheckIn: "",
    },
  },
  {
    month: "June", highlight: "row", notes: "26-27 Budget Approval, April 2026 Financials",
    values: {
      docsToEdTec: "15-May", acctClose: "21-May", staffingModel: "1-Jun",
      financialReview: "3-Jun", principalMaterials: "4-Jun", principalMeeting: "5-Jun",
      financeCommitteeMaterials: "10-Jun", finalFinancialReview: "10-Jun",
      financeCommittee: "11-Jun", boardMaterials: "12-Jun", boardMeeting: "15-Jun",
      payrollCheckIn: "-", codingCheckIn: "-",
    },
  },
];