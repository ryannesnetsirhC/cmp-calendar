/**
 * EVENTS DATA — Calendar (month-grid) view
 * -----------------------------------------
 * The actual dates are NOT edited here — they come from ANCHORS in
 * table-data.js via schedule.js (the same engine the Table View uses),
 * so the two pages can never fall out of sync. To change a date, edit
 * table-data.js and both pages update automatically.
 *
 * This file only controls how each type of date is labeled and colored
 * on the Calendar page.
 */

const CATEGORIES = {
  boardMeeting:              { label: "Board Meeting",                color: "#1F4B36" },
  boardMaterials:            { label: "Board Materials Ready",        color: "#2E6B4F" },
  finalFinancialReview:      { label: "Final Financial Review",       color: "#4F8F72" },
  financialReview:           { label: "Financial Review",             color: "#7EB39B" },
  financeCommittee:          { label: "Finance Committee",            color: "#3E6FA8" },
  financeCommitteeMaterials: { label: "FC Materials Ready",           color: "#7FA4CC" },
  acctClose:                 { label: "Accounting Close",             color: "#6B4A8A" },
  docsToVertex:              { label: "Documents Due to Vertex",      color: "#A084B8" },
  staffingModel:             { label: "Staffing Model Updates Due",   color: "#C9973B" },
};

const EVENTS = buildCalendarEvents();