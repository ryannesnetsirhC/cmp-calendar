/**
 * SHARED SCHEDULE ENGINE
 * ----------------------
 * Both the Calendar page (events.js) and the Table View (table.js) load
 * this file and use it to compute every derived date from the anchors
 * in table-data.js. This is the ONLY place the date math lives, so the
 * two pages can never show different dates for the same thing — change
 * an anchor in table-data.js once, and both pages update.
 */

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function parseISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function monthNameOf(date) {
  return MONTH_NAMES[date.getMonth()];
}
function formatShort(date) {
  return `${MONTH_ABBR[date.getMonth()]} ${date.getDate()}`;
}

// Roll Sat/Sun back to the preceding Friday. Returns {date, adjusted}.
function rollToFriday(date) {
  const day = date.getDay(); // 0 = Sun, 6 = Sat
  if (day === 6) return { date: addDays(date, -1), adjusted: true };
  if (day === 0) return { date: addDays(date, -2), adjusted: true };
  return { date, adjusted: false };
}

function holidayFor(date) {
  return HOLIDAYS[toISO(date)] || null;
}

// Two board cycles' Staffing Model Updates Due would land during a full
// week school is out (Thanksgiving, Christmas) — hardcoded here to the
// Tuesday after school is back instead of the usual formula. Keyed by
// that cycle's Board Meeting date (from ANCHORS.boardMeetings).
const STAFFING_MODEL_HARDCODED = {
  "2026-12-14": "2026-12-01", // Thanksgiving week off; Tue after back (Mon 11/30)
  "2027-01-11": "2027-01-05", // Christmas week off; Tue after back (Mon 1/4)
};

// Computes every cycle from the ANCHORS in table-data.js.
function computeCycles() {
  const boardCycles = ANCHORS.boardMeetings.map((iso) => {
    const meeting = parseISO(iso);
    const rawMaterials = addDays(meeting, -3);
    const materials = rollToFriday(rawMaterials);
    const rawFinalReview = addDays(rawMaterials, -2);
    const finalReview = rollToFriday(rawFinalReview);
    const rawFinancialReview = addDays(rawFinalReview, -7);
    const financialReview = rollToFriday(rawFinancialReview);
    // Staffing Model Updates Due = Financial Review date minus 3 days
    // (often lands on a Sunday, which then rolls back to Friday) — unless
    // this cycle is hardcoded above.
    const hardcoded = STAFFING_MODEL_HARDCODED[iso];
    const rawStaffingModel = hardcoded ? parseISO(hardcoded) : addDays(financialReview.date, -3);
    const staffingModel = rollToFriday(rawStaffingModel);
    return {
      boardMeeting: { date: meeting, adjusted: false },
      boardMaterials: materials,
      finalFinancialReview: finalReview,
      financialReview: financialReview,
      staffingModel: staffingModel,
    };
  });

  const fcCycles = ANCHORS.financeCommittee.map((iso) => {
    const fc = parseISO(iso);
    const materials = rollToFriday(addDays(fc, -1));
    return {
      financeCommittee: { date: fc, adjusted: false },
      financeCommitteeMaterials: materials,
    };
  });

  const acctCycles = ANCHORS.accountingClose.map((iso) => {
    const close = parseISO(iso);
    const docs = rollToFriday(addDays(close, -6));
    return {
      acctClose: { date: close, adjusted: false },
      docsToVertex: docs,
    };
  });

  return { boardCycles, fcCycles, acctCycles };
}

// Flattens computeCycles() into a Calendar-ready EVENTS array
// ({date, title, category, note}) — used by events.js.
function buildCalendarEvents() {
  const { boardCycles, fcCycles, acctCycles } = computeCycles();
  const events = [];

  function push(item, title, category) {
    const day = item.date.getDay();
    const holiday = holidayFor(item.date);
    const notes = [];
    if (item.adjusted) {
      notes.push("Moved from a weekend to this Friday");
    } else if (day === 0 || day === 6) {
      notes.push(day === 6 ? "Falls on a Saturday" : "Falls on a Sunday");
    }
    if (holiday) notes.push(`Falls on ${holiday}`);
    events.push({
      date: toISO(item.date),
      title,
      category,
      note: notes.join("; ") || undefined,
    });
  }

  boardCycles.forEach((c) => {
    push(c.boardMeeting, "Board Meeting", "boardMeeting");
    push(c.boardMaterials, "Board Materials Ready", "boardMaterials");
    push(c.finalFinancialReview, "Final Financial Review", "finalFinancialReview");
    push(c.financialReview, "Financial Review", "financialReview");
    push(c.staffingModel, "Staffing Model Updates Due", "staffingModel");
  });
  fcCycles.forEach((c) => {
    push(c.financeCommittee, "Finance Committee", "financeCommittee");
    push(c.financeCommitteeMaterials, "FC Materials Ready", "financeCommitteeMaterials");
  });
  acctCycles.forEach((c) => {
    push(c.acctClose, "Accounting Close", "acctClose");
    push(c.docsToVertex, "Documents Due to Vertex", "docsToVertex");
  });

  return events;
}